"use client";

import React, { useState, useMemo } from "react";
import { Star, Info, Lock, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { IDChip } from "@/components/ui/IDChip";

const TECHNICAL_CRITERIA = [
  { id: "prob_solve", label: "Problem Solving", weight: 0.25 },
  { id: "tech_know", label: "Technical Knowledge", weight: 0.3 },
  { id: "code_qual", label: "Code Quality", weight: 0.25 },
  { id: "sys_design", label: "System Design", weight: 0.2 },
];

const BEHAVIORAL_CRITERIA = [
  { id: "teamwork", label: "Teamwork", weight: 0.3 },
  { id: "comm", label: "Communication", weight: 0.4 },
  { id: "adapt", label: "Adaptability", weight: 0.3 },
];

type Recommendation = "strong_hire" | "hire" | "no_hire" | "strong_no_hire";

export function InterviewScorecard() {
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);

  const calculateSectionScore = (criteria: any[]) => {
    let total = 0;
    let ratedCount = 0;
    criteria.forEach((c) => {
      if (ratings[c.id]) {
        total += (ratings[c.id] / 5) * 100 * c.weight;
        ratedCount++;
      }
    });
    return criteria.length === ratedCount ? Math.round(total) : 0;
  };

  const techScore = useMemo(() => calculateSectionScore(TECHNICAL_CRITERIA), [ratings]);
  const behavioralScore = useMemo(() => calculateSectionScore(BEHAVIORAL_CRITERIA), [ratings]);

  const overallScore = useMemo(() => {
    if (techScore && behavioralScore) {
      return Math.round(techScore * 0.6 + behavioralScore * 0.4);
    }
    return 0;
  }, [techScore, behavioralScore]);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Header Info */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-violet-50 flex items-center justify-center text-violet-600 border border-violet-100">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-[#0F172A] font-bold">Technical Interview Scorecard</h2>
            <div className="flex items-center gap-2 mt-1">
              <IDChip id="INT-26-047" size="xs" />
              <span className="text-[#94A3B8] text-[10px] uppercase font-bold tracking-wider">
                • Round 2 • May 10, 2024
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white shadow-sm" />
          <span className="text-sm font-bold text-[#475569]">Evaluator: Alex Mercer</span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Sections */}
        <div className="xl:col-span-2 space-y-8">
          <ScorecardSection
            title="Technical Competency"
            description="Assess the candidate's core engineering skills and problem-solving ability."
            criteria={TECHNICAL_CRITERIA}
            ratings={ratings}
            onRate={(id: string, val: number) => setRatings((prev) => ({ ...prev, [id]: val }))}
            weight={60}
          />

          <ScorecardSection
            title="Behavioral & Culture"
            description="Alignment with company values and soft skills required for the role."
            criteria={BEHAVIORAL_CRITERIA}
            ratings={ratings}
            onRate={(id: string, val: number) => setRatings((prev) => ({ ...prev, [id]: val }))}
            weight={40}
          />

          {/* Overall Recommendation */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-8 shadow-sm">
            <h3 className="text-[#0F172A] font-bold mb-6">Final Recommendation</h3>
            <div className="grid grid-cols-2 gap-4">
              <RecommendationCard
                type="strong_hire"
                active={recommendation === "strong_hire"}
                onClick={() => setRecommendation("strong_hire")}
              />
              <RecommendationCard
                type="hire"
                active={recommendation === "hire"}
                onClick={() => setRecommendation("hire")}
              />
              <RecommendationCard
                type="no_hire"
                active={recommendation === "no_hire"}
                onClick={() => setRecommendation("no_hire")}
              />
              <RecommendationCard
                type="strong_no_hire"
                active={recommendation === "strong_no_hire"}
                onClick={() => setRecommendation("strong_no_hire")}
              />
            </div>

            <div className="mt-8 space-y-4">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-widest px-1">
                  Executive Summary
                </label>
                <textarea
                  placeholder="Summarize the candidate's strengths and areas for improvement..."
                  className="w-full h-32 p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981] transition-all resize-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-widest px-1 flex items-center gap-2">
                  <Lock className="w-3 h-3" />
                  Private Notes (only visible to HR)
                </label>
                <textarea
                  placeholder="Internal feedback, salary expectations notes, etc..."
                  className="w-full h-24 p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981] transition-all resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Scoring Sidebar */}
        <div className="space-y-6">
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-8 sticky top-24 shadow-md">
            <div className="text-center mb-8">
              <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-[0.2em] mb-2">
                Aggregate Score
              </p>
              <div className="relative inline-flex items-center justify-center">
                <span
                  className={cn(
                    "text-6xl font-black transition-colors duration-500",
                    overallScore > 80
                      ? "text-[#10B981]"
                      : overallScore > 60
                        ? "text-amber-500"
                        : overallScore > 0
                          ? "text-red-500"
                          : "text-[#E2E8F0]"
                  )}
                >
                  {overallScore || "--"}
                </span>
                <span className="text-xl font-bold text-[#94A3B8] ml-1 mt-4">%</span>
              </div>
            </div>

            <div className="space-y-6 pt-6 border-t border-[#F1F5F9]">
              <ScoreIndicator label="Technical" score={techScore} weight={60} />
              <ScoreIndicator label="Behavioral" score={behavioralScore} weight={40} />
            </div>

            <div className="mt-10 space-y-3">
              <button
                className="w-full py-3.5 rounded-xl bg-[#10B981] text-white font-bold text-sm shadow-lg shadow-[#10B981]/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
                disabled={!overallScore || !recommendation}
              >
                Submit Scorecard
              </button>
              <button className="w-full py-3 rounded-xl border border-[#E2E8F0] text-[#64748B] font-bold text-sm hover:bg-[#F8FAFC] transition-all">
                Save as Draft
              </button>
            </div>

            <div className="mt-6 flex items-start gap-2 p-3 bg-blue-50/50 rounded-lg border border-blue-100">
              <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <p className="text-[10px] text-blue-700 leading-normal">
                All scores are weighted based on the job requirement profile. Minimum of 4 stars
                across technical criteria is recommended for a 'Hire'.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScorecardSection({ title, description, criteria, ratings, onRate, weight }: any) {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden shadow-sm">
      <div className="p-6 border-b border-[#F1F5F9] bg-[#F8FAFC] flex items-center justify-between">
        <div>
          <h3 className="text-[#0F172A] font-bold">{title}</h3>
          <p className="text-xs text-[#94A3B8] mt-0.5">{description}</p>
        </div>
        <div className="bg-white px-2 py-1 rounded border border-[#E2E8F0] text-[10px] font-bold text-[#64748B]">
          WEIGHT: {weight}%
        </div>
      </div>
      <div className="divide-y divide-[#F1F5F9]">
        {criteria.map((c: any) => (
          <div
            key={c.id}
            className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:bg-[#F8FAFC] transition-colors"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm font-bold text-[#475569]">{c.label}</p>
                <span className="text-[10px] text-[#94A3B8] font-medium">
                  ({Math.round(c.weight * 100)}%)
                </span>
              </div>
              <textarea
                placeholder={`Add notes for ${c.label.toLowerCase()}...`}
                className="w-full mt-2 p-3 rounded-lg border border-transparent bg-transparent group-hover:bg-white group-hover:border-[#E2E8F0] text-xs transition-all focus:outline-none focus:ring-2 focus:ring-[#10B981]/10 h-16 resize-none"
              />
            </div>
            <div className="flex gap-1 shrink-0 bg-[#F1F5F9] p-1 rounded-xl">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => onRate(c.id, star)}
                  className={cn(
                    "p-2 rounded-lg transition-all",
                    ratings[c.id] >= star
                      ? "text-amber-500 scale-110"
                      : "text-[#CBD5E1] hover:text-amber-300"
                  )}
                >
                  <Star className={cn("w-5 h-5", ratings[c.id] >= star ? "fill-amber-500" : "")} />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RecommendationCard({ type, active, onClick }: any) {
  const configs: any = {
    strong_hire: {
      label: "Strong Hire",
      color: "text-[#10B981]",
      bg: "bg-[#ECFDF5]",
      border: "border-[#A7F3D0]",
      icon: CheckCircle2,
    },
    hire: {
      label: "Hire",
      color: "text-[#3B82F6]",
      bg: "bg-[#EFF6FF]",
      border: "border-[#BFDBFE]",
      icon: CheckCircle2,
    },
    no_hire: {
      label: "No Hire",
      color: "text-[#F59E0B]",
      bg: "bg-[#FFFBEB]",
      border: "border-[#FDE68A]",
      icon: AlertCircle,
    },
    strong_no_hire: {
      label: "Strong No Hire",
      color: "text-[#EF4444]",
      bg: "bg-[#FEF2F2]",
      border: "border-[#FECACA]",
      icon: AlertCircle,
    },
  };

  const config = configs[type];
  const Icon = config.icon;

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center p-4 rounded-xl border transition-all relative overflow-hidden",
        active
          ? `${config.bg} ${config.border} ring-2 ring-offset-2 ring-slate-100`
          : "bg-white border-[#E2E8F0] hover:border-[#CBD5E1]"
      )}
    >
      <Icon className={cn("w-6 h-6 mb-2", active ? config.color : "text-[#94A3B8]")} />
      <span className={cn("text-xs font-bold", active ? config.color : "text-[#64748B]")}>
        {config.label}
      </span>
      {active && (
        <motion.div
          layoutId="rec-active"
          className="absolute inset-0 border-2 border-current pointer-events-none rounded-xl"
          style={{ borderColor: "inherit" }}
        />
      )}
    </button>
  );
}

function ScoreIndicator({ label, score, weight }: any) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2 px-1">
        <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">
          {label}
        </span>
        <span className="text-xs font-bold text-[#0F172A]">{score || 0}%</span>
      </div>
      <div className="h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          className={cn(
            "h-full rounded-full transition-all duration-700",
            score > 80 ? "bg-[#10B981]" : score > 60 ? "bg-amber-500" : "bg-red-500"
          )}
        />
      </div>
      <div className="mt-1.5 flex justify-end">
        <span className="text-[10px] text-[#94A3B8] font-medium italic">Weight: {weight}%</span>
      </div>
    </div>
  );
}
