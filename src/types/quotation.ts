import { LineItem } from "./invoice";

export interface Milestone {
  id: string;
  description: string;
  percentage: number;
  amount: number;
}

export interface QuotationFormData {
  quotationId: string;
  referenceType: "CLI" | "LED";
  referenceId: string;
  clientName: string;
  validityDate: string;
  scopeOfWork: string;
  lineItems: (LineItem & { hours?: number })[];
  discount: number;
  discountType: "flat" | "percentage";
  useMilestones: boolean;
  milestones: Milestone[];
}
