"use client";

import React from 'react';
import { Candidate } from '@/types/hr';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Building2, 
  Briefcase, 
  Clock, 
  DollarSign, 
  FileText,
  ChevronRight,
  History,
  Globe
} from 'lucide-react';
import { motion } from 'framer-motion';
import { IDChip } from '@/components/ui/IDChip';
import { cn } from '@/lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface CandidateOverviewProps {
  candidate: Candidate;
}

export function CandidateOverview({ candidate }: CandidateOverviewProps) {
  const scoreData = [
    { name: 'Score', value: candidate.score || 0 },
    { name: 'Gap', value: 100 - (candidate.score || 0) },
  ];
  const SCORE_COLOR = (candidate.score || 0) > 80 ? '#10B981' : (candidate.score || 0) > 60 ? '#F59E0B' : '#EF4444';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Column 1: Contact & Personal */}
      <div className="space-y-6">
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-6">
          <h3 className="text-[#0F172A] font-bold text-sm mb-6 flex items-center gap-2">
            <div className="w-1.5 h-4 bg-[#10B981] rounded-full" />
            Personal Details
          </h3>
          
          <div className="space-y-5">
            <DetailItem icon={Mail} label="Email Address" value={candidate.email} />
            <DetailItem icon={Phone} label="Phone Number" value={candidate.phone || "Not provided"} />
            <DetailItem icon={Globe} label="LinkedIn Profile" value="linkedin.com/in/sreed" isLink />
            <DetailItem icon={MapPin} label="Location" value="Colombo, Sri Lanka" />
            <DetailItem icon={Building2} label="Current Company" value="TechNova Solutions" />
            <DetailItem icon={Briefcase} label="Current Role" value="Full Stack Developer" />
            <DetailItem icon={Clock} label="Notice Period" value="30 Days" />
            <DetailItem icon={DollarSign} label="Expected Salary" value="$4,500 / month" />
          </div>

          <div className="mt-8 pt-6 border-t border-[#F1F5F9]">
            <button className="w-full flex items-center justify-between p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] group hover:border-[#10B981] transition-all">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white border border-[#E2E8F0] flex items-center justify-center text-red-500">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-[#0F172A]">Resume_Final.pdf</p>
                  <p className="text-[10px] text-[#94A3B8]">Uploaded 2 days ago • 1.2 MB</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#10B981] transition-colors" />
            </button>
          </div>
        </div>
      </div>

      {/* Column 2: Application Details */}
      <div className="space-y-6">
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-6">
          <h3 className="text-[#0F172A] font-bold text-sm mb-6 flex items-center gap-2">
            <div className="w-1.5 h-4 bg-[#3B82F6] rounded-full" />
            Application Overview
          </h3>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#64748B] font-medium">Job Applied For</span>
              <IDChip id={candidate.jobId} size="xs" variant="accent" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#64748B] font-medium">Applied Date</span>
              <span className="text-xs font-bold text-[#0F172A]">April 28, 2024</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#64748B] font-medium">Source</span>
              <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-600 text-[10px] font-bold border border-blue-100 uppercase tracking-wider">
                {candidate.source}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#64748B] font-medium">Assigned Recruiter</span>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-slate-200 border border-white" />
                <span className="text-xs font-bold text-[#0F172A]">{candidate.assignee?.name || "Unassigned"}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#64748B] font-medium">Days in Stage</span>
              <span className={cn(
                "text-xs font-bold",
                candidate.daysInStage > 5 ? "text-amber-500" : "text-[#10B981]"
              )}>
                {candidate.daysInStage} Days
              </span>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-[#F1F5F9]">
             <h4 className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-4 flex items-center gap-2">
               <History className="w-3 h-3" />
               Stage History
             </h4>
             <div className="space-y-4">
                <HistoryItem stage="Technical" date="May 08" actor="Alex Mercer" isLast />
                <HistoryItem stage="Screening" date="May 02" actor="Sarah Jenkins" />
                <HistoryItem stage="Applied" date="Apr 28" actor="System" />
             </div>
          </div>
        </div>
      </div>

      {/* Column 3: Score Summary */}
      <div className="space-y-6">
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 flex flex-col items-center">
          <h3 className="text-[#0F172A] font-bold text-sm mb-8 self-start flex items-center gap-2">
            <div className="w-1.5 h-4 bg-[#8B5CF6] rounded-full" />
            Evaluation Score
          </h3>

          <div className="relative w-48 h-48 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={scoreData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                  startAngle={180}
                  endAngle={-180}
                >
                  <Cell fill={SCORE_COLOR} />
                  <Cell fill="#F1F5F9" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-black text-[#0F172A]">{candidate.score}%</span>
              <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Overall</span>
            </div>
          </div>

          <div className="w-full space-y-5">
             <ScoreBar label="Technical Competency" score={88} color="#3B82F6" />
             <ScoreBar label="Behavioral & Culture" score={72} color="#8B5CF6" />
             <ScoreBar label="Role-Specific Skills" score={95} color="#10B981" />
          </div>

          <div className="mt-8 pt-6 border-t border-[#F1F5F9] w-full">
            <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-3">Recommendation</p>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#ECFDF5] border border-[#A7F3D0]">
               <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
               <span className="text-xs font-bold text-[#065F46]">Strong Hire</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailItem({ icon: Icon, label, value, isLink }: any) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-[#F8FAFC] border border-[#F1F5F9] flex items-center justify-center text-[#94A3B8] shrink-0">
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider leading-none mb-1">{label}</p>
        <p className={cn(
          "text-sm font-semibold",
          isLink ? "text-[#3B82F6] hover:underline cursor-pointer" : "text-[#0F172A]"
        )}>
          {value}
        </p>
      </div>
    </div>
  );
}

function HistoryItem({ stage, date, actor, isLast }: any) {
  return (
    <div className="flex items-center justify-between relative">
      {!isLast && <div className="absolute left-2.5 top-6 bottom-[-20px] w-0.5 bg-[#F1F5F9]" />}
      <div className="flex items-center gap-3">
        <div className="w-5 h-5 rounded-full border-2 border-white bg-[#E2E8F0] z-10" />
        <div>
          <p className="text-xs font-bold text-[#0F172A] leading-none">{stage}</p>
          <p className="text-[10px] text-[#94A3B8] mt-1">by {actor}</p>
        </div>
      </div>
      <span className="text-[10px] font-bold text-[#94A3B8]">{date}</span>
    </div>
  );
}

function ScoreBar({ label, score, color }: any) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center px-0.5">
        <span className="text-[10px] font-bold text-[#64748B] uppercase">{label}</span>
        <span className="text-[10px] font-bold text-[#0F172A]">{score}%</span>
      </div>
      <div className="h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
}

function CheckCircle2({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
