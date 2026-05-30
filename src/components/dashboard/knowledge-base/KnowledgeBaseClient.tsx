"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Plus,
  Search,
  Cpu,
  FileText,
  Layers,
  Sparkles,
  Edit3,
  Trash2,
  RefreshCw,
  X,
  Check,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Settings,
  Tag,
  Clock,
  Database,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getKnowledgeDocumentsAction,
  createKnowledgeDocumentAction,
  updateKnowledgeDocumentAction,
  deleteKnowledgeDocumentAction,
  embedKnowledgeDocumentAction,
  checkKnowledgeBaseReadyAction,
  seedDefaultKnowledgeAction,
} from "@/app/actions/knowledgeBaseActions";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface KBDocument {
  id: string;
  title: string;
  description: string | null;
  category: string;
  status: string;
  chunkCount: number;
  createdBy: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

interface KBStatus {
  geminiConfigured: boolean;
  baseModel: string | null;
  docCount: number;
  chunkCount: number;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const CATEGORIES = ["All", "General", "Projects", "HR", "Finance", "Operations", "Technical"];

const CATEGORY_COLORS: Record<string, string> = {
  General: "bg-[#64748b]/10 text-[#64748b] border-[#64748b]/20",
  Projects: "bg-[#6366f1]/10 text-[#6366f1] border-[#6366f1]/20",
  HR: "bg-[#10b981]/10 text-[#10b981] border-[#10b981]/20",
  Finance: "bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/20",
  Operations: "bg-[#ef4444]/10 text-[#ef4444] border-[#ef4444]/20",
  Technical: "bg-[#0ea5e9]/10 text-[#0ea5e9] border-[#0ea5e9]/20",
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 26 } },
};

// ---------------------------------------------------------------------------
// Drawer component
// ---------------------------------------------------------------------------

