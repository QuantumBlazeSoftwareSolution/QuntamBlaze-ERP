"use client";

import { ShieldCheck, Download, Clock } from "lucide-react";

export function AuditComplianceTab() {
  return (
    <div className="space-y-8 max-w-4xl">
      <div className="bg-white border border-border rounded-2xl p-8 space-y-8 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-accent/10 border border-accent/20 rounded-xl">
              <ShieldCheck className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-text-primary">System Integrity Protocols</h3>
              <p className="text-[13px] text-text-muted">Configure how the system audits user activity and retains history.</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-5 py-2 bg-accent text-white font-bold rounded-lg text-[12px] shadow-sm">
            LIVE LOGGING ON
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          <div className="space-y-4">
            {/* Toggle: Enforce Audit Trail */}
            <div className="flex items-center justify-between p-4 bg-page-bg border border-divider rounded-xl">
              <div className="space-y-0.5">
                <p className="text-[13px] font-bold text-text-primary">Enforce Audit Trail</p>
                <p className="text-[11px] text-text-muted">Mandatory logging for all record changes.</p>
              </div>
              <div className="w-10 h-5 bg-accent rounded-full relative cursor-pointer shrink-0">
                <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm" />
              </div>
            </div>

            {/* Toggle: MFA */}
            <div className="flex items-center justify-between p-4 bg-page-bg border border-divider rounded-xl">
              <div className="space-y-0.5">
                <p className="text-[13px] font-bold text-text-primary">Multi-factor (MFA)</p>
                <p className="text-[11px] text-text-muted">Require 2FA for all Administrative roles.</p>
              </div>
              <div className="w-10 h-5 bg-border rounded-full relative cursor-pointer shrink-0">
                <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-text-muted uppercase tracking-widest flex items-center gap-2">
                <Clock className="w-3 h-3" />
                Data Retention Period
              </label>
              <select className="w-full bg-white border border-border rounded-xl px-4 py-4 text-[13px] text-text-primary focus:border-accent outline-none focus:ring-1 focus:ring-accent">
                <option>365 Days (1 Year)</option>
                <option>180 Days (6 Months)</option>
                <option>90 Days (3 Months)</option>
              </select>
            </div>
            <button className="w-full flex items-center justify-center gap-3 py-4 bg-page-bg border border-divider rounded-xl text-[13px] font-bold text-text-secondary hover:bg-white hover:border-border transition-all">
              <Download className="w-4 h-4" />
              EXPORT FULL AUDIT LOG (.CSV)
            </button>
          </div>
        </div>
      </div>

      {/* Footer actions */}
      <div className="flex justify-end gap-4">
        <button className="px-8 py-4 text-[14px] font-bold text-text-muted hover:text-text-primary transition-colors">
          Discard Changes
        </button>
        <button className="flex items-center gap-2 px-10 py-4 bg-accent text-white font-bold rounded-xl hover:bg-accent/90 transition-all shadow-sm shadow-accent/20">
          Save Changes
        </button>
      </div>
    </div>
  );
}
