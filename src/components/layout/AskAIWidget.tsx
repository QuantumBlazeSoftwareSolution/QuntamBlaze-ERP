"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  BookOpen,
  AlertCircle,
  Minimize2,
  Database,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  askKnowledgeBaseAction,
  checkKnowledgeBaseReadyAction,
} from "@/app/actions/knowledgeBaseActions";
import { MarkdownRenderer } from "@/components/ui/MarkdownRenderer";

interface Source {
  documentId: string;
  title: string;
  contentPreview: string;
  similarity: number;
}

interface ChatMessage {
  id: string;
  sender: "ai" | "user";
  text: string;
  sources?: Source[];
  isError?: boolean;
}

const WELCOME: ChatMessage = {
  id: "welcome",
  sender: "ai",
  text: "Hi! I'm Quantum AI. Ask me anything — I'll search your knowledge base and give you a grounded answer.",
};

export function AskAIWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [kbStatus, setKbStatus] = useState<{
    geminiConfigured: boolean;
    chunkCount: number;
  } | null>(null);

  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Load KB status on first open
  useEffect(() => {
    if (open && !kbStatus) {
      checkKnowledgeBaseReadyAction().then((res) => {
        setKbStatus({ geminiConfigured: res.geminiConfigured, chunkCount: res.chunkCount });
      });
    }
  }, [open, kbStatus]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (open) {
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 60);
    }
  }, [messages, isTyping, open]);

  // Focus input when opened
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 200);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  // Click outside to close
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleSend = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!input.trim() || isTyping) return;

      const userMsg: ChatMessage = { id: Date.now().toString(), sender: "user", text: input };
      setMessages((prev) => [...prev, userMsg]);
      const question = input;
      setInput("");
      setIsTyping(true);

      try {
        const res = await askKnowledgeBaseAction(question);
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: "ai",
            text: res.success
              ? res.answer || "I couldn't generate a response."
              : res.error || "Something went wrong.",
            sources: res.success ? res.sources : undefined,
            isError: !res.success,
          },
        ]);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: "ai",
            text: "An unexpected error occurred. Please try again.",
            isError: true,
          },
        ]);
      } finally {
        setIsTyping(false);
      }
    },
    [input, isTyping]
  );

  return (
    <div className="fixed bottom-6 right-6 z-[500] flex flex-col items-end gap-3" ref={panelRef}>
      {/* Chat Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            className="w-[380px] max-h-[560px] bg-white/95 backdrop-blur-xl border border-divider rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            style={{
              boxShadow: "0 8px 40px rgba(0,0,0,0.15), 0 0 0 1px rgba(var(--color-accent)/0.1)",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-divider bg-gradient-to-r from-accent/8 to-transparent shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-accent/15 flex items-center justify-center border border-accent/25">
                  <Sparkles className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <p className="text-[12px] font-bold text-text-primary">Quantum AI</p>
                  <p className="text-[10px] text-text-muted flex items-center gap-1">
                    <Database className="w-2.5 h-2.5" />
                    {kbStatus
                      ? kbStatus.chunkCount > 0
                        ? `${kbStatus.chunkCount} knowledge chunks`
                        : "Knowledge Base empty"
                      : "Loading..."}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <div
                  className={cn(
                    "w-1.5 h-1.5 rounded-full mr-1",
                    kbStatus?.geminiConfigured ? "bg-[#10b981] animate-pulse" : "bg-text-muted"
                  )}
                />
                <button
                  onClick={() => setOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-divider text-text-muted hover:text-text-primary transition-colors"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Status notices */}
            {kbStatus && !kbStatus.geminiConfigured && (
              <div className="mx-3 mt-3 p-2.5 bg-warning/5 border border-warning/20 rounded-xl flex items-start gap-2 text-[11px] text-warning shrink-0">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>
                  Gemini API not configured.{" "}
                  <a href="/dashboard/settings" className="underline font-semibold">
                    Configure in Settings
                  </a>
                </span>
              </div>
            )}
            {kbStatus?.geminiConfigured && kbStatus.chunkCount === 0 && (
              <div className="mx-3 mt-3 p-2.5 bg-accent/5 border border-accent/20 rounded-xl flex items-start gap-2 text-[11px] text-accent shrink-0">
                <BookOpen className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>
                  Knowledge Base is empty.{" "}
                  <a href="/dashboard/knowledge-base" className="underline font-semibold">
                    Add documents
                  </a>{" "}
                  to start.
                </span>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3 min-h-0">
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn("flex gap-2.5", msg.sender === "user" ? "flex-row-reverse" : "")}
                  >
                    <div
                      className={cn(
                        "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border",
                        msg.sender === "ai"
                          ? "bg-accent/10 text-accent border-accent/20"
                          : "bg-sidebar-bg text-white border-border"
                      )}
                    >
                      {msg.sender === "ai" ? (
                        <Bot className="w-3.5 h-3.5" />
                      ) : (
                        <User className="w-3.5 h-3.5" />
                      )}
                    </div>

                    <div className="space-y-1 flex-1 min-w-0">
                      <div
                        className={cn(
                          "px-3 py-2 rounded-xl text-[12px] leading-relaxed",
                          msg.sender === "ai"
                            ? msg.isError
                              ? "bg-danger/5 border border-danger/20 text-danger rounded-tl-sm"
                              : "bg-page-bg border border-divider text-text-primary rounded-tl-sm"
                            : "bg-accent text-white rounded-tr-sm"
                        )}
                      >
                        {msg.sender === "ai" && !msg.isError ? (
                          <MarkdownRenderer
                            text={msg.text}
                            paragraphClassName="text-[12px] text-text-secondary"
                          />
                        ) : (
                          msg.text
                        )}
                      </div>

                      {/* Source citations */}
                      {msg.sources && msg.sources.length > 0 && (
                        <div className="flex flex-wrap gap-1 pl-0.5">
                          {msg.sources.map((src) => (
                            <a
                              key={src.documentId}
                              href="/dashboard/knowledge-base"
                              title={src.contentPreview}
                              className="flex items-center gap-1 px-1.5 py-0.5 bg-accent/8 text-accent border border-accent/20 rounded-full text-[9px] font-semibold hover:bg-accent/15 transition-colors"
                            >
                              <BookOpen className="w-2 h-2 shrink-0" />
                              <span className="truncate max-w-[90px]">{src.title}</span>
                              <span className="opacity-60">{src.similarity}%</span>
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}

                {isTyping && (
                  <motion.div
                    key="typing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex gap-2.5"
                  >
                    <div className="w-7 h-7 rounded-lg bg-accent/10 text-accent border border-accent/20 flex items-center justify-center shrink-0">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                    <div className="px-3 py-2.5 rounded-xl bg-page-bg border border-divider rounded-tl-sm flex items-center gap-1">
                      {[0, 120, 240].map((d) => (
                        <div
                          key={d}
                          className="w-1.5 h-1.5 rounded-full bg-accent/60 animate-bounce"
                          style={{ animationDelay: `${d}ms` }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-divider shrink-0">
              <form onSubmit={handleSend} className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    kbStatus?.geminiConfigured ? "Ask anything..." : "Configure Gemini first..."
                  }
                  disabled={!kbStatus?.geminiConfigured || isTyping}
                  className="w-full bg-page-bg border border-divider rounded-xl h-10 pl-3.5 pr-10 text-[12px] text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all placeholder:text-text-muted disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping || !kbStatus?.geminiConfigured}
                  className="absolute right-1 top-1 bottom-1 w-8 flex items-center justify-center rounded-lg bg-accent text-white hover:bg-accent-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Send className="w-3 h-3" />
                </button>
              </form>
              <p className="text-[9px] text-text-muted text-center mt-1.5">
                Powered by Gemini + pgvector · Press Esc to close
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating toggle button */}
      <motion.button
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all relative",
          open ? "bg-text-primary text-white" : "bg-accent hover:bg-accent-hover text-white"
        )}
        style={{
          boxShadow: open
            ? "0 4px 20px rgba(0,0,0,0.2)"
            : "0 4px 24px rgba(var(--color-accent)/0.4)",
        }}
        aria-label={open ? "Close Ask AI" : "Open Ask AI"}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div
              key="close"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              transition={{ duration: 0.15 }}
            >
              <X className="w-5 h-5" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ opacity: 0, rotate: 90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: -90 }}
              transition={{ duration: 0.15 }}
            >
              <Sparkles className="w-5 h-5" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pulse ring when closed */}
        {!open && (
          <span className="absolute inset-0 rounded-2xl animate-ping bg-accent opacity-20 pointer-events-none" />
        )}
      </motion.button>
    </div>
  );
}
