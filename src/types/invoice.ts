export type InvoiceStatus = "Paid" | "Pending" | "Overdue" | "Draft" | "Sent" | "Partially Paid";

export interface LineItem {
  id: string;
  description: string;
  qty: number;
  rate: number;
  taxPercent: number;
  amount: number;
}

export interface Invoice {
  id: string;
  projectId: string;
  clientId: string;
  clientName: string;
  billingAddress: string;
  linkedAgreementId?: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  tax: number;
  status: InvoiceStatus;
  receiptId?: string;
  lineItems: LineItem[];
}

export interface InvoiceFormData {
  invoiceId: string;
  projectId: string;
  clientId: string;
  clientName: string;
  billingAddress: string;
  linkedAgreementId: string;
  issueDate: string;
  dueDate: string;
  lineItems: LineItem[];
  bankDetails?: string;
}

export interface FinanceStats {
  totalOutstanding: number;
  revenueThisMonth: number;
  taxLiability: number;
  paidThisMonth: number;
  trends: {
    outstanding: number;
    revenue: number;
    tax: number;
    paid: number;
  };
}
