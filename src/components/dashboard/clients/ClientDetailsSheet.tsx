"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Building2, Mail, Phone, MapPin, Briefcase, FileText } from 'lucide-react';
import { Client } from '@/types/client';
import { IDChip } from '@/components/ui/IDChip';
import { getColorFromString, getInitials } from '@/lib/utils/colorHash';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils/format';

interface ClientDetailsSheetProps {
  client: Client | null;
  onClose: () => void;
}

type TabType = 'overview' | 'projects' | 'invoices';

export const ClientDetailsSheet = ({ client, onClose }: ClientDetailsSheetProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  return (
    <AnimatePresence>
      {client && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-[#0F172A]/80 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Slide-over Panel */}
          <motion.div
            initial={{ x: "100%", boxShadow: "-4px 0 24px rgba(0,0,0,0)" }}
            animate={{ x: 0, boxShadow: "-4px 0 24px rgba(0,0,0,0.05)" }}
            exit={{ x: "100%", boxShadow: "-4px 0 24px rgba(0,0,0,0)" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-[480px] bg-white flex flex-col border-l border-divider"
          >
            {/* Header */}
            <div className="flex flex-col px-6 pt-6 pb-4 border-b border-divider bg-page-bg">
              <div className="flex items-start justify-between mb-4">
                <IDChip id={client.id} />
                <button
                  onClick={onClose}
                  className="p-2 -mr-2 text-text-muted hover:text-text-primary hover:bg-divider rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center gap-4">
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold text-[#0F172A] shadow-sm border border-border"
                  style={{ backgroundColor: getColorFromString(client.name) }}
                >
                  {getInitials(client.name)}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-text-primary">{client.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-medium text-text-secondary">{client.industry}</span>
                    <span className="w-1 h-1 rounded-full bg-border" />
                    <span className={cn(
                      "text-xs font-bold uppercase tracking-wider",
                      client.status === "Active" ? "text-success" : "text-text-muted"
                    )}>
                      {client.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex px-6 border-b border-divider bg-white">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'projects', label: `Projects (${client.activeProjects.length})` },
                { id: 'invoices', label: 'Invoices' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={cn(
                    "px-4 py-3 text-sm font-semibold transition-all relative",
                    activeTab === tab.id
                      ? "text-text-primary"
                      : "text-text-secondary hover:text-text-primary hover:bg-page-bg"
                  )}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="client-sheet-tab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 bg-white custom-scrollbar">
              {activeTab === 'overview' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  {/* Contact Info */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Primary Contact</h3>
                    
                    <div className="flex items-center gap-3 text-sm text-text-primary">
                      <div className="w-8 h-8 rounded-full bg-page-bg flex items-center justify-center text-text-secondary">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <span className="font-medium">{client.contactPerson}</span>
                    </div>
                    
                    <div className="flex items-center gap-3 text-sm text-text-secondary">
                      <div className="w-8 h-8 rounded-full bg-page-bg flex items-center justify-center">
                        <Mail className="w-4 h-4" />
                      </div>
                      <a href={`mailto:${client.contactEmail}`} className="hover:text-accent transition-colors">{client.contactEmail}</a>
                    </div>
                    
                    <div className="flex items-center gap-3 text-sm text-text-secondary">
                      <div className="w-8 h-8 rounded-full bg-page-bg flex items-center justify-center">
                        <Phone className="w-4 h-4" />
                      </div>
                      <span>{client.contactPhone}</span>
                    </div>

                    <div className="flex items-start gap-3 text-sm text-text-secondary">
                      <div className="w-8 h-8 rounded-full bg-page-bg flex items-center justify-center shrink-0">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <span className="mt-1.5 leading-relaxed">{client.billingAddress}</span>
                    </div>
                  </div>

                  <div className="h-px bg-divider w-full" />

                  {/* Financials */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Financial Summary</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-page-bg border border-divider">
                        <p className="text-xs text-text-secondary font-medium mb-1">Total Billed</p>
                        <p className="text-xl font-bold text-text-primary">{formatCurrency(client.totalBilled)}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-page-bg border border-divider">
                        <p className="text-xs text-text-secondary font-medium mb-1">Payment Terms</p>
                        <p className="text-xl font-bold text-text-primary">{client.paymentTerms}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'projects' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  {client.activeProjects.length > 0 ? (
                    client.activeProjects.map((projectId) => (
                      <div key={projectId} className="p-4 rounded-xl border border-divider hover:border-border transition-colors group cursor-pointer flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-accent-light text-accent">
                            <Briefcase className="w-4 h-4" />
                          </div>
                          <div>
                            <IDChip id={projectId} size="xs" variant="muted" />
                            <p className="text-sm font-medium text-text-primary mt-1 group-hover:text-accent transition-colors">View Project Details</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-12 h-12 rounded-full bg-page-bg flex items-center justify-center text-text-muted mx-auto mb-3">
                        <Briefcase className="w-5 h-5" />
                      </div>
                      <p className="text-text-secondary text-sm">No active projects found.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'invoices' && (
                <div className="text-center py-12 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="w-12 h-12 rounded-full bg-page-bg flex items-center justify-center text-text-muted mx-auto mb-3">
                    <FileText className="w-5 h-5" />
                  </div>
                  <p className="text-text-secondary text-sm">Invoice history will appear here.</p>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-divider bg-page-bg">
              <button className="w-full py-3 bg-white border border-border text-text-primary font-bold text-sm rounded-lg hover:bg-page-bg transition-colors shadow-sm">
                Edit Client Profile
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
