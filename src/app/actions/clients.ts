"use server";

import { db } from "@/lib/db";
import { clients } from "@/lib/db/schema";
import { incrementAndGet, previewNextSequence } from "@/lib/db/idTracker";
import { generateNextId } from "@/lib/idEngine";
import { revalidatePath } from "next/cache";
import { eq, ilike } from "drizzle-orm";
import { logAction } from "@/lib/logger";

export async function previewClientIdAction(companyName: string) {
  if (!companyName || companyName.trim() === "") {
    return "CLI-NEW-26-0XX";
  }

  // Same logic as in generateClientId / generateNextId
  let abbr = companyName.replace(/[^a-zA-Z0-9]/g, "").slice(0, 4).toUpperCase();
  if (abbr.length === 0) {
    abbr = "NEWX";
  } else if (abbr.length < 4) {
    abbr = abbr.padEnd(4, "X");
  }

  // The id is "CLIENT" for the global client counter in idTracker
  const nextSeq = await previewNextSequence("CLIENT");
  
  // Format the ID using our idEngine
  return generateNextId("CLI", nextSeq, { compAbbr: abbr });
}

export async function createClientAction(formData: FormData) {
  const name = formData.get("name") as string;
  let industry = formData.get("industry") as string;
  const customIndustry = formData.get("customIndustry") as string;
  
  if (!name || name.trim() === "") {
    return { success: false, error: "Company name is required." };
  }
  
  if (industry === "Other" && customIndustry && customIndustry.trim() !== "") {
    industry = customIndustry.trim();
  } else if (industry === "Other") {
    industry = "Unknown";
  }
  
  let abbr = name.replace(/[^a-zA-Z0-9]/g, "").slice(0, 4).toUpperCase();
  if (abbr.length === 0) abbr = "NEWX";
  else if (abbr.length < 4) abbr = abbr.padEnd(4, "X");

  try {
    // 1. Get the authoritative, transaction-safe sequence ID
    const nextSeq = await incrementAndGet("CLIENT", "CLI");
    
    // 2. Generate final ID
    const clientId = generateNextId("CLI", nextSeq, { compAbbr: abbr });
    
    // 3. Insert into DB
    await db.insert(clients).values({
      id: clientId,
      name: name.trim(),
      industry: industry,
      status: "Active",
      totalBilled: "0",
    });

    revalidatePath("/clients");
    return { success: true, clientId };
  } catch (error) {
    console.error("Failed to create client:", error);
    return { success: false, error: "Database error while creating client." };
  }
}

export async function updateClientAction(clientId: string, formData: FormData) {
  const name = formData.get("name") as string;
  let industry = formData.get("industry") as string;
  const customIndustry = formData.get("customIndustry") as string;
  const contactPerson = formData.get("contactPerson") as string;
  const contactEmail = formData.get("contactEmail") as string;
  const contactPhone = formData.get("contactPhone") as string;
  const billingAddress = formData.get("billingAddress") as string;
  const paymentTerms = formData.get("paymentTerms") as string;
  const status = formData.get("status") as string;
  
  if (!name || name.trim() === "") {
    return { success: false, error: "Company name is required." };
  }
  
  if (industry === "Other" && customIndustry && customIndustry.trim() !== "") {
    industry = customIndustry.trim();
  } else if (industry === "Other") {
    industry = "Unknown";
  }

  try {
    // Fetch previous values for logging
    const previousClient = await db.query.clients.findFirst({
      where: eq(clients.id, clientId)
    });

    if (!previousClient) {
      return { success: false, error: "Client not found." };
    }

    const newData = {
      name: name.trim(),
      industry,
      contactPerson,
      contactEmail,
      contactPhone,
      billingAddress,
      paymentTerms,
      status: status || previousClient.status,
    };

    // Update in DB
    await db
      .update(clients)
      .set({ ...newData, updatedAt: new Date() })
      .where(eq(clients.id, clientId));

    // Log the action
    await logAction(clientId, "CLIENT", {
      actionName: "EDIT_CLIENT_PROFILE",
      actor: "System Admin", // Placeholder until auth is added
      description: `Updated profile for client ${clientId}`,
      time: new Date().toISOString(),
      previousValue: previousClient,
      newValue: { ...previousClient, ...newData, updatedAt: new Date() },
    });

    revalidatePath("/clients");
    revalidatePath(`/clients/${clientId}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to update client:", error);
    return { success: false, error: "Database error while updating client." };
  }
}

export async function searchClientsAction(query: string) {
  try {
    const results = await db.query.clients.findMany({
      where: query ? ilike(clients.name, `%${query}%`) : undefined,
      columns: {
        id: true,
        name: true,
      },
      limit: 20,
    });
    return { success: true, clients: results };
  } catch (error) {
    console.error("Search clients failed:", error);
    return { success: false, clients: [] };
  }
}
