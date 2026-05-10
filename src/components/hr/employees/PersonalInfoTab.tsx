"use client";

import React from "react";
import { User, Mail, Phone, MapPin, Heart, Shield, CreditCard, Cake, Users } from "lucide-react";
import { Employee } from "@/types/hr";

interface PersonalInfoTabProps {
  employee: Employee;
}

export function PersonalInfoTab({ employee }: PersonalInfoTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left Column: Core Identity */}
      <div className="space-y-8">
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <User className="w-4 h-4" />
            </div>
            <h3 className="text-[#0F172A] font-bold">Identity Details</h3>
          </div>

          <div className="bg-white border border-[#F1F5F9] rounded-2xl p-6 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <InfoItem label="Full Legal Name" value={employee.name} />
              <InfoItem label="Date of Birth" value={employee.birthDate || "Not Set"} />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <InfoItem label="NIC / ID Number" value={employee.nic || "N/A"} />
              <InfoItem label="Marital Status" value="Single" />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <InfoItem label="Nationality" value="Sri Lankan" />
              <InfoItem label="Religion" value="Buddhism" />
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-[#10B981]">
              <Heart className="w-4 h-4" />
            </div>
            <h3 className="text-[#0F172A] font-bold">Emergency Contact</h3>
          </div>

          <div className="bg-white border border-[#F1F5F9] rounded-2xl p-6 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#F8FAFC] border border-[#F1F5F9] flex items-center justify-center text-[#94A3B8] font-bold">
                EM
              </div>
              <div>
                <p className="text-sm font-bold text-[#0F172A]">Elizabeth Mercer</p>
                <p className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-wider">
                  Spouse
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <InfoItem label="Contact Number" value="+94 77 987 6543" />
              <InfoItem label="Alt. Number" value="+94 11 234 5678" />
            </div>
          </div>
        </section>
      </div>

      {/* Right Column: Family & Health */}
      <div className="space-y-8">
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center text-violet-600">
              <Users className="w-4 h-4" />
            </div>
            <h3 className="text-[#0F172A] font-bold">Family Members</h3>
          </div>

          <div className="bg-white border border-[#F1F5F9] rounded-2xl p-6 overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] text-[#94A3B8] font-black uppercase tracking-widest">
                  <th className="pb-4">Name</th>
                  <th className="pb-4">Relationship</th>
                  <th className="pb-4">Age</th>
                </tr>
              </thead>
              <tbody className="text-sm font-medium text-[#475569]">
                <tr>
                  <td className="py-3">Elizabeth Mercer</td>
                  <td className="py-3">Spouse</td>
                  <td className="py-3">30</td>
                </tr>
                <tr>
                  <td className="py-3">Leo Mercer</td>
                  <td className="py-3">Son</td>
                  <td className="py-3">04</td>
                </tr>
              </tbody>
            </table>
            <button className="w-full mt-6 py-2 border-2 border-dashed border-[#F1F5F9] rounded-xl text-[10px] font-bold text-[#94A3B8] hover:bg-[#F8FAFC] transition-all">
              ADD FAMILY MEMBER
            </button>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
              <Shield className="w-4 h-4" />
            </div>
            <h3 className="text-[#0F172A] font-bold">Medical & Insurance</h3>
          </div>

          <div className="bg-white border border-[#F1F5F9] rounded-2xl p-6 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <InfoItem label="Blood Group" value="O Positive (O+)" />
              <InfoItem label="Allergies" value="Penicillin, Peanuts" />
            </div>
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
              <p className="text-[10px] font-black text-amber-700 uppercase tracking-widest mb-1">
                Insurance Policy
              </p>
              <p className="text-sm font-bold text-amber-900 tracking-tight">QM-LTD-2024-0512-MC</p>
              <p className="text-[10px] text-amber-600 font-medium mt-1">
                Provider: Allianz Life Insurance
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-black text-[#94A3B8] uppercase tracking-widest mb-1">
        {label}
      </p>
      <p className="text-sm font-bold text-[#475569]">{value}</p>
    </div>
  );
}
