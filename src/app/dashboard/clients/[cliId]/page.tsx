import { notFound } from "next/navigation";
import { clientsCrud } from "@/lib/db/crud/clients";
import { ClientProfileClient } from "@/components/dashboard/clients/profile/ClientProfileClient";

export default async function ClientProfilePage({
  params,
}: {
  params: Promise<{ cliId: string }>;
}) {
  const { cliId } = await params;
  const clientData = await clientsCrud.getById(cliId);

  if (!clientData) {
    notFound();
  }

  // Format data to match what the frontend expects
  const formattedClient: any = {
    ...clientData,
    industry: clientData.industry || "Enterprise",
    description:
      "Quantum Blaze strategic partner since " + new Date(clientData.joinedAt).getFullYear(),
    website: "https://example.com",
    billingAddress: clientData.billingAddress || "Not Provided",
    accountManager: {
      name: "Unassigned",
    },
    activeProjects: clientData.projects?.length || 0,
    totalBilled: Number(clientData.totalBilled || 0),
    outstandingBalance:
      clientData.invoices
        ?.filter((inv: any) => inv.status !== "Paid")
        ?.reduce((acc: number, inv: any) => acc + Number(inv.amount), 0) || 0,
    projects: clientData.projects || [],
    invoices: clientData.invoices || [],
    documents: [], // TODO: Wire to DB
  };

  return <ClientProfileClient client={formattedClient} />;
}
