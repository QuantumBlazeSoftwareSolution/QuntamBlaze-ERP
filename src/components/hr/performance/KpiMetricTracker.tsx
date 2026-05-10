"use client";

import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Zap, 
  BarChart3,
  ArrowRight,
  Target
} from 'lucide-react';
import { cn } from '@/lib/utils';

const KPIS = [
  { name: 'Code Quality', score: 92, trend: '+2.4%', status: 'high' },
  { name: 'On-time Delivery', score: 88, trend: '+0.5%', status: 'stable' },
  { name: 'Bug Resolution', score: 76, trend: '-4.2%', status: 'risk' },
  { name: 'Peer Review Avg', score: 4.8, max: 5, trend: '+0.2', status: 'high' },
];

export function KpiMetricTracker() {
  return (
    <div className="bg-[#0F172A] rounded-3xl p-8 text-white h-full flex flex-col shadow-xl">
      <div className="flex items-center justify-between mb-10">
        <div>
           <h3 className="text-white font-bold flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-400" />
              Real-time KPI Scorecard
           </h3>
           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Live Performance Index</p>
        </div>
        <div className="bg-white/5 border border-white/10 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-slate-400">
           Last Sync: 16:45
        </div>
      </div>

      <div className="flex-1 space-y-6">
         {KPIS.map((kpi) => (
           <div key={kpi.name} className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all group">
              <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center shadow-sm",
                      kpi.status === 'high' ? "bg-emerald-500/20 text-emerald-400" :
                      kpi.status === 'risk' ? "bg-red-500/20 text-red-400" :
                      "bg-blue-500/20 text-blue-400"
                    )}>
                       <BarChart3 className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest">{kpi.name}</span>
                 </div>
                 <div className={cn(
                   "flex items-center gap-1 text-[9px] font-black uppercase px-2 py-0.5 rounded-full",
                   kpi.trend.startsWith('+') ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                 )}>
                    {kpi.trend.startsWith('+') ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {kpi.trend}
                 </div>
              </div>

              <div className="flex items-baseline gap-2">
                 <span className="text-2xl font-black">{kpi.score}</span>
                 <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    {kpi.max ? `/ ${kpi.max}` : '% Score'}
                 </span>
              </div>

              <div className="mt-4 h-1 bg-white/5 rounded-full overflow-hidden">
                 <div 
                   className={cn(
                     "h-full rounded-full transition-all duration-1000",
                     kpi.status === 'high' ? "bg-emerald-500" :
                     kpi.status === 'risk' ? "bg-red-500" : "bg-blue-500"
                   )} 
                   style={{ width: `${kpi.max ? (kpi.score / kpi.max) * 100 : kpi.score}%` }}
                 />
              </div>
           </div>
         ))}
      </div>

      <button className="w-full mt-10 py-3 rounded-2xl bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2">
         Full Appraisal Report
         <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
