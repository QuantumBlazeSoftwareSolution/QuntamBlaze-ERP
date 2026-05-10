import { Receipt } from "@/types/receipt";

export const MOCK_RECEIPTS: Receipt[] = [
  {
    id: "RCT-2410-089",
    invoiceId: "INV-9921",
    clientId: "CLI-ASTRA",
    clientName: "Astra Corp",
    paymentDate: "2024-10-24",
    amount: 45000.0,
    paymentMethod: "Bank Transfer",
    referenceNumber: "TXN-8812A",
    loggedBy: { name: "Op. Alpha" },
  },
  {
    id: "RCT-2410-088",
    invoiceId: "INV-9918",
    clientId: "CLI-NEXUS",
    clientName: "Nexus Gen",
    paymentDate: "2024-10-23",
    amount: 12450.5,
    paymentMethod: "Card",
    referenceNumber: "CHG-990B",
    loggedBy: { name: "J. Bourne" },
  },
  {
    id: "RCT-2410-087",
    invoiceId: "INV-9850",
    clientId: "CLI-OMNI",
    clientName: "Omni Sys",
    paymentDate: "2024-10-22",
    amount: 105000.0,
    paymentMethod: "Bank Transfer",
    referenceNumber: "WIRE-711",
    loggedBy: { name: "Op. Alpha" },
  },
  // Adding more to reach 10
  ...Array.from({ length: 7 }).map((_, i) => ({
    id: `RCT-2410-0${86 - i}`,
    invoiceId: `INV-98${49 - i}`,
    clientId: `CLI-${["MSFT", "AMZN", "META", "GOOG", "NFLX"][i % 5]}`,
    clientName: ["Microsoft", "Amazon", "Meta", "Google", "Netflix"][i % 5],
    paymentDate: `2024-10-${21 - i}`,
    amount: 5000 * (i + 1),
    paymentMethod: ["Bank Transfer", "Card", "Cheque", "PayPal"][i % 4] as any,
    referenceNumber: `REF-${Math.floor(Math.random() * 10000)}`,
    loggedBy: { name: i % 2 === 0 ? "Op. Alpha" : "J. Bourne" },
  })),
];
