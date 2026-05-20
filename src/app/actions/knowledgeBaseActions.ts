"use server";

import { db } from "@/lib/db";
import { knowledgeDocuments, knowledgeChunks } from "@/lib/db/schema/knowledgeBase";
import { systemConfig } from "@/lib/db/schema";
import { eq, sql, isNull, count } from "drizzle-orm";
import { getCurrentSessionAction } from "./auth";
import { v4 as uuidv4 } from "uuid";
import { revalidatePath } from "next/cache";
import { GoogleGenerativeAI } from "@google/generative-ai";

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/** Load the raw Gemini API key + base model from systemConfig. */
async function getGeminiConfig(): Promise<{ apiKey: string; baseModel: string } | null> {
  const record = await db
    .select()
    .from(systemConfig)
    .where(eq(systemConfig.key, "gemini_config"))
    .limit(1);

  if (!record || record.length === 0 || !record[0].value) return null;

  const cfg = record[0].value as { apiKey?: string; baseModel?: string };
  if (!cfg.apiKey) return null;

  return {
    apiKey: cfg.apiKey,
    baseModel: cfg.baseModel || "gemini-1.5-flash",
  };
}

/**
 * Split a long text into chunks of ~500 words, preserving paragraph boundaries
 * where possible. Returns an array of non-empty string chunks.
 */
function splitIntoChunks(text: string, wordsPerChunk = 500): string[] {
  const paragraphs = text.split(/\n{2,}/).filter((p) => p.trim().length > 0);
  const chunks: string[] = [];
  let current = "";
  let wordCount = 0;

  for (const para of paragraphs) {
    const paraWords = para.trim().split(/\s+/).length;

    if (wordCount + paraWords > wordsPerChunk && current.trim()) {
      chunks.push(current.trim());
      current = para;
      wordCount = paraWords;
    } else {
      current += (current ? "\n\n" : "") + para;
      wordCount += paraWords;
    }
  }

  if (current.trim()) chunks.push(current.trim());

  // Fall back: if no paragraph breaks, just split by word count
  if (chunks.length === 0) {
    const words = text.trim().split(/\s+/);
    for (let i = 0; i < words.length; i += wordsPerChunk) {
      chunks.push(words.slice(i, i + wordsPerChunk).join(" "));
    }
  }

  return chunks.filter((c) => c.length > 0);
}

/**
 * Serialize a number[] as a Postgres vector literal string.
 * e.g. [0.1, 0.2, ...] → "[0.1,0.2,...]"
 */
function toVectorLiteral(vec: number[]): string {
  return `[${vec.join(",")}]`;
}

// ---------------------------------------------------------------------------
// Document CRUD
// ---------------------------------------------------------------------------

export async function getKnowledgeDocumentsAction() {
  try {
    const docs = await db
      .select()
      .from(knowledgeDocuments)
      .where(isNull(knowledgeDocuments.deletedAt))
      .orderBy(sql`${knowledgeDocuments.updatedAt} DESC`);

    return { success: true, documents: docs };
  } catch (err: any) {
    console.error("[KB] getKnowledgeDocuments:", err);
    return { success: false, error: err.message || "Failed to fetch documents." };
  }
}

