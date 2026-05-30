"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Send,
  Bot,
  User,
  BookOpen,
  AlertCircle,
  Database,
  ExternalLink,
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
  noResults?: boolean;
  isError?: boolean;
}

const WELCOME_MESSAGE: ChatMessage = {
  id: "welcome",
  sender: "ai",
  text: "Hello! I'm Quantum AI, your knowledge base assistant. Ask me anything about your company's processes, policies, or operations — I'll search the knowledge base and give you a grounded answer.",
};

export function AIAssistantChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [kbReady, setKbReady] = useState<{ geminiConfigured: boolean; chunkCount: number } | null>(
    null
  );
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    checkKnowledgeBaseReadyAction().then((res) => {
      setKbReady({ geminiConfigured: res.geminiConfigured, chunkCount: res.chunkCount });
    });
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    const question = input;
    setInput("");
    setIsTyping(true);

    try {
      const res = await askKnowledgeBaseAction(question);

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: res.success
          ? res.answer || "I couldn't generate a response."
          : res.error || "Something went wrong.",
        sources: res.success ? res.sources : undefined,
        noResults: res.noResults,
        isError: !res.success,
      };

      setMessages((prev) => [...prev, aiMsg]);
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
  };

  return (
    <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="px-5 py-4 border-b border-divider bg-page-bg flex items-center justify-between shrink-0">
        <h3 className="text-text-primary font-bold text-sm uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-accent" />
          Quantum AI Assistant
        </h3>
        <div className="flex items-center gap-2">
          {kbReady && (
            <span className="text-[10px] text-text-muted flex items-center gap-1">
              <Database className="w-3 h-3" />
              {kbReady.chunkCount} chunks
            </span>
          )}
          <div
            className={cn(
              "flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border",
              kbReady?.geminiConfigured
                ? "text-accent bg-accent/10 border-accent/20"
                : "text-text-muted bg-page-bg border-divider"
            )}
          >
            <div
              className={cn(
                "w-1.5 h-1.5 rounded-full",
                kbReady?.geminiConfigured ? "bg-accent animate-pulse" : "bg-text-muted"
              )}
            />
            {kbReady?.geminiConfigured ? "Online" : "Not Configured"}
          </div>
        </div>
      </div>

      {/* Not configured notice */}
      {kbReady && !kbReady.geminiConfigured && (
        <div className="mx-4 mt-4 p-3 bg-warning/5 border border-warning/20 rounded-xl flex items-start gap-2.5 text-xs text-warning shrink-0">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold mb-0.5">Gemini AI not configured</p>
            <p className="text-warning/80">
              Add your Gemini API key in{" "}
              <a href="/dashboard/settings" className="underline font-medium">
                Settings → Integrations
              </a>{" "}
              to enable Ask AI.
            </p>
          </div>
        </div>
      )}

      {/* No chunks notice */}
      {kbReady && kbReady.geminiConfigured && kbReady.chunkCount === 0 && (
        <div className="mx-4 mt-4 p-3 bg-accent/5 border border-accent/20 rounded-xl flex items-start gap-2.5 text-xs text-accent shrink-0">
          <BookOpen className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold mb-0.5">Knowledge Base is empty</p>
            <p className="text-accent/80">
              Add documents in{" "}
              <a href="/dashboard/knowledge-base" className="underline font-medium">
                Knowledge Base
              </a>{" "}
              to start getting AI answers.
            </p>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-4">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex gap-3 max-w-[90%]",
                msg.sender === "user" ? "ml-auto flex-row-reverse" : ""
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border",
                  msg.sender === "ai"
                    ? "bg-accent/10 text-accent border-accent/20"
                    : "bg-sidebar-bg text-white border-border"
                )}
              >
                {msg.sender === "ai" ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              <div className="space-y-1.5 flex-1 min-w-0">
                <div
                  className={cn(
                    "p-3 rounded-xl text-sm leading-relaxed shadow-sm",
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
                      paragraphClassName="text-sm text-text-secondary"
                    />
                  ) : (
                    msg.text
                  )}
                </div>

                {/* Source citations */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pl-1">
                    {msg.sources.map((src) => (
                      <a
                        key={src.documentId}
                        href="/dashboard/knowledge-base"
                        title={src.contentPreview}
                        className="flex items-center gap-1 px-2 py-0.5 bg-accent/8 text-accent border border-accent/20 rounded-full text-[10px] font-semibold hover:bg-accent/15 transition-colors"
                      >
                        <BookOpen className="w-2.5 h-2.5 shrink-0" />
                        <span className="truncate max-w-[120px]">{src.title}</span>
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
              className="flex gap-3 max-w-[85%]"
            >
              <div className="w-8 h-8 rounded-lg bg-accent/10 text-accent border border-accent/20 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-4 rounded-xl bg-page-bg border border-divider rounded-tl-sm flex items-center gap-1.5">
                {[0, 150, 300].map((delay) => (
                  <div
                    key={delay}
                    className="w-1.5 h-1.5 rounded-full bg-accent/60 animate-bounce"
                    style={{ animationDelay: `${delay}ms` }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-divider bg-white shrink-0">
        <form onSubmit={handleSend} className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              kbReady?.geminiConfigured
                ? "Ask anything from your knowledge base..."
                : "Configure Gemini API to enable Ask AI..."
            }
            disabled={!kbReady?.geminiConfigured || isTyping}
            className="w-full bg-page-bg border border-divider rounded-lg h-11 pl-4 pr-12 text-sm text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all placeholder:text-text-muted disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping || !kbReady?.geminiConfigured}
            className="absolute right-1.5 top-1.5 bottom-1.5 w-8 flex items-center justify-center rounded-md bg-accent text-white hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
