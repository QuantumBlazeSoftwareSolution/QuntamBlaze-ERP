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

