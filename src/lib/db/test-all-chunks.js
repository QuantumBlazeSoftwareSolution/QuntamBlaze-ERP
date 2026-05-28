const fs = require("fs");
const path = require("path");
const { GoogleGenAI } = require("@google/generative-ai");
require("dotenv").config();

// Load Gemini Config
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("GEMINI_API_KEY is not set in environment");
  process.exit(1);
}

// 1. Helper to split text
function splitTextIntoChunks(text, wordsPerChunk = 500) {
  const chunks = [];
  const paragraphs = text.split(/\n\s*\n/);
  let currentChunk = "";

  for (const paragraph of paragraphs) {
    if ((currentChunk + paragraph).split(/\s+/).length > wordsPerChunk) {
      if (currentChunk.trim()) {
        chunks.push(currentChunk.trim());
      }
      currentChunk = paragraph;
    } else {
      currentChunk += (currentChunk ? "\n\n" : "") + paragraph;
    }
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  if (chunks.length === 0) {
    const words = text.trim().split(/\s+/);
    for (let i = 0; i < words.length; i += wordsPerChunk) {
      chunks.push(words.slice(i, i + wordsPerChunk).join(" "));
    }
  }

  return chunks.filter((c) => c.length > 0);
}

// 2. Helper to embed text
async function embedText(text) {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "models/text-embedding-004",
          content: { parts: [{ text }] },
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Google API error: ${response.status} - ${errText}`);
    }

    const data = await response.json();
    return data.embedding.values;
  } catch (err) {
    console.error("Embedding API error:", err);
    throw err;
  }
}

async function run() {
  try {
    console.log("Loading defaultKnowledge.json...");
    const filePath = path.join(__dirname, "../data/defaultKnowledge.json");
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const defaultDocs = JSON.parse(fileContent);

    console.log(`Loaded ${defaultDocs.length} documents.`);

    for (const doc of defaultDocs) {
      console.log(`\nDocument: "${doc.title}"`);
      const chunks = splitTextIntoChunks(doc.content);
      console.log(`Splits into ${chunks.length} chunks.`);

      for (let i = 0; i < chunks.length; i++) {
        console.log(`Embedding chunk ${i + 1}/${chunks.length} (length: ${chunks[i].length} chars)...`);
        const vector = await embedText(chunks[i]);
        console.log(`-> Vector dimension: ${vector.length}`);
        
        // Validate vector size
        if (vector.length !== 768) {
          console.error(`ERROR: Chunk ${i + 1} has invalid dimension size: ${vector.length}`);
        }

        // Validate values
        const hasNaN = vector.some(v => isNaN(v));
        const hasNull = vector.some(v => v === null || v === undefined);
        if (hasNaN || hasNull) {
          console.error(`ERROR: Chunk ${i + 1} contains NaN or Null values!`);
        }
      }
    }

    console.log("\nALL CHUNKS VALIDATED SUCCESSFULLY!");

  } catch (err) {
    console.error("FAILED validation:", err);
  }
}

run();
