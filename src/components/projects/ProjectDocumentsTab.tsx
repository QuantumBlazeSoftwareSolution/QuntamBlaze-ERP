"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Filter,
  FileText,
  Download,
  MoreHorizontal,
  Plus,
  Eye,
  Loader2,
  HardDrive,
  AlertTriangle,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { IDChip } from "@/components/ui/IDChip";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  getProjectDocumentsAction,
  uploadProjectDocumentAction,
  getGoogleDriveStatusAction,
} from "@/app/actions/gdriveActions";
import Link from "next/link";

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  status: "Draft" | "Review" | "Approved" | "Signed";
  updatedAt: string;
}

interface ProjectDocumentsTabProps {
  project: {
    id: string;
    name: string;
    [key: string]: any;
  };
}

const MOCK_DOCS: Document[] = [
  {
    id: "PRO-GOOG-26-001",
    name: "Nexus Core Migration Proposal",
    type: "PDF Document",
    size: "2.4 MB",
    status: "Approved",
    updatedAt: "2026-01-05",
  },
  {
    id: "AGR-GOOG-26-001",
    name: "Strategic Partnership Agreement",
    type: "Digital Sign",
    size: "1.1 MB",
    status: "Signed",
    updatedAt: "2026-01-10",
  },
  {
    id: "SRS-GOOG-26-001",
    name: "Core System Requirements Specification",
    type: "Markdown",
    size: "840 KB",
    status: "Review",
    updatedAt: "2026-01-15",
  },
  {
    id: "QTE-GOOG-26-042",
    name: "Infrastructure Scaling Quotation",
    type: "PDF Document",
    size: "1.8 MB",
    status: "Draft",
    updatedAt: "2026-05-02",
  },
];

