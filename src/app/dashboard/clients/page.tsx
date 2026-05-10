import { clientsCrud } from "@/lib/db/crud/clients";
import { ClientsPageClient } from "@/components/dashboard/clients/ClientsPageClient";

export default async function ClientsPage() {
  const allClients = await clientsCrud.getAll();

  const formattedClients = allClients.map((c: any) => ({
    ...c,
    activeProjects: c.projects?.map((p: any) => p.id) || [],
    totalBilled: Number(c.totalBilled || 0),
  }));

  return <ClientsPageClient clients={formattedClients} />;
}
