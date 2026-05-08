import { QuotationFormData } from "@/types/quotation";
import { InvoiceFormData } from "@/types/invoice";

export function convertQuotationToInvoice(qto: QuotationFormData): InvoiceFormData {
  // Generate a new INV-ID based on current month
  const now = new Date();
  const yy = now.getFullYear().toString().slice(-2);
  const mm = (now.getMonth() + 1).toString().padStart(2, '0');
  const invId = `INV-${yy}${mm}-0044`; // Mock sequential ID

  return {
    invoiceId: invId,
    projectId: qto.referenceType === "CLI" ? qto.referenceId : "", // If it was a lead, project might not exist yet
    clientId: qto.referenceType === "CLI" ? qto.referenceId : "",
    clientName: qto.clientName,
    billingAddress: "1010 Silicon Valley, CA, USA", // Default or carry over
    linkedAgreementId: "",
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    lineItems: qto.lineItems.map(item => ({
      ...item,
      qty: item.hours || item.qty, // Map hours to qty for invoice
    }))
  };
}
