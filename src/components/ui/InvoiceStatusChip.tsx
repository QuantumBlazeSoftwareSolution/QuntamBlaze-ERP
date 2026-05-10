"use client";

import { cn } from "@/lib/utils";

export type InvoiceStatus = "Paid" | "Pending" | "Overdue" | "Draft" | "Sent" | "Partially Paid";

const STATUS_CONFIG: Record<
  InvoiceStatus,
  { label: string; dotColor: string; borderColor: string; textColor: string; bgColor: string }
> = {
  Paid: {
    label: "PAID",
    dotColor: "bg-success",
    borderColor: "border-success/30",
    textColor: "text-success",
    bgColor: "bg-success/5",
  },
  Pending: {
    label: "PENDING",
    dotColor: "bg-warning",
    borderColor: "border-warning/30",
    textColor: "text-warning",
    bgColor: "bg-warning/5",
  },
  Overdue: {
    label: "OVERDUE",
    dotColor: "bg-danger",
    borderColor: "border-danger/30",
    textColor: "text-danger",
    bgColor: "bg-danger/5",
  },
  Sent: {
    label: "SENT",
    dotColor: "bg-accent",
    borderColor: "border-accent/30",
    textColor: "text-accent",
    bgColor: "bg-accent/5",
  },
  "Partially Paid": {
    label: "PARTIALLY PAID",
    dotColor: "bg-warning",
    borderColor: "border-warning/30",
    textColor: "text-warning",
    bgColor: "bg-warning/5",
  },
  Draft: {
    label: "DRAFT",
    dotColor: "bg-text-muted",
    borderColor: "border-text-muted/30",
    textColor: "text-text-muted",
    bgColor: "bg-white/5",
  },
};

export function InvoiceStatusChip({ status }: { status: InvoiceStatus }) {
  const config = STATUS_CONFIG[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-[0.1em] uppercase border shadow-[0_0_10px_rgba(0,0,0,0.2)]",
        config.borderColor,
        config.textColor,
        config.bgColor
      )}
    >
      <span
        className={cn("w-1.5 h-1.5 rounded-full shadow-[0_0_8px_currentColor]", config.dotColor)}
      />
      {config.label}
    </span>
  );
}
