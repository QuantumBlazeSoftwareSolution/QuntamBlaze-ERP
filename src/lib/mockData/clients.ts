export interface Client {
  id: string;
  name: string;
  abbr: string;
}

export const MOCK_CLIENTS: Client[] = [
  { id: "CLI-GOOG-26-001", name: "Google", abbr: "GOOG" },
  { id: "CLI-MSFT-26-002", name: "Microsoft", abbr: "MSFT" },
  { id: "CLI-AMZN-26-003", name: "Amazon", abbr: "AMZN" },
  { id: "CLI-META-26-004", name: "Meta", abbr: "META" },
  { id: "CLI-AAPL-26-005", name: "Apple", abbr: "AAPL" },
];
