export interface SystemHealth {
  service: string;
  status: "operational" | "degraded" | "outage";
  uptime: number;
  latency: number; // in ms
}

export interface ResourceAllocation {
  department: string;
  personnel: number;
  compute: number; // percentage
  storage: number; // percentage
}

export interface OperationAlert {
  id: string;
  type: "info" | "warning" | "critical";
  message: string;
  timestamp: string;
  resolved: boolean;
}

export const MOCK_SYSTEM_HEALTH: SystemHealth[] = [
  { service: "API Gateway", status: "operational", uptime: 99.99, latency: 45 },
  { service: "Database Cluster", status: "operational", uptime: 99.95, latency: 12 },
  { service: "Auth Service", status: "operational", uptime: 100, latency: 25 },
  { service: "Storage Node A", status: "degraded", uptime: 98.5, latency: 120 },
  { service: "Background Workers", status: "operational", uptime: 99.9, latency: 5 },
];

export const MOCK_RESOURCE_ALLOCATION: ResourceAllocation[] = [
  { department: "Engineering", personnel: 45, compute: 60, storage: 40 },
  { department: "Data Science", personnel: 12, compute: 85, storage: 75 },
  { department: "Marketing", personnel: 8, compute: 10, storage: 20 },
  { department: "Sales", personnel: 25, compute: 15, storage: 10 },
];

export const MOCK_OPERATION_ALERTS: OperationAlert[] = [
  { id: "ALT-001", type: "critical", message: "Storage Node A approaching capacity limit (94%)", timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), resolved: false },
  { id: "ALT-002", type: "warning", message: "High latency detected on API Gateway Europe region", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), resolved: true },
  { id: "ALT-003", type: "info", message: "Database cluster weekly backup completed successfully", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), resolved: true },
  { id: "ALT-004", type: "warning", message: "Unusual traffic spike detected from unauthorized IP ranges", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), resolved: false },
];
