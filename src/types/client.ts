export interface Client {
  id: string;
  name: string;
  industry: string;
  billingAddress: string;
  paymentTerms: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  activeProjects: string[]; // PRJ-IDs
  totalBilled: number;
  status: "Active" | "Inactive";
  joinedAt: string;
}

export interface ClientInvoice {
  id: string;
  date: string;
  dueDate: string;
  amount: number;
  status: "Paid" | "Pending" | "Overdue";
}

export interface ClientDocument {
  id: string;
  type: "agreement" | "proposal" | "invoice" | "srs";
  name: string;
  version: string;
  lastModified: string;
}

export interface ClientProject {
  id: string;
  name: string;
  status: string;
  progress: number;
  deadline: string;
}

export interface ClientDetail extends Client {
  description: string;
  website: string;
  currency: string;
  accountManager: {
    name: string;
    avatar?: string;
  };
  outstandingBalance: number;
  nextInvoiceDue?: {
    date: string;
    amount: number;
    id: string;
  };
  projects: ClientProject[];
  invoices: ClientInvoice[];
  documents: ClientDocument[];
}
