import { Document } from "@/types/documents";

export const MOCK_DOCUMENTS: Document[] = [
  {
    id: "SRS-PRJ-GOOG-26-001",
    projectId: "PRJ-GOOG-26-001",
    name: "Quantum Core Specs",
    type: "SRS",
    status: "Under Review",
    currentVersion: 4,
    lastModified: "2024-10-24 09:41",
    authorName: "J. Bourne",
    versions: [
      {
        id: "SRS-PRJ-GOOG-26-001-V4",
        version: 4,
        authorId: "USR-JB-26-001",
        authorName: "J. Bourne",
        timestamp: "Today, 09:41",
        summary: "Updated latency requirements for module C based on feedback.",
      },
      {
        id: "SRS-PRJ-GOOG-26-001-V3",
        version: 3,
        authorId: "USR-JB-26-001",
        authorName: "J. Bourne",
        timestamp: "Oct 20, 14:22",
        summary: "Initial implementation of security protocols.",
      },
    ],
  },
  {
    id: "SRS-PRJ-GOOG-26-002",
    projectId: "PRJ-GOOG-26-001",
    name: "API Integration v2",
    type: "SRS",
    status: "Approved",
    currentVersion: 1,
    lastModified: "2024-10-21 14:22",
    authorName: "A. Vance",
    versions: [
      {
        id: "SRS-PRJ-GOOG-26-002-V1",
        version: 1,
        authorId: "USR-AV-26-002",
        authorName: "A. Vance",
        timestamp: "Oct 21, 14:22",
        summary: "Baseline API definition.",
      },
    ],
  },
];
