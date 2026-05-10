"use client";

import React from 'react';
import Link from 'next/link';
import { 
  MoreHorizontal, 
  ExternalLink, 
  ArrowUpRight,
  ShieldCheck,
  Clock,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Employee } from '@/types/hr';
import { IDChip } from '@/components/ui/IDChip';

interface EmployeeListTableProps {
  employees: Employee[];
}

export function EmployeeListTable({ employees }: EmployeeListTableProps) {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-3xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[10px] text-[#94A3B8] font-black uppercase tracking-widest">
              <th className="px-6 py-4">Employee</th>
              <th className="px-6 py-4">Role & Dept</th>
              <th className="px-6 py-4">Join Date</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Profile Health</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F5F9]">
            {employees.map((employee) => (
              <tr key={employee.id} className="hover:bg-[#FBFCFD] transition-colors group">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl overflow-hidden border border-[#E2E8F0] shadow-sm shrink-0">
                      {employee.avatar ? (
                        <img src={employee.avatar} alt={employee.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-[#F1F5F9] flex items-center justify-center text-[#94A3B8] font-bold text-xs">
                          {employee.name.split(' ').map(n => n[0]).join('')}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-black text-[#0F172A] group-hover:text-[#10B981] transition-colors">{employee.name}</p>
                      <IDChip id={employee.id} size="xs" />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <p className="text-sm font-bold text-[#475569]">{employee.role}</p>
                  <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">{employee.department}</p>
                </td>
                <td className="px-6 py-5">
                   <div className="flex items-center gap-2 text-[#64748B] text-xs font-medium">
                      <Clock className="w-3.5 h-3.5 text-[#94A3B8]" />
                      {employee.joinDate}
                   </div>
                </td>
                <td className="px-6 py-5">
                  <span className={cn(
                    "text-[10px] font-black px-2 py-0.5 rounded-full border uppercase tracking-tighter",
                    employee.status === 'Active' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"
                  )}>
                    {employee.status}
                  </span>
                </td>
                <td className="px-6 py-5">
                   <div className="flex items-center gap-3">
                      <div className="flex-1 w-24 h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                         <div 
                           className={cn(
                             "h-full rounded-full",
                             (employee.profileHealth || 0) >= 90 ? "bg-[#10B981]" : "bg-amber-500"
                           )} 
                           style={{ width: `${employee.profileHealth || 0}%` }}
                         />
                      </div>
                      <span className="text-[10px] font-black text-[#64748B]">
                         {employee.profileHealth || 0}%
                      </span>
                   </div>
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link 
                      href={`/dashboard/hr/employees/${employee.id}`}
                      className="p-2 rounded-lg hover:bg-blue-50 text-[#3B82F6] transition-all opacity-0 group-hover:opacity-100"
                      title="View Profile"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                    <button className="p-2 rounded-lg hover:bg-[#F1F5F9] text-[#94A3B8] transition-all">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="bg-[#F8FAFC] border-t border-[#E2E8F0] px-6 py-4 flex items-center justify-between">
         <p className="text-[11px] font-bold text-[#94A3B8]">Showing {employees.length} employees</p>
         <div className="flex gap-2">
            <button className="px-3 py-1 rounded-lg border border-[#E2E8F0] bg-white text-[10px] font-black text-[#64748B] hover:bg-[#F1F5F9] transition-all">PREVIOUS</button>
            <button className="px-3 py-1 rounded-lg border border-[#E2E8F0] bg-white text-[10px] font-black text-[#64748B] hover:bg-[#F1F5F9] transition-all">NEXT</button>
         </div>
      </div>
    </div>
  );
}
