import LeadsPageClient from "@/components/dashboard/leads/LeadsPageClient";
import { leadsCrud } from "@/lib/db/crud/leads";

export default async function LeadsPage() {
  const allLeads = await leadsCrud.getAll();

  const formattedLeads = allLeads.map((l: any) => ({
    ...l,
    lastContactedAt: l.lastContactedAt ? new Date(l.lastContactedAt).toLocaleDateString() : "-",
    createdAt: l.createdAt ? new Date(l.createdAt).toLocaleDateString() : "-",
    estimatedValue: Number(l.estimatedValue || 0),
  }));

  return <LeadsPageClient initialLeads={formattedLeads} />;
}
