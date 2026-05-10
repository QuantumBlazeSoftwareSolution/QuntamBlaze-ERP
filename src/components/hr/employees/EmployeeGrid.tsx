"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  MoreVertical, 
  Mail, 
  Phone, 
  MapPin, 
  ChevronRight,
  ShieldCheck,
  Star
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Employee } from '@/types/hr';
import { IDChip } from '@/components/ui/IDChip';

interface EmployeeGridProps {
  employees: Employee[];
}

export function EmployeeGrid({ employees }: EmployeeGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {employees.map((employee, idx) => (
        <motion.div
          key={employee.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05 }}
          className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-[#10B981]/30 transition-all group relative overflow-hidden"
        >
          {/* Background decoration */}
          <div className="absolute -top-12 -right-12 w-24 h-24 bg-[#F8FAFC] rounded-full group-hover:bg-[#ECFDF5] transition-colors" />
          
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
               <div className="relative">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white shadow-md">
                     {employee.avatar ? (
                       <img src={employee.avatar} alt={employee.name} className="w-full h-full object-cover" />
                     ) : (
                       <div className="w-full h-full bg-[#F1F5F9] flex items-center justify-center text-[#94A3B8] font-black text-xl uppercase">
                          {employee.name.split(' ').map(n => n[0]).join('')}
                       </div>
                     )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#10B981] border-2 border-white" />
               </div>
               <button className="text-[#94A3B8] hover:text-[#475569] p-1.5 hover:bg-[#F8FAFC] rounded-lg transition-all">
                  <MoreVertical className="w-4 h-4" />
               </button>
            </div>

            <div className="mb-6">
               <h3 className="text-[#0F172A] text-lg font-black tracking-tight group-hover:text-[#10B981] transition-colors">{employee.name}</h3>
               <p className="text-xs font-bold text-[#64748B] mb-3">{employee.role}</p>
               <div className="flex items-center gap-2">
                  <IDChip id={employee.id} size="xs" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-500 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                     {employee.department}
                  </span>
               </div>
            </div>

            <div className="space-y-3 mb-6">
               <ContactItem icon={Mail} value={employee.email || "No email"} />
               <ContactItem icon={Phone} value={employee.phone || "No phone"} />
            </div>

            <div className="pt-6 border-t border-[#F1F5F9] flex items-center justify-between">
               <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                  <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Active Status</span>
               </div>
               <Link 
                 href={`/dashboard/hr/employees/${employee.id}`}
                 className="flex items-center gap-1.5 text-xs font-black text-[#3B82F6] hover:underline"
               >
                  Full Profile
                  <ChevronRight className="w-4 h-4" />
               </Link>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function ContactItem({ icon: Icon, value }: { icon: any, value: string }) {
  return (
    <div className="flex items-center gap-2 text-[#94A3B8] group/item cursor-pointer">
       <Icon className="w-3.5 h-3.5 group-hover/item:text-[#10B981] transition-colors" />
       <span className="text-[11px] font-medium group-hover/item:text-[#475569] transition-colors truncate">{value}</span>
    </div>
  );
}
