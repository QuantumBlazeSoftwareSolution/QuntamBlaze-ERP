import { Lead } from "@/types/lead";

export const MOCK_LEADS: Lead[] = [
  {
    id: "LED-23-4091",
    companyName: "Aegis Dynamics",
    contactName: "Marcus Vance",
    contactEmail: "m.vance@aegis-dynamics.com",
    contactPhone: "+1(555) 019-8472",
    contactTitle: "Director of Security Ops",
    source: "Website",
    temperature: "Hot",
    description: "Security Infrastructure Upgrade",
    linkedProposalId: "PRO-23-992",
    status: "Priority",
    createdAt: "2023-10-24T14:30:00Z",
    timeline: [
      {
        id: "ev-1",
        type: "call",
        title: "Discovery Call Completed",
        description: "Client requires scalable security mesh for 3 new terrestrial facilities. Budget approved for Q3 deployment.",
        actor: { name: "Quantum System" },
        timestamp: new Date().toISOString(),
      },
      {
        id: "ev-2",
        type: "email",
        title: "Automated Response Sent",
        description: "System dispatched standard enterprise capabilities deck based on form submission criteria.",
        actor: { name: "System" },
        timestamp: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      }
    ]
  },
  {
    id: "LED-23-4088",
    companyName: "Horizon Logistics",
    contactName: "Sarah Chen",
    contactEmail: "s.chen@horizon-logistics.com",
    contactPhone: "+1(555) 012-3456",
    contactTitle: "VP Ops",
    source: "Referral",
    temperature: "Warm",
    description: "Supply Chain Optimization",
    status: "Active",
    createdAt: "2023-10-23T09:00:00Z",
    timeline: []
  },
  {
    id: "LED-23-4082",
    companyName: "NovaTech Industries",
    contactName: "J.T. Rutherford",
    contactEmail: "jt.rutherford@novatech.com",
    contactPhone: "+1(555) 987-6543",
    contactTitle: "CEO",
    source: "Cold Outreach",
    temperature: "Cold",
    description: "Energy Storage Solutions",
    status: "Active",
    createdAt: "2023-10-22T11:00:00Z",
    timeline: []
  }
];
