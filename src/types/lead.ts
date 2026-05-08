export type LeadTemperature = "Hot" | "Warm" | "Cold";

export type LeadSource = "LinkedIn" | "Website" | "Referral" | "Cold Outreach";

export interface LeadTimelineEvent {
  id: string;
  type: "call" | "email" | "status_change" | "note";
  title: string;
  description: string;
  actor: {
    name: string;
    avatar?: string;
  };
  timestamp: string; // ISO string
}

export interface Lead {
  id: string;
  companyName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  contactTitle: string;
  source: LeadSource;
  temperature: LeadTemperature;
  description: string;
  linkedProposalId?: string;
  status: string;
  createdAt: string;
  timeline: LeadTimelineEvent[];
}
