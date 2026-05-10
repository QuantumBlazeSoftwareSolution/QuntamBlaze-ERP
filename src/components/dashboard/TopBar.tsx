"use client";

import React from 'react';
import { Search, Bell, User } from 'lucide-react';

export const TopBar = ({ title }: { title: string }) => {
  return (
    <header className="h-16 border-b border-divider bg-white px-8 flex items-center justify-between sticky top-0 z-30">
      <h1 className="text-text-primary text-xl font-bold">{title}</h1>

      <div className="flex items-center gap-6">
        {/* Search Bar */}
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-accent transition-colors" />
          <input 
            type="text" 
            placeholder="Search ID or name... (⌘K)"
            className="h-9 w-64 pl-10 pr-4 bg-white border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
          />
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-4">
          <button className="relative p-2 text-text-secondary hover:text-text-primary hover:bg-page-bg rounded-lg transition-all group">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-danger border-2 border-white rounded-full" />
          </button>
          
          <div className="h-8 w-px bg-divider mx-1" />

          <button className="flex items-center gap-3 pl-2 group">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-text-primary leading-tight">Jane Doe</p>
              <p className="text-[10px] font-mono text-text-muted uppercase tracking-tighter">USR-JD-26-004</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-accent-light border border-accent-border flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all">
              <User className="w-5 h-5" />
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