export function ProjectDocumentsTab({ project }: ProjectDocumentsTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [gdriveStatus, setGDriveStatus] = useState<{
    isConnected: boolean;
    baseFolder: { baseFolderId: string; baseFolderName: string } | null;
  }>({
    isConnected: false,
    baseFolder: null,
  });

  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load status and documents
  const loadContent = async () => {
    setLoading(true);
    try {
      // 1. Fetch integration state
      const statusRes = await getGoogleDriveStatusAction();
      let connected = false;
      let baseFolder = null;

      if (statusRes.success) {
        connected = !!statusRes.isConnected;
        baseFolder = statusRes.baseFolder || null;
        setGDriveStatus({ isConnected: connected, baseFolder });
      }

      // 2. Fetch documents
      if (connected && baseFolder) {
        const docsRes = await getProjectDocumentsAction(project.id);
        if (docsRes.success && docsRes.files) {
          setDocuments(docsRes.files as Document[]);
        } else {
          console.warn("Could not retrieve real drive assets, falling back to mock:", docsRes.error);
          setDocuments(MOCK_DOCS);
        }
      } else {
        // Fallback to mock documents if Google Drive is not integrated
        setDocuments(MOCK_DOCS);
      }
    } catch (err) {
      console.error("Error loading project documents:", err);
      setDocuments(MOCK_DOCS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, [project.id]);

  // Handle file upload
  const handleUploadClick = () => {
    if (!gdriveStatus.isConnected || !gdriveStatus.baseFolder) {
      // If not connected, alert that upload is only mock or disabled
      setNotification({
        type: "error",
        message: "Google Drive is offline. Connect Google Drive in Settings to upload real assets.",
      });
      setTimeout(() => setNotification(null), 5000);
      return;
    }
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setNotification(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await uploadProjectDocumentAction(project.id, formData);
      if (res.success) {
        setNotification({
          type: "success",
          message: `Successfully uploaded "${file.name}" to Google Drive!`,
        });
        // Clear input value
        if (fileInputRef.current) fileInputRef.current.value = "";
        
        // Refresh list
        await loadContent();
      } else {
        setNotification({
          type: "error",
          message: res.error || "Failed to upload file to Google Drive.",
        });
      }
    } catch (err: any) {
      setNotification({
        type: "error",
        message: err.message || "An unexpected error occurred during upload.",
      });
    } finally {
      setUploading(false);
      setTimeout(() => setNotification(null), 5000);
    }
  };

  // Filter documents by search query
  const filteredDocs = documents.filter((doc) =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Statistics calculations
  const totalCount = documents.length;
  const totalCountStr = totalCount < 10 ? `0${totalCount}` : `${totalCount}`;
  const totalSize = gdriveStatus.isConnected && gdriveStatus.baseFolder 
    ? `${totalCount} active cloud objects`
    : "3.4 GB total storage";

  return (
    <div className="space-y-6">
      {/* Hidden File Input for Triggering Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Cloud Status Notifications */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={cn(
              "flex items-center gap-3 px-6 py-4 rounded-xl text-[13px] font-bold border shadow-sm",
              notification.type === "success"
                ? "bg-emerald-50 border-emerald-100 text-emerald-600"
                : "bg-danger/10 border-danger/20 text-danger"
            )}
          >
            {notification.type === "success" ? (
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            )}
            <span className="flex-1">{notification.message}</span>
            <button
              onClick={() => setNotification(null)}
              className="p-1 rounded-lg hover:bg-black/5 transition-colors"
            >
              <XIcon className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Offline Integration Warning Banner */}
      {!loading && (!gdriveStatus.isConnected || !gdriveStatus.baseFolder) && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-amber-200 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-amber-50 rounded-xl text-amber-500 border border-amber-100 flex-shrink-0">
              <AlertTriangle className="w-6 h-6 animate-pulse" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-black text-text-primary uppercase tracking-wide">
                Google Drive Storage Offline
              </h4>
              <p className="text-[12px] text-text-secondary leading-relaxed max-w-2xl">
                Dynamic cloud storage is not connected. Connect Google Drive in the Settings Integration panel to automatically generate project workspaces, allocate directory permissions, and stream physical documents in real-time. Showing local simulated blueprints.
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/settings?tab=integrations"
            className="flex items-center justify-center gap-2 px-5 py-3 border border-amber-200 hover:border-amber-300 hover:bg-amber-50/30 text-amber-600 font-bold rounded-xl text-[11px] uppercase tracking-widest whitespace-nowrap transition-all"
          >
            Integrate Hub
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      )}

      {/* Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
          <input
            type="text"
            placeholder={
              gdriveStatus.isConnected && gdriveStatus.baseFolder
                ? "Search cloud assets..."
                : "Search orchestration artifacts..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-11 pr-4 bg-white border border-[#E2E8F0] rounded-xl text-sm font-bold text-[#0F172A] focus:outline-none focus:ring-4 focus:ring-[#10B981]/10 focus:border-[#10B981] transition-all"
          />
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-xl text-xs font-black text-[#475569] uppercase tracking-widest hover:bg-[#F8FAFC] transition-all">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button
            onClick={handleUploadClick}
            disabled={uploading}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#10B981] text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-[#10B981]/20 hover:scale-[1.02] active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                {gdriveStatus.isConnected && gdriveStatus.baseFolder ? (
                  <Plus className="w-4 h-4" />
                ) : (
                  <HardDrive className="w-4 h-4" />
                )}
                Upload Artifact
              </>
            )}
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DocStatCard
          label={
            gdriveStatus.isConnected && gdriveStatus.baseFolder
              ? "Cloud Objects"
              : "Total Documents"
          }
          value={totalCountStr}
          subValue={totalSize}
        />
        <DocStatCard
          label="Google Sync Status"
          value={gdriveStatus.isConnected && gdriveStatus.baseFolder ? "Active" : "Offline"}
          subValue={
            gdriveStatus.isConnected && gdriveStatus.baseFolder
              ? `Sync Folder: ${gdriveStatus.baseFolder.baseFolderName}`
              : "Using simulated local sandbox"
          }
          isActive={gdriveStatus.isConnected && !!gdriveStatus.baseFolder}
        />
        <DocStatCard
          label="Sync Directory ID"
          value={gdriveStatus.isConnected && gdriveStatus.baseFolder ? "G-DRV" : "MOCK"}
          subValue={
            gdriveStatus.isConnected && gdriveStatus.baseFolder
              ? `Project Folder: Project-${project.id}`
              : "N/A - Offline mode active"
          }
        />
      </div>

      {/* Documents List */}
      <div className="bg-white border border-[#E2E8F0] rounded-3xl overflow-hidden shadow-sm relative min-h-[250px]">
        {loading ? (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex flex-col items-center justify-center gap-3 z-10">
            <Loader2 className="w-8 h-8 animate-spin text-[#10B981]" />
            <p className="text-xs font-bold text-text-secondary uppercase tracking-widest">
              Syncing Cloud Assets...
            </p>
          </div>
        ) : null}

        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[#F1F5F9] bg-[#F8FAFC] text-[10px] font-black text-[#94A3B8] uppercase tracking-[0.15em]">
              <th className="px-8 py-4">Artifact ID</th>
              <th className="px-8 py-4">Document Name</th>
              <th className="px-8 py-4">Status</th>
              <th className="px-8 py-4">Last Sync</th>
              <th className="px-8 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F5F9]">
            {filteredDocs.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-16 text-text-muted text-[13px] font-bold">
                  {searchQuery ? "No matching assets found." : "No documents uploaded yet in this workspace."}
                </td>
              </tr>
            ) : (
              filteredDocs.map((doc, idx) => (
                <motion.tr
                  key={doc.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group hover:bg-[#F8FAFC] transition-colors"
                >
                  <td className="px-8 py-5">
                    <IDChip id={doc.id.startsWith("0") || doc.id.length > 15 ? doc.id.slice(0, 12) + "..." : doc.id} size="xs" variant="accent" />
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#F1F5F9] border border-[#E2E8F0] flex items-center justify-center text-[#94A3B8] group-hover:bg-[#10B981]/10 group-hover:text-[#10B981] transition-colors">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#0F172A] group-hover:text-[#10B981] transition-colors max-w-sm break-all">
                          {doc.name}
                        </p>
                        <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">
                          {doc.type} • {doc.size}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span
                      className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                        doc.status === "Approved" && "bg-emerald-50 text-emerald-600 border-emerald-100",
                        doc.status === "Signed" && "bg-blue-50 text-blue-600 border-blue-100",
                        doc.status === "Review" && "bg-amber-50 text-amber-600 border-amber-100",
                        doc.status === "Draft" && "bg-slate-50 text-slate-400 border-slate-200"
                      )}
                    >
                      {doc.status}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-[11px] font-mono font-bold text-[#64748B]">
                      {doc.updatedAt}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 rounded-lg hover:bg-white border border-transparent hover:border-[#E2E8F0] text-[#94A3B8] hover:text-[#10B981] transition-all cursor-pointer">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-white border border-transparent hover:border-[#E2E8F0] text-[#94A3B8] hover:text-[#475569] transition-all cursor-pointer">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-white border border-transparent hover:border-[#E2E8F0] text-[#94A3B8] hover:text-[#475569] transition-all cursor-pointer">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DocStatCard({
  label,
  value,
  subValue,
  isActive = false,
}: {
  label: string;
  value: string;
  subValue: string;
  isActive?: boolean;
}) {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-sm relative overflow-hidden">
      <p className="text-[10px] font-black text-[#94A3B8] uppercase tracking-[0.2em] mb-1">
        {label}
      </p>
      <div className="flex items-baseline gap-2">
        <span
          className={cn(
            "text-3xl font-black",
            isActive ? "text-emerald-500 animate-pulse" : "text-[#0F172A]"
          )}
        >
          {value}
        </span>
        <span className="text-[11px] font-bold text-[#64748B] max-w-[200px] truncate" title={subValue}>
          {subValue}
        </span>
      </div>
    </div>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={className}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
