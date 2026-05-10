"use client";

import React from 'react';
import { 
  Award, 
  ExternalLink, 
  ShieldCheck, 
  Clock, 
  AlertCircle,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';

const CERTS = [
  { 
    id: 1, 
    name: 'AWS Certified Solutions Architect', 
    issuer: 'Amazon Web Services', 
    date: 'March 2023', 
    expiry: 'March 2026', 
    status: 'active',
    logo: 'AWS'
  },
  { 
    id: 2, 
    name: 'Professional Scrum Master I', 
    issuer: 'Scrum.org', 
    date: 'Dec 2023', 
    expiry: 'Never', 
    status: 'active',
    logo: 'PSM'
  },
  { 
    id: 3, 
    name: 'Google Cloud Professional', 
    issuer: 'Google', 
    date: 'May 2022', 
    expiry: 'May 15, 2024', 
    status: 'expiring',
    logo: 'GCP'
  },
];

export function CertificationWall() {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-3xl p-8 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <div>
           <h3 className="text-[#0F172A] font-bold">Certification Wall</h3>
           <p className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-widest mt-1">Verified Professional Credentials</p>
        </div>
        <button className="text-[10px] font-black text-blue-600 hover:underline uppercase tracking-widest">
           Add Credential
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CERTS.map((cert) => (
          <div 
            key={cert.id} 
            className={cn(
              "p-4 rounded-2xl border transition-all flex flex-col justify-between",
              cert.status === 'expiring' ? "bg-red-50 border-red-100" : "bg-[#F8FAFC] border-[#F1F5F9] hover:border-blue-200"
            )}
          >
             <div className="flex items-start justify-between mb-4">
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center font-black text-xs shadow-sm",
                  cert.status === 'expiring' ? "bg-white text-red-600" : "bg-[#0F172A] text-white"
                )}>
                   {cert.logo}
                </div>
                {cert.status === 'expiring' ? (
                  <div className="flex items-center gap-1 text-[9px] font-black text-red-600 bg-white px-2 py-0.5 rounded-full border border-red-100 uppercase tracking-tighter">
                     <AlertCircle className="w-3 h-3" />
                     Expiring Soon
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-[9px] font-black text-emerald-600 bg-white px-2 py-0.5 rounded-full border border-emerald-100 uppercase tracking-tighter">
                     <ShieldCheck className="w-3 h-3" />
                     Verified
                  </div>
                )}
             </div>

             <div>
                <h4 className="text-sm font-bold text-[#0F172A] mb-1">{cert.name}</h4>
                <p className="text-[10px] font-medium text-[#64748B] mb-4">{cert.issuer}</p>
                
                <div className="flex items-center justify-between pt-4 border-t border-white/50">
                   <div className="flex flex-col">
                      <span className="text-[8px] font-black text-[#94A3B8] uppercase tracking-widest">Issued</span>
                      <span className="text-[10px] font-bold text-[#475569]">{cert.date}</span>
                   </div>
                   <div className="flex flex-col text-right">
                      <span className="text-[8px] font-black text-[#94A3B8] uppercase tracking-widest">Expires</span>
                      <span className={cn(
                        "text-[10px] font-bold",
                        cert.status === 'expiring' ? "text-red-600" : "text-[#475569]"
                      )}>
                        {cert.expiry}
                      </span>
                   </div>
                </div>
             </div>

             <button className="w-full mt-4 flex items-center justify-center gap-2 text-[10px] font-black text-[#3B82F6] hover:underline uppercase tracking-widest">
                View Credential
                <ExternalLink className="w-3 h-3" />
             </button>
          </div>
        ))}
      </div>
    </div>
  );
}
