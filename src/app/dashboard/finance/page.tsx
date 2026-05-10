import { invoicesCrud } from "@/lib/db/crud/invoices";
import FinancePageClient from "@/components/dashboard/finance/FinancePageClient";

export default async function FinancePage() {
  const invoices = await invoicesCrud.getAll();

  // Compute real financial stats from DB data
  const totalOutstanding = invoices
    .filter((inv) => ["Sent", "Overdue", "Pending", "Partially Paid"].includes(inv.status))
    .reduce((sum, inv) => sum + Number(inv.amount || 0), 0);

  const paidThisMonth = invoices
    .filter((inv) => inv.status === "Paid")
    .reduce((sum, inv) => sum + Number(inv.amount || 0), 0);

  const taxLiability = invoices
    .reduce((sum, inv) => sum + Number(inv.tax || 0), 0);

  const revenueThisMonth = invoices
    .filter((inv) => ["Paid", "Sent", "Partially Paid"].includes(inv.status))
    .reduce((sum, inv) => sum + Number(inv.amount || 0), 0);

  const financeStats = {
    totalOutstanding,
    paidThisMonth,
    taxLiability,
    revenueThisMonth,
  };

  return <FinancePageClient invoices={invoices} financeStats={financeStats} />;
}