function DocumentDrawer({
  open,
  doc,
  onClose,
  onSaved,
}: {
  open: boolean;
  doc: KBDocument | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("General");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [embedding, setEmbedding] = useState(false);
  const [embedStatus, setEmbedStatus] = useState<{
    type: "idle" | "success" | "error";
    msg: string;
  }>({
    type: "idle",
    msg: "",
  });
  const [savedDocId, setSavedDocId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setTitle(doc?.title || "");
      setDescription(doc?.description || "");
      setCategory(doc?.category || "General");
      setContent("");
      setEmbedStatus({ type: "idle", msg: "" });
      setSavedDocId(doc?.id || null);
      setError("");
    }
  }, [open, doc]);

  const handleSave = async () => {
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!content.trim() && !doc) {
      setError("Content is required.");
      return;
    }
    setError("");
    setSaving(true);
    try {
      let docId = savedDocId;
      if (doc) {
        await updateKnowledgeDocumentAction(doc.id, { title, description, category });
        docId = doc.id;
      } else {
        const res = await createKnowledgeDocumentAction({ title, description, category, content });
        if (!res.success) {
          setError(res.error || "Failed to save.");
          return;
        }
        docId = res.documentId!;
        setSavedDocId(docId);
      }
      onSaved();

      // Auto-embed after save if content provided
      if (content.trim() && docId) {
        await handleEmbed(docId, content);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleEmbed = async (docId: string, text: string) => {
    setEmbedding(true);
    setEmbedStatus({ type: "idle", msg: "Splitting into chunks and embedding..." });
    const res = await embedKnowledgeDocumentAction(docId, text);
    setEmbedding(false);
    if (res.success) {
      setEmbedStatus({
        type: "success",
        msg: `✓ ${res.chunksEmbedded} chunk${res.chunksEmbedded === 1 ? "" : "s"} embedded successfully!`,
      });
      onSaved();
    } else {
      setEmbedStatus({ type: "error", msg: res.error || "Embedding failed." });
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />

          {/* Slide-over panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-[560px] bg-white border-l border-divider shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-divider shrink-0 bg-page-bg">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center border border-accent/20">
                  <FileText className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <h3 className="font-bold text-text-primary text-sm">
                    {doc ? "Edit Document" : "Add Knowledge Document"}
                  </h3>
                  <p className="text-[11px] text-text-muted">
                    The content will be split into chunks and embedded
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white text-text-muted hover:text-text-primary transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-6 space-y-5">
              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
                  Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. How to create a project in QuantumBlaze"
                  className="w-full bg-page-bg border border-divider rounded-lg h-10 px-3.5 text-sm text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all placeholder:text-text-muted"
                />
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
                  Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.filter((c) => c !== "All").map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider border transition-all",
                        category === cat
                          ? "bg-accent text-white border-accent"
                          : "bg-page-bg border-divider text-text-muted hover:border-accent/40 hover:text-text-primary"
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
                  Description (optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  placeholder="Brief summary of what this document covers..."
                  className="w-full bg-page-bg border border-divider rounded-lg px-3.5 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all placeholder:text-text-muted resize-none custom-scrollbar"
                />
              </div>

              {/* Content */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
                  Knowledge Content *
                </label>
                <p className="text-[11px] text-text-muted">
                  Paste or type the full knowledge content. It will be automatically split into
                  chunks and embedded as vectors.
                </p>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={12}
                  placeholder={`Paste your knowledge content here...\n\nExample:\nTo create a new project in QuantumBlaze ERP:\n1. Navigate to the Projects section from the sidebar.\n2. Click the "New Project" button in the top right corner.\n3. Fill in the project name, client, deadline, and budget.\n4. Click Save to create the project.`}
                  className="w-full bg-page-bg border border-divider rounded-lg px-3.5 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all placeholder:text-text-muted resize-none custom-scrollbar font-mono leading-relaxed"
                />
                {content.trim() && (
                  <p className="text-[11px] text-text-muted">
                    ~{Math.max(1, Math.ceil(content.trim().split(/\s+/).length / 500))} chunk
                    {Math.ceil(content.trim().split(/\s+/).length / 500) !== 1 ? "s" : ""} will be
                    created ({content.trim().split(/\s+/).length} words)
                  </p>
                )}
              </div>

              {/* Embed status */}
              <AnimatePresence>
                {embedStatus.type !== "idle" && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={cn(
                      "flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm",
                      embedStatus.type === "success"
                        ? "bg-[#10b981]/5 border-[#10b981]/20 text-[#10b981]"
                        : embedStatus.type === "error"
                          ? "bg-danger/5 border-danger/20 text-danger"
                          : "bg-accent/5 border-accent/20 text-accent"
                    )}
                  >
                    {embedding ? (
                      <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                    ) : embedStatus.type === "success" ? (
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 shrink-0" />
                    )}
                    <span className="font-medium">{embedStatus.msg}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 text-danger text-sm bg-danger/5 border border-danger/20 rounded-lg px-4 py-3">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="shrink-0 px-6 py-4 border-t border-divider bg-page-bg flex items-center gap-3">
              <button
                onClick={onClose}
                className="flex-1 h-10 border border-divider rounded-lg text-[12px] font-bold uppercase tracking-wider text-text-muted hover:text-text-primary hover:bg-white transition-colors"
              >
                Cancel
              </button>

              {/* Re-embed only (for existing doc) */}
              {doc && savedDocId && content.trim() && (
                <button
                  onClick={() => handleEmbed(savedDocId, content)}
                  disabled={embedding}
                  className="h-10 px-4 border border-accent/40 text-accent rounded-lg text-[12px] font-bold uppercase tracking-wider hover:bg-accent/5 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {embedding ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Zap className="w-3.5 h-3.5" />
                  )}
                  Re-Embed
                </button>
              )}

              <button
                onClick={handleSave}
                disabled={saving || embedding || !title.trim()}
                className="flex-1 h-10 bg-accent hover:bg-accent-hover text-white rounded-lg text-[12px] font-bold uppercase tracking-wider transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving || embedding ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Check className="w-3.5 h-3.5" />
                )}
                {saving
                  ? "Saving..."
                  : embedding
                    ? "Embedding..."
                    : doc
                      ? "Update"
                      : "Save & Embed"}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ---------------------------------------------------------------------------
// Delete confirmation modal
// ---------------------------------------------------------------------------

function DeleteModal({
  doc,
  onConfirm,
  onCancel,
  deleting,
}: {
  doc: KBDocument | null;
  onConfirm: () => void;
  onCancel: () => void;
  deleting: boolean;
}) {
  if (!doc) return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92 }}
          className="bg-white rounded-2xl border border-divider shadow-2xl p-6 max-w-md w-full"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-danger/10 flex items-center justify-center border border-danger/20">
              <Trash2 className="w-5 h-5 text-danger" />
            </div>
            <div>
              <h3 className="font-bold text-text-primary">Delete Document</h3>
              <p className="text-xs text-text-muted">This action cannot be undone</p>
            </div>
          </div>
          <p className="text-sm text-text-secondary mb-1">
            Are you sure you want to delete{" "}
            <strong className="text-text-primary">"{doc.title}"</strong>?
          </p>
          <p className="text-xs text-text-muted mb-6">
            All {doc.chunkCount} embedded vector chunk{doc.chunkCount !== 1 ? "s" : ""} will be
            permanently deleted.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 h-10 border border-divider rounded-xl text-sm font-bold text-text-muted hover:text-text-primary hover:bg-page-bg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={deleting}
              className="flex-1 h-10 bg-danger hover:bg-danger/90 text-white rounded-xl text-sm font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {deleting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ---------------------------------------------------------------------------
// Document Card
// ---------------------------------------------------------------------------

function DocCard({
  doc,
  onEdit,
  onDelete,
  onReEmbed,
}: {
  doc: KBDocument;
  onEdit: () => void;
  onDelete: () => void;
  onReEmbed: () => void;
}) {
  const catColor = CATEGORY_COLORS[doc.category] || CATEGORY_COLORS.General;

  return (
    <motion.div
      variants={itemVariants}
      className="bg-white border border-border rounded-xl p-5 hover:shadow-md hover:border-accent/30 transition-all group"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-accent/8 flex items-center justify-center border border-accent/15 shrink-0 mt-0.5">
            <FileText className="w-4 h-4 text-accent" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-text-primary text-sm leading-snug truncate">
              {doc.title}
            </h3>
            {doc.description && (
              <p className="text-xs text-text-muted mt-0.5 line-clamp-2">{doc.description}</p>
            )}
          </div>
        </div>
        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button
            onClick={onReEmbed}
            title="Re-embed"
            className="p-1.5 rounded-lg hover:bg-[#10b981]/10 text-text-muted hover:text-[#10b981] transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onEdit}
            title="Edit"
            className="p-1.5 rounded-lg hover:bg-accent/10 text-text-muted hover:text-accent transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onDelete}
            title="Delete"
            className="p-1.5 rounded-lg hover:bg-danger/10 text-text-muted hover:text-danger transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Footer meta */}
      <div className="flex items-center gap-2 flex-wrap">
        <span
          className={cn(
            "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
            catColor
          )}
        >
          {doc.category}
        </span>

        {/* Embedded status */}
        {doc.chunkCount > 0 ? (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#10b981]/8 text-[#10b981] text-[10px] font-bold uppercase tracking-wider border border-[#10b981]/20">
            <Layers className="w-2.5 h-2.5" />
            {doc.chunkCount} chunk{doc.chunkCount !== 1 ? "s" : ""}
          </span>
        ) : (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-warning/8 text-warning text-[10px] font-bold uppercase tracking-wider border border-warning/20">
            <AlertCircle className="w-2.5 h-2.5" />
            Not embedded
          </span>
        )}

        <span className="ml-auto flex items-center gap-1 text-[10px] text-text-muted">
          <Clock className="w-2.5 h-2.5" />
          {new Date(doc.updatedAt).toLocaleDateString()}
        </span>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Main client component
// ---------------------------------------------------------------------------

export function KnowledgeBaseClient() {
  const [documents, setDocuments] = useState<KBDocument[]>([]);
  const [kbStatus, setKbStatus] = useState<KBStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<KBDocument | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<KBDocument | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Seeding states
  const [seeding, setSeeding] = useState(false);
  const [seedingStep, setSeedingStep] = useState("");
  const [seedingStatus, setSeedingStatus] = useState<"idle" | "seeding" | "success" | "error">(
    "idle"
  );
  const [seedingError, setSeedingError] = useState("");

  // Re-embed from card action
  const [reEmbedTarget, setReEmbedTarget] = useState<KBDocument | null>(null);

  const loadData = async () => {
    setLoading(true);
    const [docsRes, statusRes] = await Promise.all([
      getKnowledgeDocumentsAction(),
      checkKnowledgeBaseReadyAction(),
    ]);
    if (docsRes.success) setDocuments(docsRes.documents as KBDocument[]);
    if (statusRes.success !== false) {
      setKbStatus({
        geminiConfigured: statusRes.geminiConfigured,
        baseModel: statusRes.baseModel || null,
        docCount: statusRes.docCount,
        chunkCount: statusRes.chunkCount,
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    await deleteKnowledgeDocumentAction(deleteTarget.id);
    setDeleting(false);
    setDeleteTarget(null);
    await loadData();
  };

  const handleSeedDefaultKnowledge = async () => {
    setSeeding(true);
    setSeedingStatus("seeding");
    setSeedingStep("Preparing operational files...");

    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    try {
      await delay(800);
      setSeedingStep("Reading system configurations & default templates...");
      await delay(800);
      setSeedingStep("Generating 768-dimensional AI vector embeddings via Gemini...");

      const res = await seedDefaultKnowledgeAction();
      if (res.success) {
        await delay(600);
        setSeedingStep(
          `Successfully embedded ${res.chunksEmbedded} chunks for ${res.documentsSeeded} operational guides!`
        );
        setSeedingStatus("success");
        await delay(1500);
        setSeedingStatus("idle");
        await loadData();
      } else {
        setSeedingError(res.error || "Failed to seed knowledge base.");
        setSeedingStatus("error");
      }
    } catch (err: any) {
      setSeedingError(err.message || "An unexpected error occurred.");
      setSeedingStatus("error");
    } finally {
      setSeeding(false);
    }
  };

  const filtered = documents.filter((d) => {
    const matchCat = activeCategory === "All" || d.category === activeCategory;
    const matchSearch =
      !searchQuery ||
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.description || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  // Gemini not configured guard
  if (!loading && kbStatus && !kbStatus.geminiConfigured) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-6 text-center">
        <div className="w-20 h-20 rounded-2xl bg-accent/8 flex items-center justify-center border border-accent/20">
          <Sparkles className="w-10 h-10 text-accent" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-text-primary mb-2">Gemini AI Not Configured</h2>
          <p className="text-text-secondary text-sm max-w-md">
            The Knowledge Base requires a Gemini API key to embed documents and answer questions.
            Please configure it in Settings first.
          </p>
        </div>
        <a
          href="/dashboard/settings?tab=integrations"
          className="flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-hover text-white rounded-xl text-sm font-bold uppercase tracking-wider transition-colors"
        >
          <Settings className="w-4 h-4" />
          Go to Settings → Integrations
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      {kbStatus && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { label: "Documents", value: kbStatus.docCount, icon: FileText, color: "text-accent" },
            {
              label: "Vector Chunks",
              value: kbStatus.chunkCount,
              icon: Layers,
              color: "text-[#6366f1]",
            },
            {
              label: "Embedding Model",
              value: "text-embedding-004",
              icon: Cpu,
              color: "text-[#10b981]",
              small: true,
            },
            {
              label: "AI Status",
              value: kbStatus.geminiConfigured ? "Active" : "Not Configured",
              icon: kbStatus.geminiConfigured ? CheckCircle2 : AlertCircle,
              color: kbStatus.geminiConfigured ? "text-[#10b981]" : "text-danger",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white border border-border rounded-xl p-4 flex items-center gap-3"
            >
              <div
                className={cn(
                  "w-9 h-9 rounded-lg bg-current/8 flex items-center justify-center border border-current/15",
                  stat.color
                )}
              >
                <stat.icon className={cn("w-4 h-4", stat.color)} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-text-muted uppercase tracking-wider font-bold">
                  {stat.label}
                </p>
                <p
                  className={cn(
                    "font-bold text-sm truncate",
                    stat.small ? "text-xs" : "",
                    stat.color === "text-[#10b981]" && kbStatus.geminiConfigured
                      ? "text-text-primary"
                      : stat.color
                  )}
                >
                  {stat.value}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-divider rounded-lg h-9 pl-9 pr-4 text-sm text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all placeholder:text-text-muted"
          />
        </div>

        {/* Category filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-3 h-9 rounded-lg text-[11px] font-bold uppercase tracking-wider whitespace-nowrap transition-all border",
                activeCategory === cat
                  ? "bg-accent text-white border-accent"
                  : "bg-white border-divider text-text-muted hover:border-accent/40 hover:text-text-primary"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Seed button */}
        <button
          onClick={handleSeedDefaultKnowledge}
          disabled={seeding}
          className="flex items-center gap-2 px-4 h-9 border border-[#6366f1]/30 hover:border-[#6366f1]/60 text-[#6366f1] hover:bg-[#6366f1]/5 rounded-lg text-[12px] font-bold uppercase tracking-wider transition-all shrink-0 disabled:opacity-50"
        >
          <Zap className="w-4 h-4" />
          Seed Default Knowledge
        </button>

        {/* Add button */}
        <button
          onClick={() => {
            setEditingDoc(null);
            setDrawerOpen(true);
          }}
          className="flex items-center gap-2 px-4 h-9 bg-accent hover:bg-accent-hover text-white rounded-lg text-[12px] font-bold uppercase tracking-wider transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add Document
        </button>
      </div>

      {/* Documents grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white border border-border rounded-xl p-5 animate-pulse">
              <div className="flex gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-gray-100 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 bg-gray-100 rounded w-3/4" />
                  <div className="h-2.5 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="h-5 w-20 bg-gray-100 rounded-full" />
                <div className="h-5 w-16 bg-gray-100 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {filtered.map((doc) => (
            <DocCard
              key={doc.id}
              doc={doc}
              onEdit={() => {
                setEditingDoc(doc);
                setDrawerOpen(true);
              }}
              onDelete={() => setDeleteTarget(doc)}
              onReEmbed={() => {
                setReEmbedTarget(doc);
                setEditingDoc(doc);
                setDrawerOpen(true);
              }}
            />
          ))}
        </motion.div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 gap-5">
          <div className="w-16 h-16 rounded-2xl bg-page-bg flex items-center justify-center border border-dashed border-divider">
            <Database className="w-7 h-7 text-text-muted" />
          </div>
          <div className="text-center">
            <h3 className="font-semibold text-text-primary mb-1">
              {searchQuery || activeCategory !== "All"
                ? "No documents found"
                : "Knowledge Base is Empty"}
            </h3>
            <p className="text-text-muted text-sm">
              {searchQuery || activeCategory !== "All"
                ? "Try a different search or category filter."
                : "Add your first document or seed system guides to start building your AI knowledge base."}
            </p>
          </div>
          {!searchQuery && activeCategory === "All" && (
            <div className="flex items-center gap-3">
              <button
                onClick={handleSeedDefaultKnowledge}
                disabled={seeding}
                className="flex items-center gap-2 px-5 py-2.5 border border-[#6366f1]/30 hover:border-[#6366f1]/60 text-[#6366f1] hover:bg-[#6366f1]/5 rounded-xl text-sm font-bold uppercase tracking-wider transition-all disabled:opacity-50"
              >
                <Zap className="w-4 h-4" />
                Seed Default Knowledge
              </button>
              <button
                onClick={() => {
                  setEditingDoc(null);
                  setDrawerOpen(true);
                }}
                className="flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-hover text-white rounded-xl text-sm font-bold uppercase tracking-wider transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add First Document
              </button>
            </div>
          )}
        </div>
      )}

      {/* Drawer */}
      <DocumentDrawer
        open={drawerOpen}
        doc={editingDoc}
        onClose={() => {
          setDrawerOpen(false);
          setEditingDoc(null);
          setReEmbedTarget(null);
        }}
        onSaved={loadData}
      />

      {/* Delete modal */}
      {deleteTarget && (
        <DeleteModal
          doc={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          deleting={deleting}
        />
      )}

      {/* Seeding Progress Modal Overlay */}
      <AnimatePresence>
        {seedingStatus !== "idle" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-md px-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94 }}
              className="bg-white/95 backdrop-blur-2xl border border-divider shadow-2xl p-8 rounded-2xl max-w-md w-full text-center relative overflow-hidden"
              style={{ boxShadow: "0 20px 50px rgba(0,0,0,0.3)" }}
            >
              {/* Background accent glow */}
              <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-accent/10 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-accent/10 blur-3xl pointer-events-none" />

              <div className="flex flex-col items-center gap-5">
                {/* Visual indicator */}
                {seedingStatus === "seeding" && (
                  <div className="relative w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center border border-accent/25">
                    <Loader2 className="w-8 h-8 text-accent animate-spin" />
                    <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-accent animate-pulse" />
                  </div>
                )}

                {seedingStatus === "success" && (
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
                    className="w-16 h-16 rounded-2xl bg-[#10b981]/15 flex items-center justify-center border border-[#10b981]/30"
                  >
                    <Check className="w-8 h-8 text-[#10b981]" />
                  </motion.div>
                )}

                {seedingStatus === "error" && (
                  <div className="w-16 h-16 rounded-2xl bg-danger/15 flex items-center justify-center border border-danger/30">
                    <AlertCircle className="w-8 h-8 text-danger" />
                  </div>
                )}

                <div>
                  <h3 className="font-bold text-text-primary text-base">
                    {seedingStatus === "seeding" && "Seeding Operational Knowledge"}
                    {seedingStatus === "success" && "Knowledge Base Seeded!"}
                    {seedingStatus === "error" && "Seeding Failed"}
                  </h3>
                  <p className="text-xs text-text-muted mt-1.5 uppercase font-bold tracking-widest text-accent">
                    Quantum Blaze AI Engine
                  </p>
                </div>

                <div className="bg-page-bg border border-divider rounded-xl px-4 py-3.5 w-full text-xs text-text-secondary font-medium min-h-[50px] flex items-center justify-center leading-relaxed">
                  {seedingStatus === "seeding" && seedingStep}
                  {seedingStatus === "success" && seedingStep}
                  {seedingStatus === "error" && seedingError}
                </div>

                {seedingStatus === "error" && (
                  <button
                    onClick={() => setSeedingStatus("idle")}
                    className="mt-2 w-full h-10 bg-accent hover:bg-accent-hover text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    Close
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
