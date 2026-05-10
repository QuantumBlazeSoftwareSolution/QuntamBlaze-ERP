"use client";

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Calendar, 
  FileText, 
  ClipboardCheck, 
  History,
  ChevronLeft,
  Settings,
  MoreVertical
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { CandidateProfileHeader } from '@/components/hr/recruitment/CandidateProfileHeader';
import { CandidateOverview } from '@/components/hr/recruitment/CandidateOverview';
import { CandidateInterviewsTab } from '@/components/hr/recruitment/CandidateInterviewsTab';
import { InterviewScorecard } from '@/components/hr/recruitment/InterviewScorecard';
import { MOCK_CANDIDATES } from '@/lib/mockData/hr';

const TABS = [
  { id: 'overview', label: 'Overview', icon: User },
  { id: 'interviews', label: 'Interviews', icon: Calendar },
  { id: 'scorecard', label: 'Scorecard', icon: ClipboardCheck },
  { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'activity', label: 'Activity Log', icon: History },
];

export default function CandidateProfilePage() {
  const params = useParams();
  const router = useRouter();
  const cndId = params.cndId as string;
  const [activeTab, setActiveTab] = useState('overview');

  const candidate = MOCK_CANDIDATES.find(c => c.id === cndId) || MOCK_CANDIDATES[0];

  return (
    <div className="flex-1 bg-[#F8FAFC] min-h-screen flex flex-col">
      {/* Action Bar */}
      <div className="bg-white px-8 h-14 border-b border-[#E2E8F0] flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="p-2 hover:bg-[#F1F5F9] rounded-lg transition-all text-[#64748B]"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="h-6 w-px bg-[#E2E8F0]" />
          <div className="flex items-center gap-2">
            <span className="text-[#94A3B8] text-sm">Recruitment</span>
            <span className="text-[#94A3B8] text-sm">/</span>
            <span className="text-[#0F172A] text-sm font-bold">{candidate.name}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-[#F1F5F9] rounded-lg transition-all text-[#94A3B8]">
             <Settings className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-[#F1F5F9] rounded-lg transition-all text-[#94A3B8]">
             <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      <CandidateProfileHeader candidate={candidate} />

      {/* Tab Navigation */}
      <div className="bg-white border-b border-[#E2E8F0] px-8 sticky top-14 z-30">
        <div className="flex gap-10">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 py-4 text-sm font-bold transition-all relative",
                  isActive ? "text-[#10B981]" : "text-[#94A3B8] hover:text-[#475569]"
                )}
              >
                <Icon className={cn("w-4 h-4", isActive ? "text-[#10B981]" : "text-[#94A3B8]")} />
                {tab.label}
                {isActive && (
                  <motion.div 
                    layoutId="activeTab" 
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#10B981] rounded-full" 
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-8 max-w-[1400px] mx-auto w-full flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'overview' && <CandidateOverview candidate={candidate} />}
            {activeTab === 'interviews' && <CandidateInterviewsTab />}
            {activeTab === 'scorecard' && <InterviewScorecard />}
            {activeTab === 'documents' && (
              <div className="bg-white border border-[#E2E8F0] rounded-xl p-20 flex flex-col items-center text-center">
                <FileText className="w-12 h-12 text-[#E2E8F0] mb-4" />
                <h3 className="text-lg font-bold text-[#0F172A]">Document Management</h3>
                <p className="text-[#94A3B8] text-sm mt-1 max-w-sm">Manage candidate resumes, portfolios, and offer letters in a secure environment.</p>
              </div>
            )}
            {activeTab === 'activity' && (
              <div className="bg-white border border-[#E2E8F0] rounded-xl p-20 flex flex-col items-center text-center">
                <History className="w-12 h-12 text-[#E2E8F0] mb-4" />
                <h3 className="text-lg font-bold text-[#0F172A]">Candidate Activity</h3>
                <p className="text-[#94A3B8] text-sm mt-1 max-w-sm">Audit log of all changes, stage transitions, and interviewer comments.</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
