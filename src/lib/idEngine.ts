import { Lead } from "@/types/lead";
import { Client } from "@/types/client";

/**
 * ID Engine for Quantum Blaze ERP
 * Generates structured IDs for all entities.
 */

export const IDEngine = {
  format: (prefix: string, sequence: number) => {
    return `${prefix}${sequence.toString().padStart(4, "0")}`;
  },
  
  prefixes: {
    CLIENT: "CLI-",
    PROJECT: "PRJ-",
    PRODUCT: "PRO-",
    QUOTATION: "QTO-",
    AGREEMENT: "AGR-",
    INVOICE: "INV-",
    RECEIPT: "RCT-",
    SERVICE: "SRS-",
    TASK: "TSK-",
    LEDGER: "LED-",
  } as const,
};

export type IDEnginePrefix = keyof typeof IDEngine.prefixes;

/**
 * Generates a unique User ID based on the provided full name.
 * Pattern: USR-[Initials]-[YY]-[Seq]
 * 
 * @param fullName The user's full name
 * @param sequence The sequence number (e.g., from DB)
 * @returns Formatted ID string (e.g., USR-JD-26-004)
 */
export function generateUserId(fullName: string, sequence: number): string {
  if (!fullName || fullName.trim() === "") return "";
  
  const words = fullName.trim().split(/\s+/);
  let initials = "";
  
  // Extract up to 2 initials
  if (words.length >= 2) {
    initials = `${words[0][0]}${words[1][0]}`;
  } else if (words.length === 1 && words[0].length >= 2) {
    initials = `${words[0][0]}${words[0][1]}`;
  } else if (words.length === 1 && words[0].length === 1) {
    initials = `${words[0][0]}X`;
  }
  
  initials = initials.toUpperCase();
  
  const yy = new Date().getFullYear().toString().slice(-2);
  const seq = sequence.toString().padStart(3, "0");
  
  return `USR-${initials}-${yy}-${seq}`;
}

// --- Project-scoped ID generators ---

const CLIENT_ABBR: Record<string, string> = {
  Google: "GOOG",
  Microsoft: "MSFT",
  Amazon: "AMZN",
  Meta: "META",
};

/** Generates a PRJ-ID from client name and existing client project count */
export function generateProjectId(clientName: string, existingCount: number): string {
  const abbr = CLIENT_ABBR[clientName] ?? clientName.slice(0, 4).toUpperCase();
  const year = new Date().getFullYear().toString().slice(-2);
  const seq = String(existingCount + 1).padStart(3, "0");
  return `PRJ-${abbr}-${year}-${seq}`;
}

/** Generates a CLI-ID from company name and existing client count */
export function generateClientId(companyName: string, existingCount: number): string {
  const abbr = companyName.slice(0, 4).toUpperCase();
  const year = new Date().getFullYear().toString().slice(-2);
  const seq = String(existingCount + 1).padStart(3, "0");
  return `CLI-${abbr}-${year}-${seq}`;
}

/** Generates an MST-ID for a milestone */
export function generateMilestoneId(prjId: string, seq: number): string {
  return `MST-${prjId}-${String(seq).padStart(2, "0")}`;
}

/** Generates a TSK-ID for a task */
export function generateTaskId(prjId: string, seq: number): string {
  return `TSK-${prjId}-${String(seq).padStart(2, "0")}`;
}

/** Generates an SRS document ID for a project */
export function generateSrsId(prjId: string): string {
  return `SRS-${prjId}`;
}

/** Converts a Lead to a Client object with generated CLI-ID */
export function convertLeadToClient(lead: Lead, existingClientCount: number): Client {
  return {
    id: generateClientId(lead.companyName, existingClientCount),
    name: lead.companyName,
    billingAddress: "", // To be filled in modal
    paymentTerms: "Net-30", // Default
    contactPerson: lead.contactName,
    contactEmail: lead.contactEmail,
    contactPhone: lead.contactPhone,
    joinedAt: new Date().toISOString(),
    industry: "Other",
    activeProjects: [],
    totalBilled: 0,
    status: "Active",
  };
}

/** Generates an INV-ID (INV-YYMM-Seq) */
export function generateInvoiceId(seq: number): string {
  const now = new Date();
  const yy = now.getFullYear().toString().slice(-2);
  const mm = (now.getMonth() + 1).toString().padStart(2, "0");
  return `INV-${yy}${mm}-${seq.toString().padStart(4, "0")}`;
}

/** Generates an RCT-ID (RCT-YYMM-Seq) */
export function generateReceiptId(seq: number): string {
  const now = new Date();
  const yy = now.getFullYear().toString().slice(-2);
  const mm = (now.getMonth() + 1).toString().padStart(2, "0");
  return `RCT-${yy}${mm}-${seq.toString().padStart(4, "0")}`;
}

export function generateNextId(type: string, seq: number, context?: { comp?: string, prjId?: string }): string {
  const now = new Date();
  const yy = now.getFullYear().toString().slice(-2);
  const mm = (now.getMonth() + 1).toString().padStart(2, "0");
  const seqStr = seq.toString().padStart(4, "0");
  const comp = context?.comp || "CORP";
  const prjId = context?.prjId || "PRJ-XXXX";

  switch (type) {
    case "CLI": return `CLI-${comp}-${yy}-${seqStr}`;
    case "PRJ": return `PRJ-${comp}-${yy}-${seqStr}`;
    case "PRO": return `PRO-${prjId}-${seqStr}`;
    case "INV": return `INV-${yy}${mm}-${seqStr}`;
    case "TSK": return `TSK-${prjId}-${seqStr}`;
    case "LED": return `LED-${yy}-${seqStr}`;
    case "QTO": return `QTO-${yy}${mm}-${seqStr}`;
    case "RCT": return `RCT-${yy}${mm}-${seqStr}`;
    case "AGR": return `AGR-${prjId}-V${seq}`;
    case "SRS": return `SRS-${prjId}`;
    default: return `${type}-${seqStr}`;
  }
}

