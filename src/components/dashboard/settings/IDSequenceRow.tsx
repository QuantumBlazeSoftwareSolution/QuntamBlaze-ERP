"use client";

import { useMemo, useState } from "react";
import { IDEntityConfig, EntityType, useIDConfigStore } from "@/store/idConfigStore";
import { generateNextId } from "@/lib/idEngine";
import { RefreshCcw, AlertTriangle, X, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function IDSequenceRow({ config }: { config: IDEntityConfig }) {
  const { updateSequence, resetSequence } = useIDConfigStore();
  const [showConfirm, setShowConfirm] = useState(false);
  const [resetInput, setResetInput] = useState("");

  const nextId = useMemo(() => 
    generateNextId(config.type, config.sequence), 
    [config.type, config.sequence]
  );

  const handleReset = () => {
    if (resetInput === "RESET") {
      resetSequence(config.type);
      setShowConfirm(false);
      setResetInput("");
    }
  };

  return (
    <tr className="border-b border-divider hover:bg-page-bg transition-colors group">
      <td className="px-8 py-6">
         <span className="text-[14px] font-bold text-text-primary">{config.label}</span>
      </td>
      <td className="px-8 py-6 font-mono text-[13px] text-text-muted">
         {config.pattern}
      </td>
      <td className="px-8 py-6">
         <div className="inline-flex items-center px-3 py-1.5 bg-accent/10 border border-accent/20 rounded-lg text-accent font-mono text-[13px] font-bold">
            {nextId}
         </div>
      </td>
      <td className="px-8 py-6 text-right">
         <input 
           type="number"
           value={config.sequence}
           onChange={(e) => updateSequence(config.type, parseInt(e.target.value) || 0)}
           className="w-[80px] bg-white border border-border rounded px-3 py-1.5 text-right text-[13px] font-mono focus:border-accent outline-none"
         />
      </td>
      <td className="px-8 py-6 text-right relative">
         {!showConfirm ? (
           <button 
             onClick={() => setShowConfirm(true)}
             className="text-[11px] font-bold text-text-muted hover:text-red-500 transition-colors flex items-center gap-2 ml-auto"
           >
              <RefreshCcw className="w-3.5 h-3.5" />
              RESET
           </button>
         ) : (
           <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             className="flex items-center gap-3 justify-end"
           >
              <input 
                autoFocus
                placeholder="Type RESET"
                value={resetInput}
                onChange={(e) => setResetInput(e.target.value)}
                className="w-[100px] bg-[#0A0A0A] border border-[#FF4444]/40 rounded px-3 py-1.5 text-[11px] focus:border-[#FF4444] outline-none"
              />
              <button onClick={handleReset} className="p-1.5 text-[#FF4444] hover:bg-[#FF4444]/10 rounded">
                <Check className="w-4 h-4" />
              </button>
              <button onClick={() => setShowConfirm(false)} className="p-1.5 text-text-muted hover:bg-white/10 rounded">
                <X className="w-4 h-4" />
              </button>
           </motion.div>
         )}
      </td>
    </tr>
  );
}
