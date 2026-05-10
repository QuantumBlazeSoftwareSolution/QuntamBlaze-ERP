export type LeadStatus = "New" | "Contacted" | "Qualified" | "Proposal" | "Won" | "Lost";
export type LeadSource = "Referral" | "Website" | "Cold Outreach" | "LinkedIn" | "Conference" | "Partner";

export interface Lead {
  id: string;
  company: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  source: LeadSource;
  status: LeadStatus;
  score: number; // 0–100
  estimatedValue: number;
  industry: string;
  notes: string;
  assignedTo: string;
  createdAt: string;
  lastContactedAt: string;
}

export const MOCK_LEADS: Lead[] = [
  { id: "LED-26-001", company: "Tesla Inc.",        contactName: "E. Martinez",    contactEmail: "e.martinez@tesla.com",       contactPhone: "+1 408 555 0120", source: "Referral",       status: "Qualified",  score: 88, estimatedValue: 4500000, industry: "Automotive",    notes: "Interested in full logistics overhaul for Gigafactory Nevada.",        assignedTo: "A. Mercer",  createdAt: "2026-03-10", lastContactedAt: "2026-05-08" },
  { id: "LED-26-002", company: "Nvidia Corp.",      contactName: "J. Kim",         contactEmail: "j.kim@nvidia.com",           contactPhone: "+1 408 555 0244", source: "LinkedIn",       status: "Proposal",   score: 76, estimatedValue: 2200000, industry: "Technology",    notes: "Proposal sent for AI infrastructure management module.",               assignedTo: "S. Ramirez", createdAt: "2026-03-22", lastContactedAt: "2026-05-07" },
  { id: "LED-26-003", company: "Boeing Co.",        contactName: "M. Thompson",    contactEmail: "m.thompson@boeing.com",      contactPhone: "+1 312 555 0988", source: "Conference",     status: "Contacted",  score: 62, estimatedValue: 8900000, industry: "Aerospace",     notes: "Met at Dubai Airshow. Follow up on procurement workflow needs.",       assignedTo: "N. Okafor",  createdAt: "2026-04-01", lastContactedAt: "2026-05-03" },
  { id: "LED-26-004", company: "Stripe Inc.",       contactName: "L. Chen",        contactEmail: "l.chen@stripe.com",          contactPhone: "+1 415 555 0312", source: "Website",        status: "New",        score: 45, estimatedValue: 950000,  industry: "FinTech",       notes: "Signed up via website form. Needs initial discovery call.",            assignedTo: "A. Mercer",  createdAt: "2026-05-01", lastContactedAt: "2026-05-01" },
  { id: "LED-26-005", company: "Samsung SDI",       contactName: "H. Park",        contactEmail: "h.park@samsung.com",         contactPhone: "+82 2 555 0088",  source: "Partner",        status: "Qualified",  score: 81, estimatedValue: 6100000, industry: "Electronics",   notes: "Partner-referred. Battery manufacturing supply chain optimization.",   assignedTo: "K. Tanaka",  createdAt: "2026-03-15", lastContactedAt: "2026-05-06" },
  { id: "LED-26-006", company: "Palantir Tech.",    contactName: "A. Karp Jr.",    contactEmail: "a.karp@palantir.com",        contactPhone: "+1 303 555 0771", source: "Cold Outreach",  status: "Lost",       score: 22, estimatedValue: 1800000, industry: "Software",      notes: "Not interested at this time. Revisit Q4 2026.",                       assignedTo: "S. Ramirez", createdAt: "2026-02-14", lastContactedAt: "2026-04-20" },
  { id: "LED-26-007", company: "Rivian Motors",    contactName: "D. Fischer",     contactEmail: "d.fischer@rivian.com",       contactPhone: "+1 309 555 0440", source: "Referral",       status: "Proposal",   score: 73, estimatedValue: 3300000, industry: "Automotive",    notes: "Second proposal iteration after pricing adjustments.",                 assignedTo: "A. Mercer",  createdAt: "2026-03-28", lastContactedAt: "2026-05-05" },
  { id: "LED-26-008", company: "Snowflake Inc.",    contactName: "B. Slootman",    contactEmail: "b.slootman@snowflake.com",   contactPhone: "+1 650 555 0230", source: "LinkedIn",       status: "Contacted",  score: 55, estimatedValue: 1400000, industry: "Cloud",         notes: "Connected via LinkedIn. Exploring data ops management needs.",         assignedTo: "N. Okafor",  createdAt: "2026-04-12", lastContactedAt: "2026-04-30" },
  { id: "LED-26-009", company: "Moderna Inc.",      contactName: "S. Bancel",      contactEmail: "s.bancel@moderna.com",       contactPhone: "+1 617 555 0199", source: "Conference",     status: "Won",        score: 95, estimatedValue: 12000000,industry: "BioTech",       notes: "Contract signed. Transitioning to CLI-MOD-26-009.",                   assignedTo: "A. Mercer",  createdAt: "2026-01-20", lastContactedAt: "2026-05-02" },
  { id: "LED-26-010", company: "Anduril Ind.",      contactName: "P. Luckey",      contactEmail: "p.luckey@anduril.com",       contactPhone: "+1 714 555 0382", source: "Referral",       status: "New",        score: 38, estimatedValue: 7500000, industry: "Defense",       notes: "High-value prospect. Needs security clearance review first.",          assignedTo: "K. Tanaka",  createdAt: "2026-05-03", lastContactedAt: "2026-05-03" },
  { id: "LED-26-011", company: "Figma Inc.",        contactName: "D. Field",       contactEmail: "d.field@figma.com",          contactPhone: "+1 415 555 0503", source: "Website",        status: "Qualified",  score: 67, estimatedValue: 680000,  industry: "SaaS",          notes: "Needs project collaboration module, good product fit.",                assignedTo: "S. Ramirez", createdAt: "2026-04-18", lastContactedAt: "2026-05-04" },
  { id: "LED-26-012", company: "Northrop Grumman", contactName: "K. Warden",      contactEmail: "k.warden@northropgrumman.com",contactPhone: "+1 703 555 0901",source: "Cold Outreach",  status: "Contacted",  score: 49, estimatedValue: 15000000,industry: "Defense",       notes: "Large procurement opportunity. Multiple stakeholders involved.",        assignedTo: "A. Mercer",  createdAt: "2026-04-05", lastContactedAt: "2026-04-28" },
  { id: "LED-26-013", company: "Waymo LLC",         contactName: "T. Vogt",        contactEmail: "t.vogt@waymo.com",           contactPhone: "+1 650 555 0622", source: "Partner",        status: "Proposal",   score: 84, estimatedValue: 5400000, industry: "Autonomous",    notes: "Proposal for fleet logistics tracking. Demo delivered successfully.",  assignedTo: "N. Okafor",  createdAt: "2026-03-30", lastContactedAt: "2026-05-07" },
  { id: "LED-26-014", company: "Databricks",        contactName: "A. Ghodsi",      contactEmail: "a.ghodsi@databricks.com",    contactPhone: "+1 415 555 0147", source: "LinkedIn",       status: "New",        score: 52, estimatedValue: 2100000, industry: "Data & AI",     notes: "Interest in finance & analytics module. Early stage.",                 assignedTo: "K. Tanaka",  createdAt: "2026-05-06", lastContactedAt: "2026-05-06" },
  { id: "LED-26-015", company: "Relativity Space",  contactName: "T. Ellis",       contactEmail: "t.ellis@relativityspace.com",contactPhone: "+1 323 555 0290", source: "Referral",       status: "Lost",       score: 18, estimatedValue: 3700000, industry: "Aerospace",     notes: "Lost to competitor. Re-engage after Series D close.",                  assignedTo: "S. Ramirez", createdAt: "2026-02-28", lastContactedAt: "2026-04-10" },
];
