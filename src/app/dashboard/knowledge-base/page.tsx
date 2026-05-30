import { Suspense } from "react";
import { BookOpen, Sparkles } from "lucide-react";
import { KnowledgeBaseClient } from "@/components/dashboard/knowledge-base/KnowledgeBaseClient";

export const metadata = {
  title: "Knowledge Base | QuantumBlaze ERP",
  description:
    "Manage your AI-powered knowledge base. Add documents, embed them as vectors, and power the Ask AI assistant.",
};

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white border border-border rounded-xl p-4 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gray-100" />
              <div className="space-y-1.5 flex-1">
                <div className="h-2 bg-gray-100 rounded w-1/2" />
                <div className="h-3 bg-gray-100 rounded w-2/3" />
              </div>
            </div>
          </div>
        ))}
      </div>
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
    </div>
  );
}

export default function KnowledgeBasePage() {
  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center border border-accent/20">
              <BookOpen className="w-5 h-5 text-accent" />
            </div>
            <h1 className="text-4xl font-bold text-text-primary tracking-tight">Knowledge Base</h1>
          </div>
          <p className="text-text-secondary text-lg ml-[52px]">
            Add documents, embed them as AI vectors, and power the Ask AI assistant.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-accent/8 border border-accent/20 rounded-full">
          <Sparkles className="w-3.5 h-3.5 text-accent" />
          <span className="text-[11px] font-bold text-accent uppercase tracking-wider">
            RAG Powered
          </span>
        </div>
      </div>

      {/* Client component handles all interactivity */}
      <Suspense fallback={<LoadingSkeleton />}>
        <KnowledgeBaseClient />
      </Suspense>
    </div>
  );
}
