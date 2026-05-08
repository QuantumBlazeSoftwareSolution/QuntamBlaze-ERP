export type PaymentMethod = "Bank Transfer" | "Card" | "Cheque" | "PayPal";

export interface Receipt {
  id: string;
  invoiceId: string;
  clientId: string;
  clientName: string;
  paymentDate: string;
  amount: number;
  paymentMethod: PaymentMethod;
  referenceNumber: string;
  loggedBy: {
    name: string;
    avatar?: string;
  };
}
