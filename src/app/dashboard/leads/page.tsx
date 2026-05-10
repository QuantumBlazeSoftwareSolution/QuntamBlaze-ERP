import { leadsCrud } from "@/lib/db/crud/leads";
import LeadsPageClient from "@/components/dashboard/leads/LeadsPageClient";

export default async function LeadsPage() {
  const leads = await leadsCrud.getAll();

  return <LeadsPageClient initialLeads={leads} />;
}
