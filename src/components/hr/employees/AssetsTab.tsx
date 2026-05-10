"use client";

import React from 'react';
import { 
  Laptop, 
  Smartphone, 
  Key, 
  ShieldCheck, 
  Box, 
  Search,
  ExternalLink,
  History
} from 'lucide-react';
import { Employee } from '@/types/hr';
import { cn } from '@/lib/utils';

interface AssetsTabProps {
  employee: Employee;
}

const PHYSICAL_ASSETS = [
  { id: 'MBP-2023-042', name: 'MacBook Pro M3 Max 16"', type: 'Hardware', serial: 'SN-009842X', issued: 'Jan 15, 2023', condition: 'Excellent', icon: Laptop },
  { id: 'IPH-26-012', name: 'iPhone 15 Pro (Titanium)', type: 'Hardware', serial: 'SN-IPH-8821', issued: 'Jan 16, 2023', condition: 'Good', icon: Smartphone },
  { id: 'CRD-26-001', name: 'Global Access Key Card', type: 'Access', serial: 'RF-882-991', issued: 'Jan 15, 2023', condition: 'Active', icon: Key },
];

const DIGITAL_ASSETS = [
  { name: 'Adobe Creative Cloud', plan: 'Enterprise', status: 'Active' },
  { name: 'GitHub Enterprise', plan: 'Developer', status: 'Active' },
  { name: 'Slack Pro', plan: 'QuantumBlaze Workspace', status: 'Active' },
  { name: 'Linear Premium', plan: 'Engineering Unit', status: 'Active' },
];

export function AssetsTab({ employee }: AssetsTabProps) {
  return (
    <div className="space-y-8">
      {/* Physical Assets Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#F8FAFC] border border-[#F1F5F9] flex items-center justify-center text-[#475569]">
                 <Box className="w-4 h-4" />
              </div>
              <h3 className="text-[#0F172A] font-bold">Physical Assets Inventory</h3>
           </div>
           <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0F172A] text-white text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-[#0F172A]/10 hover:scale-[1.02] transition-all">
              + Assign Asset
           </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           {PHYSICAL_ASSETS.map((asset) => {
             const Icon = asset.icon;
             return (
               <div key={asset.id} className="bg-white border border-[#F1F5F9] rounded-2xl p-6 hover:shadow-md transition-all group">
                  <div className="flex items-center justify-between mb-4">
                     <div className="w-12 h-12 rounded-xl bg-[#F8FAFC] border border-[#F1F5F9] flex items-center justify-center text-[#94A3B8] group-hover:bg-blue-50 group-hover:text-blue-500 transition-all">
                        <Icon className="w-6 h-6" />
                     </div>
                     <div className="text-right">
                        <span className="text-[10px] font-black text-[#10B981] bg-[#ECFDF5] px-2 py-0.5 rounded-full border border-[#A7F3D0] uppercase tracking-tighter">
                           {asset.condition}
                        </span>
                     </div>
                  </div>
                  
                  <h4 className="text-sm font-black text-[#0F172A] mb-1 line-clamp-1">{asset.name}</h4>
                  <p className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-widest mb-4">{asset.id}</p>
                  
                  <div className="space-y-2 pt-4 border-t border-[#F8FAFC]">
                     <AssetDetail label="Serial" value={asset.serial} />
                     <AssetDetail label="Issued On" value={asset.issued} />
                  </div>

                  <button className="w-full mt-6 py-2 rounded-xl bg-[#F8FAFC] border border-[#F1F5F9] text-[10px] font-black text-[#94A3B8] hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100 transition-all uppercase tracking-widest flex items-center justify-center gap-2">
                     <History className="w-3.5 h-3.5" />
                     View History
                  </button>
               </div>
             );
           })}
        </div>
      </section>

      {/* Digital Assets Section */}
      <section>
        <div className="flex items-center gap-3 mb-6">
           <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center text-violet-600">
              <ShieldCheck className="w-4 h-4" />
           </div>
           <h3 className="text-[#0F172A] font-bold">Digital Licenses & SaaS Access</h3>
        </div>

        <div className="bg-white border border-[#F1F5F9] rounded-2xl overflow-hidden shadow-sm">
           <table className="w-full text-left">
              <thead>
                 <tr className="bg-[#F8FAFC] border-b border-[#F1F5F9] text-[10px] text-[#94A3B8] font-black uppercase tracking-widest">
                    <th className="px-6 py-4">Software / Platform</th>
                    <th className="px-6 py-4">Tier / Plan</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Action</th>
                 </tr>
              </thead>
              <tbody className="text-sm font-medium text-[#475569] divide-y divide-[#F8FAFC]">
                 {DIGITAL_ASSETS.map((asset) => (
                   <tr key={asset.name} className="hover:bg-[#FBFCFD] transition-colors">
                      <td className="px-6 py-4">
                         <div className="flex items-center gap-3 font-bold text-[#0F172A]">
                            <div className="w-2 h-2 rounded-full bg-[#10B981]" />
                            {asset.name}
                         </div>
                      </td>
                      <td className="px-6 py-4 text-[#64748B]">{asset.plan}</td>
                      <td className="px-6 py-4">
                         <span className="text-[10px] font-bold text-[#10B981] bg-[#ECFDF5] px-2 py-0.5 rounded uppercase tracking-tighter">
                            {asset.status}
                         </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                         <button className="text-[#3B82F6] hover:underline flex items-center gap-1.5 ml-auto text-[10px] font-bold">
                            Manage
                            <ExternalLink className="w-3 h-3" />
                         </button>
                      </td>
                   </tr>
                 ))}
              </tbody>
           </table>
        </div>
      </section>
    </div>
  );
}

function AssetDetail({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex justify-between items-center">
       <span className="text-[10px] font-bold text-[#94A3B8] uppercase">{label}</span>
       <span className="text-[10px] font-bold text-[#475569]">{value}</span>
    </div>
  );
}
