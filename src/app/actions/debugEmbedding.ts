"use server";

import { db } from "@/lib/db";
import { systemConfig } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function debugEmbeddingModelsAction() {
  try {
    const record = await db
      .select()
      .from(systemConfig)
      .where(eq(systemConfig.key, "gemini_config"))
      .limit(1);

    if (!record || record.length === 0) {
      return { success: false, error: "Gemini not configured" };
    }

    const cfg = record[0].value as { apiKey?: string };
    if (!cfg?.apiKey) return { success: false, error: "No API key" };

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${cfg.apiKey}`,
      { method: "GET" }
    );

    const data = await res.json() as any;
    const models: any[] = data?.models || [];

    const embeddingModels = models
      .filter((m: any) => m.supportedGenerationMethods?.includes("embedContent"))
      .map((m: any) => ({ name: m.name, displayName: m.displayName }));

    const generateModels = models
      .filter((m: any) => m.supportedGenerationMethods?.includes("generateContent"))
      .map((m: any) => m.name);

    return {
      success: true,
      totalModels: models.length,
      embeddingModels,
      generateModels,
    };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
