import { ClientDetail } from "@/types/client";

export const MOCK_CLIENT_DETAILS: Record<string, ClientDetail> = {
  "CLI-GOOG-26-001": {
    id: "CLI-GOOG-26-001",
    name: "Alphabet Inc.",
    industry: "Technology",
    description: "Cloud Infrastructure & Data Ecosystems",
    website: "alphabet.google",
    currency: "USD ($)",
    billingAddress: "1600 Amphitheatre Pkwy, Mountain View, CA 94043",
    paymentTerms: "Net 30",
    contactPerson: "Sundar Pichai",
    contactEmail: "s.pichai@alphabet.inc",
    contactPhone: "+1 (650) 253-0000",
    joinedAt: "2023-01-15T09:00:00Z",
    status: "Active",
    accountManager: {
      name: "J. Vance",
    },
    totalBilled: 4200000,
    outstandingBalance: 150000,
    nextInvoiceDue: {
      date: "Oct 15, 2023",
      amount: 75000,
      id: "INV-GOOG-26-042"
    },
    activeProjects: ["PRJ-GOOG-26-005", "PRJ-GOOG-26-001"],
    projects: [
      {
        id: "PRJ-GOOG-26-005",
        name: "Quantum Cloud Infrastructure Migration",
        status: "In Progress",
        progress: 68,
        deadline: "2024-03-15"
      },
      {
        id: "PRJ-GOOG-26-001",
        name: "Initial Data Center Analysis",
        status: "Completed",
        progress: 100,
        deadline: "2023-08-12"
      }
    ],
    invoices: [
      { id: "INV-2605-0042", date: "2023-09-15", dueDate: "2023-10-15", amount: 75000, status: "Pending" },
      { id: "INV-2605-0041", date: "2023-08-15", dueDate: "2023-09-15", amount: 75000, status: "Paid" },
      { id: "INV-2605-0040", date: "2023-07-15", dueDate: "2023-08-15", amount: 75000, status: "Overdue" }
    ],
    documents: [
      { id: "AGR-PRJ-GOOG-26-005-VN", type: "agreement", name: "Master Service Agreement", version: "v2.4", lastModified: "2023-09-10" },
      { id: "PRO-PRJ-GOOG-26-005-01", type: "proposal", name: "Cloud Infrastructure Proposal", version: "v1.0", lastModified: "2023-08-01" }
    ]
  }
};
