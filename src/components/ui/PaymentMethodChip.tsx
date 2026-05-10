"use client";

import { Building2, CreditCard, FileText, Wallet } from "lucide-react";
import { PaymentMethod } from "@/types/receipt";
import { cn } from "@/lib/utils";

const METHOD_CONFIG: Record<PaymentMethod, { icon: any; color: string; bg: string }> = {
  "Bank Transfer": { icon: Building2, color: "text-[#00E5FF]", bg: "bg-[#00E5FF]/5" },
  Card: { icon: CreditCard, color: "text-purple-400", bg: "bg-purple-400/5" },
  Cheque: { icon: FileText, color: "text-amber-400", bg: "bg-amber-400/5" },
  PayPal: { icon: Wallet, color: "text-blue-400", bg: "bg-blue-400/5" },
};

export function PaymentMethodChip({ method }: { method: PaymentMethod }) {
  const config = METHOD_CONFIG[method] || METHOD_CONFIG["Bank Transfer"];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-2.5 py-1 rounded-lg border border-current/10 text-[11px] font-medium transition-all",
        config.color,
        config.bg
      )}
    >
      <Icon className="w-3.5 h-3.5" />
      <span>{method}</span>
    </div>
  );
}
