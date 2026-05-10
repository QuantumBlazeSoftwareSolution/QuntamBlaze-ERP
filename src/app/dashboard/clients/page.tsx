import { clientsCrud } from "@/lib/db/crud/clients";
import { ClientsPageClient } from "@/components/dashboard/clients/ClientsPageClient";

export default async function ClientsPage() {
  const clients = await clientsCrud.getAll();

  return <ClientsPageClient clients={clients} />;
}
