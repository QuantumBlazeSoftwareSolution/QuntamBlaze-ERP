export type ProposalSectionType = 
  | "executive_summary"
  | "scope"
  | "deliverables"
  | "timeline"
  | "pricing"
  | "team"
  | "terms";

export interface ProposalSection {
  id: string;
  type: ProposalSectionType;
  title: string;
  content: string;
}

export interface ProposalStatus {
  state: "Pending" | "Signed" | "Rejected";
  reference: string; // ESIG-PRO-ID
}

export interface Proposal {
  id: string;
  projectId: string;
  clientId: string;
  title: string;
  status: ProposalStatus;
  sections: ProposalSection[];
  linkedQuotationId?: string;
}
