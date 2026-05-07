"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { performSearch, groupResults, flattenGroupedResults } from "@/lib/search";
import { useKeyboardNav } from "@/hooks/useKeyboardNav";
import { SearchResultGroup } from "./SearchResultGroup";
import { EntityType } from "@/lib/searchIndex";

interface SearchPanelProps {
  onClose: () => void;
}

export function SearchPanel({ onClose }: SearchPanelProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Compute search results
  const results = useMemo(() => performSearch(query), [query]);
  const groupedResults = useMemo(() => groupResults(results), [results]);
  const flatResults = useMemo(() => flattenGroupedResults(groupedResults), [groupedResults]);

  // Handle keyboard navigation
  const handleSelect = (index: number) => {
    const selectedItem = flatResults[index];
    if (selectedItem) {
      console.log(`Navigating to ${selectedItem.id}`);
      // In a real app, use router.push(`/entity/${selectedItem.id}`)
      alert(`Navigating to ${selectedItem.id}`);
      onClose();
    }
  };

  const { selectedIndex, reset } = useKeyboardNav(flatResults.length, handleSelect);

  // Reset selection when query changes
  useEffect(() => {
    reset();
  }, [query, reset]);

  // Calculate global start indices for each group
  let currentIndex = 0;
  const groupIndices: Record<string, number> = {};
  const order: EntityType[] = ["PROJECTS", "CLIENTS", "INVOICES", "TASKS", "LEADS"];
  
  order.forEach((type) => {
    groupIndices[type] = currentIndex;
    if (groupedResults[type]) {
      currentIndex += groupedResults[type].length;
    }
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: -16, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -16, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="w-full max-w-[600px] bg-[#0A0A0A] border border-[#252525] rounded-2xl shadow-[0_24px_64px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col"
      onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
    >
      {/* Search Input Area */}
      <div className="relative flex items-center p-4 border-b border-[#252525]">
        <Search className="w-6 h-6 text-text-secondary mr-4" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search any ID — PRJ, CLI, INV, TSK..."
          className="flex-1 bg-transparent border-none text-[18px] text-text-primary placeholder:text-[#3A3A3A] focus:outline-none focus:ring-0"
        />
        <div className="flex items-center gap-1 ml-4 opacity-50">
          <kbd className="px-1.5 py-1 bg-bg-card rounded text-[10px] font-mono border border-border">Esc</kbd>
        </div>
      </div>

      {/* Results Area */}
      <div className="max-h-[60vh] overflow-y-auto p-2 hide-scrollbar">
        {query.length > 0 ? (
          flatResults.length > 0 ? (
            order.map((type) => {
              const items = groupedResults[type] || [];
              if (items.length === 0) return null;
              return (
                <SearchResultGroup
                  key={type}
                  label={type}
                  items={items}
                  globalStartIndex={groupIndices[type]}
                  selectedIndex={selectedIndex}
                  onHover={() => {
                    // Note: In a robust implementation, hovering might update the selectedIndex
                    // For simplicity, we just rely on keyboard or let them click
                  }}
                  onSelect={(idx) => handleSelect(idx)}
                />
              );
            })
          ) : (
            <div className="p-8 text-center text-text-secondary text-sm">
              No results found for &quot;{query}&quot;
            </div>
          )
        ) : (
          <div className="p-8 text-center text-[#3A3A3A] text-sm flex flex-col items-center gap-4">
            <Search className="w-12 h-12 opacity-20" />
            Start typing to search across all entities
          </div>
        )}
      </div>
    </motion.div>
  );
}
