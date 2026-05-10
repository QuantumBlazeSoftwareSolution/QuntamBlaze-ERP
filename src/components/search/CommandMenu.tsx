"use client";

import React, { useState, useEffect } from "react";
import { Command } from "cmdk";
import { motion, AnimatePresence } from "framer-motion";
import { IDChip } from "@/components/ui/IDChip";
import { 
  Search, 
  Folder, 
  Users, 
  Receipt, 
  Target, 
  Briefcase, 
  UserCircle,
  Loader2,
  ChevronRight
} from "lucide-react";
import { useRouter } from "next/navigation";
import { globalSearch, SearchResult } from "@/app/actions/search";
import { cn } from "@/lib/utils";

// Import CSS for cmdk
import "./cmdk.css";

interface CommandMenuProps {
  onClose: () => void;
}

export const CommandMenu = ({ onClose }: CommandMenuProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchResults = async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const searchResults = await globalSearch(query);
        setResults(searchResults);
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchResults, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleSelect = (href: string) => {
    router.push(href);
    onClose();
  };

  const categories = {
    project: { label: "Projects", icon: <Folder className="w-4 h-4" />, color: "text-accent bg-accent/10" },
    client: { label: "Clients", icon: <Users className="w-4 h-4" />, color: "text-blue-500 bg-blue-500/10" },
    invoice: { label: "Invoices", icon: <Receipt className="w-4 h-4" />, color: "text-amber-500 bg-amber-500/10" },
    lead: { label: "Leads", icon: <Target className="w-4 h-4" />, color: "text-rose-500 bg-rose-500/10" },
    employee: { label: "Employees", icon: <UserCircle className="w-4 h-4" />, color: "text-emerald-500 bg-emerald-500/10" },
    task: { label: "Tasks", icon: <Briefcase className="w-4 h-4" />, color: "text-violet-500 bg-violet-500/10" },
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98, y: -10 }}
      className="w-full max-w-[650px] overflow-hidden rounded-2xl bg-white border border-border shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] z-[200]"
      onClick={(e) => e.stopPropagation()}
    >
      <Command label="Global Search" className="flex flex-col w-full h-full bg-transparent">
        <div className="flex items-center px-5 border-b border-divider">
          <Search className="w-5 h-5 text-text-muted shrink-0" />
          <Command.Input
            autoFocus
            value={query}
            onValueChange={setQuery}
            placeholder="Search anything — PRJ, CLI, INV, TSK..."
            className="flex-1 h-16 bg-transparent px-4 text-text-primary placeholder:text-text-muted focus:outline-none border-none text-[15px] font-medium"
          />
          {isLoading ? (
            <Loader2 className="w-4 h-4 text-accent animate-spin" />
          ) : (
            <div className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-[9px] font-black text-slate-500 border border-slate-200">
                ESC
              </kbd>
            </div>
          )}
        </div>

        <Command.List className="max-h-[450px] overflow-y-auto p-3 custom-scrollbar min-h-[100px]">
          <Command.Empty>
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <Search className="w-8 h-8 text-slate-200 mb-4" />
              <p className="text-sm font-bold text-slate-400">
                {query.length < 2 ? "Type at least 2 characters..." : "No matching results found."}
              </p>
            </div>
          </Command.Empty>

          {Object.entries(categories).map(([type, config]) => {
            const categoryResults = results.filter((r) => r.type === type);
            if (categoryResults.length === 0) return null;

            return (
              <Command.Group
                key={type}
                heading={config.label}
                className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] px-3 py-3"
              >
                {categoryResults.map((result) => (
                  <Command.Item
                    key={result.id}
                    value={`${result.id} ${result.name}`}
                    onSelect={() => handleSelect(result.href)}
                    className="flex items-center gap-4 px-3 py-3 rounded-xl cursor-pointer aria-selected:bg-slate-50 transition-all group"
                  >
                    <div className={cn("p-2 rounded-xl transition-colors", config.color)}>
                      {config.icon}
                    </div>
                    <div className="flex-1 flex items-center justify-between min-w-0">
                      <div className="flex items-center gap-3 min-w-0">
                        <IDChip id={result.id} size="xs" variant={type === "project" ? "accent" : "muted"} />
                        <span className="text-sm font-bold text-slate-700 truncate">
                          {result.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-aria-selected:opacity-100 transition-opacity shrink-0">
                         {result.metadata && (
                           <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-slate-100 text-slate-500 rounded">
                             {result.metadata}
                           </span>
                         )}
                         <ChevronRight className="w-4 h-4 text-accent" />
                      </div>
                    </div>
                  </Command.Item>
                ))}
              </Command.Group>
            );
          })}
        </Command.List>
      </Command>
    </motion.div>
  );
};
