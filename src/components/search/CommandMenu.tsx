"use client";

import React, { useEffect } from 'react';
import { Command } from 'cmdk';
import { motion } from 'framer-motion';
import { IDChip } from '@/components/ui/IDChip';
import { Search, Folder, Users, Receipt } from 'lucide-react';
import { projectHealthData } from '@/lib/mockData/dashboard';

// Import CSS for cmdk if necessary or use Tailwind
import './cmdk.css';

interface CommandMenuProps {
  onClose: () => void;
}

export const CommandMenu = ({ onClose }: CommandMenuProps) => {
  // Prevent click from propagating to the backdrop and closing
  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: -20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -20 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="w-full max-w-[600px] overflow-hidden rounded-2xl bg-white border border-border shadow-2xl cmdk-wrapper"
      onClick={handleContentClick}
    >
      <Command label="Global Command Menu" className="flex flex-col w-full h-full bg-transparent">
        <div className="flex items-center px-4 border-b border-divider">
          <Search className="w-5 h-5 text-text-muted shrink-0" />
          <Command.Input 
            autoFocus
            placeholder="Search any ID — PRJ, CLI, INV, TSK..."
            className="flex-1 h-14 bg-transparent px-3 text-text-primary placeholder:text-text-muted focus:outline-none border-none text-base w-full"
          />
          <div className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-page-bg rounded text-[10px] font-mono border border-border text-text-secondary">ESC</kbd>
            <span className="text-[10px] text-text-muted ml-1">to close</span>
          </div>
        </div>

        <Command.List className="max-h-[350px] overflow-y-auto p-2 custom-scrollbar">
          <Command.Empty className="py-6 text-center text-sm text-text-secondary">
            No results found.
          </Command.Empty>

          <Command.Group heading="Projects" className="text-text-muted text-xs uppercase tracking-wider px-2 py-1.5 font-semibold">
            {projectHealthData.map(p => (
              <Command.Item
                key={p.id}
                value={p.id + ' ' + p.name}
                onSelect={() => {
                  console.log(`[CMD+K] Navigating to ${p.id}`);
                  onClose();
                }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer aria-selected:bg-page-bg aria-selected:border-l-2 aria-selected:border-accent aria-selected:rounded-l-sm transition-all group"
              >
                <div className="bg-accent-light p-1.5 rounded-md text-accent">
                  <Folder className="w-4 h-4" />
                </div>
                <div className="flex-1 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <IDChip id={p.id} size="xs" />
                    <span className="text-sm font-medium text-text-primary">{p.name}</span>
                  </div>
                  <span className="text-[10px] text-text-muted opacity-0 group-aria-selected:opacity-100 transition-opacity">
                    <kbd className="px-1 bg-white border border-border rounded font-mono shadow-sm">↵</kbd> to select
                  </span>
                </div>
              </Command.Item>
            ))}
          </Command.Group>

          <Command.Group heading="Clients" className="text-text-muted text-xs uppercase tracking-wider px-2 py-1.5 font-semibold mt-2">
            <Command.Item
              value="CLI-GOOG-26-001 Google"
              onSelect={onClose}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer aria-selected:bg-page-bg aria-selected:border-l-2 aria-selected:border-accent aria-selected:rounded-l-sm transition-all group"
            >
              <div className="bg-info-bg p-1.5 rounded-md text-info">
                <Users className="w-4 h-4" />
              </div>
              <div className="flex-1 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <IDChip id="CLI-GOOG-26-001" size="xs" variant="muted" />
                  <span className="text-sm font-medium text-text-primary">Google</span>
                </div>
                <span className="text-[10px] text-text-muted opacity-0 group-aria-selected:opacity-100 transition-opacity">
                  <kbd className="px-1 bg-white border border-border rounded font-mono shadow-sm">↵</kbd> to select
                </span>
              </div>
            </Command.Item>
            <Command.Item
              value="CLI-META-26-012 Meta"
              onSelect={onClose}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer aria-selected:bg-page-bg aria-selected:border-l-2 aria-selected:border-accent aria-selected:rounded-l-sm transition-all group"
            >
              <div className="bg-info-bg p-1.5 rounded-md text-info">
                <Users className="w-4 h-4" />
              </div>
              <div className="flex-1 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <IDChip id="CLI-META-26-012" size="xs" variant="muted" />
                  <span className="text-sm font-medium text-text-primary">Meta</span>
                </div>
                <span className="text-[10px] text-text-muted opacity-0 group-aria-selected:opacity-100 transition-opacity">
                  <kbd className="px-1 bg-white border border-border rounded font-mono shadow-sm">↵</kbd> to select
                </span>
              </div>
            </Command.Item>
          </Command.Group>

          <Command.Group heading="Recent Invoices" className="text-text-muted text-xs uppercase tracking-wider px-2 py-1.5 font-semibold mt-2">
            <Command.Item
              value="INV-2605-0042 INV-2605-0042"
              onSelect={onClose}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer aria-selected:bg-page-bg aria-selected:border-l-2 aria-selected:border-accent aria-selected:rounded-l-sm transition-all group"
            >
              <div className="bg-warning-bg p-1.5 rounded-md text-warning">
                <Receipt className="w-4 h-4" />
              </div>
              <div className="flex-1 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <IDChip id="INV-2605-0042" size="xs" />
                  <span className="text-[10px] font-semibold text-warning bg-warning-bg px-1.5 py-0.5 rounded uppercase">Overdue</span>
                </div>
                <span className="text-[10px] text-text-muted opacity-0 group-aria-selected:opacity-100 transition-opacity">
                  <kbd className="px-1 bg-white border border-border rounded font-mono shadow-sm">↵</kbd> to select
                </span>
              </div>
            </Command.Item>
          </Command.Group>
        </Command.List>
      </Command>
    </motion.div>
  );
};
