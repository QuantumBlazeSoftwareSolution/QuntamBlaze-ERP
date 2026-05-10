"use client";

import React from "react";
import { Package, Truck, CheckCircle2, MapPin, Clock, Box, CreditCard, Key } from "lucide-react";
import { cn } from "@/lib/utils";

const ASSETS = [
  {
    id: 1,
    name: "MacBook Pro M3 Max",
    status: "shipped",
    date: "May 08",
    location: "In Transit",
    icon: Package,
  },
  {
    id: 2,
    name: "Employee ID Badge",
    status: "ready",
    date: "May 09",
    location: "Reception",
    icon: CreditCard,
  },
  {
    id: 3,
    name: "Office Access Keys",
    status: "pending",
    date: "May 12",
    location: "HQ South",
    icon: Key,
  },
  {
    id: 4,
    name: "Welcome Gift Box",
    status: "delivered",
    date: "May 05",
    location: "Employee Home",
    icon: Box,
  },
];

export function WelcomeKitStatus() {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[#0F172A] font-bold text-sm flex items-center gap-2">
          <Truck className="w-4 h-4 text-[#10B981]" />
          Welcome Kit & Assets
        </h3>
        <button className="text-[10px] font-bold text-[#3B82F6] hover:underline">Track All</button>
      </div>

      <div className="space-y-4">
        {ASSETS.map((asset) => {
          const Icon = asset.icon;
          return (
            <div
              key={asset.id}
              className="flex items-start gap-4 p-3 rounded-xl border border-[#F1F5F9] hover:bg-[#F8FAFC] transition-all"
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border",
                  asset.status === "delivered"
                    ? "bg-emerald-50 border-emerald-100 text-[#10B981]"
                    : "bg-blue-50 border-blue-100 text-blue-500"
                )}
              >
                <Icon className="w-5 h-5" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-xs font-bold text-[#0F172A] truncate">{asset.name}</h4>
                  <span
                    className={cn(
                      "text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-full border",
                      asset.status === "delivered"
                        ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                        : asset.status === "shipped"
                          ? "bg-blue-50 text-blue-600 border-blue-100"
                          : "bg-slate-50 text-slate-600 border-slate-100"
                    )}
                  >
                    {asset.status}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-[10px] text-[#94A3B8] font-medium">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {asset.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {asset.date}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 rounded-xl bg-violet-50 border border-violet-100 flex gap-3">
        <CheckCircle2 className="w-5 h-5 text-violet-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-[11px] font-bold text-violet-900">Kit Readiness Score: 75%</p>
          <p className="text-[10px] text-violet-700 mt-0.5 leading-relaxed">
            3 of 4 physical assets are ready for the new hire. IT department notified of the pending
            Office Keys.
          </p>
        </div>
      </div>
    </div>
  );
}
