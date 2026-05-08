import { create } from "zustand";
import { persist } from "zustand/middleware";

export type EntityType = "CLI" | "PRJ" | "PRO" | "INV" | "TSK" | "LED" | "QTO" | "RCT" | "AGR" | "SRS";

export interface IDEntityConfig {
  type: EntityType;
  label: string;
  pattern: string;
  sequence: number;
}

interface IDConfigState {
  configs: Record<EntityType, IDEntityConfig>;
  updateSequence: (type: EntityType, sequence: number) => void;
  resetSequence: (type: EntityType) => void;
}

const INITIAL_CONFIGS: Record<EntityType, IDEntityConfig> = {
  CLI: { type: "CLI", label: "Clients", pattern: "CLI-[Comp]-[YY]-[Seq]", sequence: 1 },
  PRJ: { type: "PRJ", label: "Projects", pattern: "PRJ-[Comp]-[YY]-[Seq]", sequence: 1 },
  PRO: { type: "PRO", label: "Proposals", pattern: "PRO-[PrjID]-[Seq]", sequence: 1 },
  INV: { type: "INV", label: "Invoices", pattern: "INV-[YYMM]-[Seq]", sequence: 43 },
  TSK: { type: "TSK", label: "Tasks", pattern: "TSK-[PrjID]-[Seq]", sequence: 1 },
  LED: { type: "LED", label: "Leads", pattern: "LED-[YY]-[Seq]", sequence: 34 },
  QTO: { type: "QTO", label: "Quotations", pattern: "QTO-[YYMM]-[Seq]", sequence: 8 },
  RCT: { type: "RCT", label: "Receipts", pattern: "RCT-[YYMM]-[Seq]", sequence: 3 },
  AGR: { type: "AGR", label: "Agreements", pattern: "AGR-[PrjID]-VN", sequence: 1 },
  SRS: { type: "SRS", label: "Specifications", pattern: "SRS-[PrjID]", sequence: 1 },
};

export const useIDConfigStore = create<IDConfigState>()(
  persist(
    (set) => ({
      configs: INITIAL_CONFIGS,
      updateSequence: (type, sequence) => set((state) => ({
        configs: {
          ...state.configs,
          [type]: { ...state.configs[type], sequence }
        }
      })),
      resetSequence: (type) => set((state) => ({
        configs: {
          ...state.configs,
          [type]: { ...state.configs[type], sequence: 1 }
        }
      })),
    }),
    {
      name: "quantum-blaze-id-config",
    }
  )
);
