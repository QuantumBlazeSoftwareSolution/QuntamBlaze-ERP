import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * ID Engine: Generates sequential IDs based on prefixes.
 * CLI-, PRJ-, PRO-, QTO-, AGR-, INV-, RCT-, SRS-, TSK-, LED-
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