export async function createKnowledgeDocumentAction(data: {
  title: string;
  description?: string;
  category?: string;
  content: string;
}) {
  try {
    const session = await getCurrentSessionAction();
    if (!session?.userId) return { success: false, error: "Unauthorized." };

    if (!data.title?.trim()) return { success: false, error: "Title is required." };
    if (!data.content?.trim()) return { success: false, error: "Content is required." };

    const id = `KBD-${uuidv4().substring(0, 8).toUpperCase()}`;

    await db.insert(knowledgeDocuments).values({
      id,
      title: data.title.trim(),
      description: data.description?.trim() || null,
      category: data.category || "General",
      sourceType: "manual",
      status: "active",
      chunkCount: 0,
      createdBy: session.userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    revalidatePath("/dashboard/knowledge-base");
    return { success: true, documentId: id };
  } catch (err: any) {
    console.error("[KB] createKnowledgeDocument:", err);
    return { success: false, error: err.message || "Failed to create document." };
  }
}

export async function updateKnowledgeDocumentAction(
  id: string,
  data: { title?: string; description?: string; category?: string; status?: string }
) {
  try {
    const session = await getCurrentSessionAction();
    if (!session?.userId) return { success: false, error: "Unauthorized." };

    const updates: any = { updatedAt: new Date() };
    if (data.title !== undefined) updates.title = data.title.trim();
    if (data.description !== undefined) updates.description = data.description?.trim() || null;
    if (data.category !== undefined) updates.category = data.category;
    if (data.status !== undefined) updates.status = data.status;

    await db
      .update(knowledgeDocuments)
      .set(updates)
      .where(eq(knowledgeDocuments.id, id));

    revalidatePath("/dashboard/knowledge-base");
    return { success: true };
  } catch (err: any) {
    console.error("[KB] updateKnowledgeDocument:", err);
    return { success: false, error: err.message || "Failed to update document." };
  }
}

export async function deleteKnowledgeDocumentAction(id: string) {
  try {
    const session = await getCurrentSessionAction();
    if (!session?.userId) return { success: false, error: "Unauthorized." };

    // Hard delete — cascade removes all associated chunks via FK constraint
    await db.delete(knowledgeDocuments).where(eq(knowledgeDocuments.id, id));

    revalidatePath("/dashboard/knowledge-base");
    return { success: true };
  } catch (err: any) {
    console.error("[KB] deleteKnowledgeDocument:", err);
    return { success: false, error: err.message || "Failed to delete document." };
  }
}

// ---------------------------------------------------------------------------
// Embedding Pipeline
// ---------------------------------------------------------------------------

/**
 * Main embedding pipeline:
 * 1. Split fullText into ~500-word chunks
 * 2. For each chunk: call Gemini text-embedding-004 → get 768-dim vector
 * 3. Delete old chunks for this document
 * 4. Batch insert new knowledge_chunks rows
 * 5. Update knowledge_documents.chunkCount
 *
 * Returns an async generator that yields progress strings so the UI can show
 * live progress without SSE/WebSocket infrastructure.
 * For simplicity the server action returns a final status after completion.
 */
export async function embedKnowledgeDocumentAction(
  documentId: string,
  fullText: string
): Promise<{
  success: boolean;
  chunksEmbedded?: number;
  error?: string;
}> {
  try {
    // 1. Load Gemini credentials
    const geminiCfg = await getGeminiConfig();
    if (!geminiCfg) {
      return {
        success: false,
        error: "Gemini API is not configured. Please set up your API key in Settings → Integrations.",
      };
    }

    if (!fullText?.trim()) {
      return { success: false, error: "No content provided for embedding." };
    }

    const genAI = new GoogleGenerativeAI(geminiCfg.apiKey);
    const embeddingModel = genAI.getGenerativeModel({ model: "text-embedding-004" });

    // 2. Split text into chunks
    const chunks = splitIntoChunks(fullText, 500);
    if (chunks.length === 0) {
      return { success: false, error: "Could not extract any content chunks from the provided text." };
    }

    // 3. Embed each chunk sequentially (rate-limit safe)
    const embeddedChunks: Array<{
      id: string;
      documentId: string;
      content: string;
      chunkIndex: number;
      embedding: string; // vector literal for Postgres
      createdAt: Date;
    }> = [];

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const result = await embeddingModel.embedContent(chunk);
      const vector = result.embedding.values; // number[768]

      embeddedChunks.push({
        id: `KBC-${uuidv4().substring(0, 8).toUpperCase()}`,
        documentId,
        content: chunk,
        chunkIndex: i,
        embedding: toVectorLiteral(vector),
        createdAt: new Date(),
      });
    }

    // 4. Delete existing chunks for this document (re-embed support)
    await db
      .delete(knowledgeChunks)
      .where(eq(knowledgeChunks.documentId, documentId));

    // 5. Batch insert new chunks using raw SQL for the vector literal
    for (const c of embeddedChunks) {
      await db.execute(sql`
        INSERT INTO knowledge_chunks (id, document_id, content, chunk_index, embedding, created_at)
        VALUES (
          ${c.id},
          ${c.documentId},
          ${c.content},
          ${c.chunkIndex},
          ${c.embedding}::vector,
          ${c.createdAt}
        )
      `);
    }

    // 6. Update document chunkCount + updatedAt
    await db
      .update(knowledgeDocuments)
      .set({
        chunkCount: embeddedChunks.length,
        status: "active",
        updatedAt: new Date(),
      })
      .where(eq(knowledgeDocuments.id, documentId));

    revalidatePath("/dashboard/knowledge-base");

    return { success: true, chunksEmbedded: embeddedChunks.length };
  } catch (err: any) {
    console.error("[KB] embedKnowledgeDocument:", err);
    return {
      success: false,
      error: err.message || "Embedding failed. Please check your Gemini API key and try again.",
    };
  }
}

// ---------------------------------------------------------------------------
// RAG Query Engine
// ---------------------------------------------------------------------------

export async function askKnowledgeBaseAction(question: string): Promise<{
  success: boolean;
  answer?: string;
  sources?: Array<{ documentId: string; title: string; contentPreview: string; similarity: number }>;
  error?: string;
  noResults?: boolean;
}> {
  try {
    if (!question?.trim()) {
      return { success: false, error: "Please provide a question." };
    }

    // 1. Load Gemini credentials
    const geminiCfg = await getGeminiConfig();
    if (!geminiCfg) {
      return {
        success: false,
        error: "Gemini AI is not configured. Please add your API key in Settings → Integrations → Google Gemini AI.",
      };
    }

    const genAI = new GoogleGenerativeAI(geminiCfg.apiKey);

    // 2. Embed the user's question
    const embeddingModel = genAI.getGenerativeModel({ model: "text-embedding-004" });
    const embedResult = await embeddingModel.embedContent(question.trim());
    const questionVector = embedResult.embedding.values; // number[768]
    const vectorLiteral = toVectorLiteral(questionVector);

    // 3. pgvector cosine similarity search — find top 4 matching chunks
    const similarityThreshold = 0.35;
    const matchCount = 4;

    const matchingChunks = await db.execute<{
      chunk_id: string;
      document_id: string;
      content: string;
      similarity: number;
    }>(sql`
      SELECT
        kc.id         AS chunk_id,
        kc.document_id,
        kc.content,
        1 - (kc.embedding <=> ${vectorLiteral}::vector) AS similarity
      FROM knowledge_chunks kc
      INNER JOIN knowledge_documents kd ON kd.id = kc.document_id
      WHERE
        kd.status = 'active'
        AND kd.deleted_at IS NULL
        AND kc.embedding IS NOT NULL
        AND 1 - (kc.embedding <=> ${vectorLiteral}::vector) > ${similarityThreshold}
      ORDER BY kc.embedding <=> ${vectorLiteral}::vector
      LIMIT ${matchCount}
    `);

    const rows = (matchingChunks as any).rows ?? matchingChunks;

    if (!rows || rows.length === 0) {
      return {
        success: true,
        noResults: true,
        answer:
          "I couldn't find any relevant information in the knowledge base to answer your question. Try adding more documents or rephrasing your question.",
        sources: [],
      };
    }

    // 4. Fetch document titles for source citations
    const docIds = [...new Set(rows.map((r: any) => r.document_id as string))];
    const docRecords = await db
      .select({ id: knowledgeDocuments.id, title: knowledgeDocuments.title })
      .from(knowledgeDocuments)
      .where(sql`${knowledgeDocuments.id} = ANY(${sql.raw(`ARRAY[${docIds.map((d) => `'${d}'`).join(",")}]`)})`);

    const docTitleMap = Object.fromEntries(docRecords.map((d) => [d.id, d.title]));

    // 5. Assemble context for RAG prompt
    const contextText = rows
      .map((r: any, i: number) => `[Source ${i + 1}: ${docTitleMap[r.document_id] || "Unknown"}]\n${r.content}`)
      .join("\n\n---\n\n");

    // 6. Call Gemini chat model with structured RAG system prompt
    const chatModel = genAI.getGenerativeModel({ model: geminiCfg.baseModel });

    const ragPrompt = `You are QuantumBlaze ERP's intelligent Knowledge Base Assistant. 
Your ONLY job is to answer questions strictly based on the provided context from the knowledge base.

STRICT RULES:
1. Answer ONLY using information present in the context below.
2. If the answer is not in the context, say "I don't have information about that in the knowledge base."
3. Keep your answers concise, clear, and professional.
4. Do not hallucinate or add information not present in the context.
5. You may use bullet points or numbered lists for clarity.

---
KNOWLEDGE BASE CONTEXT:
${contextText}
---

USER QUESTION: ${question}

ANSWER:`;

    const result = await chatModel.generateContent(ragPrompt);
    const answer = result.response.text()?.trim() || "I was unable to generate a response.";

    // 7. Build source citations
    const sources = rows.map((r: any) => ({
      documentId: r.document_id,
      title: docTitleMap[r.document_id] || "Unknown Document",
      contentPreview: (r.content as string).substring(0, 120) + "...",
      similarity: Math.round((r.similarity as number) * 100),
    }));

    return { success: true, answer, sources };
  } catch (err: any) {
    console.error("[KB] askKnowledgeBase:", err);
    return {
      success: false,
      error: err.message || "An error occurred while processing your question.",
    };
  }
}

// ---------------------------------------------------------------------------
// Status Check
// ---------------------------------------------------------------------------

export async function checkKnowledgeBaseReadyAction() {
  try {
    const geminiCfg = await getGeminiConfig();

    const [docCountResult] = await db
      .select({ value: count() })
      .from(knowledgeDocuments)
      .where(isNull(knowledgeDocuments.deletedAt));

    const [chunkCountResult] = await db
      .select({ value: count() })
      .from(knowledgeChunks);

    return {
      success: true,
      geminiConfigured: !!geminiCfg,
      baseModel: geminiCfg?.baseModel || null,
      docCount: Number(docCountResult?.value ?? 0),
      chunkCount: Number(chunkCountResult?.value ?? 0),
    };
  } catch (err: any) {
    console.error("[KB] checkKnowledgeBaseReady:", err);
    return { success: false, geminiConfigured: false, docCount: 0, chunkCount: 0 };
  }
}
