"use server";

import { db } from "@/lib/db";
import { systemConfig } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { saveSystemConfigAction } from "./config";

export async function saveGeminiConfigAction(apiKey: string, baseModel: string) {
  try {
    if (!apiKey || !baseModel) {
      throw new Error("API key and Preferred Model are both required.");
    }
    const config = { apiKey, baseModel };
    await saveSystemConfigAction("gemini_config", config);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to save Gemini configuration." };
  }
}

export async function getGeminiStatusAction() {
  try {
    const record = await db
      .select()
      .from(systemConfig)
      .where(eq(systemConfig.key, "gemini_config"))
      .limit(1);

    if (record && record.length > 0 && record[0].value) {
      const config = record[0].value as any;

      // Mask the API Key for client safety (e.g. show only first 4 and last 4 characters, mask rest)
      const rawKey = config.apiKey || "";
      let maskedKey = "";
      if (rawKey.length > 8) {
        maskedKey = `${rawKey.slice(0, 4)}••••••••${rawKey.slice(-4)}`;
      } else if (rawKey) {
        maskedKey = "••••••••";
      }

      return {
        success: true,
        isConfigured: !!(config.apiKey && config.baseModel),
        maskedApiKey: maskedKey,
        baseModel: config.baseModel || "gemini-2.0-flash",
      };
    }

    return { success: true, isConfigured: false, baseModel: "gemini-2.0-flash" };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to read Gemini configuration." };
  }
}

export async function disconnectGeminiAction() {
  try {
    await db.delete(systemConfig).where(eq(systemConfig.key, "gemini_config"));
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to disconnect Gemini." };
  }
}

export async function testGeminiConnectionAction(apiKey: string, baseModel: string) {
  try {
    if (!apiKey) {
      throw new Error("API key is required to test the connection.");
    }
    if (!baseModel) {
      throw new Error("Base model selection is required.");
    }

    // Call the official Google Gemini API using native fetch
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${baseModel}:generateContent?key=${apiKey}`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: "Hello! Answer in exactly one word: 'SUCCESS'. This is a validation test from QuantumBlaze ERP.",
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const apiErrorMessage =
        errorData?.error?.message || `HTTP ${response.status} ${response.statusText}`;
      throw new Error(`Gemini API connection check failed: ${apiErrorMessage}`);
    }

    const data = await response.json();
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

    if (!candidateText) {
      throw new Error("Connected but received an empty response from Gemini API.");
    }

    return {
      success: true,
      message: `Connection successful! Model response: "${candidateText}"`,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "Connection failed. Please check your API key and try again.",
    };
  }
}

export async function getAvailableGeminiModelsAction(apiKey?: string) {
  try {
    let keyToUse = apiKey || "";

    // If no key is provided, or if it is a masked key, we load the raw key from DB
    if (!keyToUse || keyToUse.includes("••••")) {
      const record = await db
        .select()
        .from(systemConfig)
        .where(eq(systemConfig.key, "gemini_config"))
        .limit(1);

      if (record && record.length > 0 && record[0].value) {
        const config = record[0].value as any;
        keyToUse = config.apiKey || "";
      }
    }

    if (!keyToUse) {
      return { success: true, models: [] };
    }

    // Call the official Google models list endpoint
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models?key=${keyToUse}`;
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const apiErrorMessage =
        errorData?.error?.message || `HTTP ${response.status} ${response.statusText}`;
      throw new Error(`Failed to fetch models: ${apiErrorMessage}`);
    }

    const data = await response.json();
    const rawModels = data?.models || [];

    // Filter to only include text generation models
    // They must support "generateContent" in supportedGenerationMethods
    // And generally we want models starting with "models/gemini-"
    const filteredModels = rawModels
      .filter((m: any) => {
        const name = m.name || "";
        const isGemini = name.startsWith("models/gemini-");
        const supportsGenerate = m.supportedGenerationMethods?.includes("generateContent");
        return isGemini && supportsGenerate;
      })
      .map((m: any) => {
        // Strip the "models/" prefix
        const id = m.name.replace("models/", "");
        return {
          id,
          name: m.name,
          displayName: m.displayName || id,
          description: m.description || "",
        };
      });

    return { success: true, models: filteredModels };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to retrieve available models." };
  }
}
