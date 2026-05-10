"use client";

import { useParams } from "next/navigation";
import { EditorContent } from "@tiptap/react";
import { useDocumentEditor } from "@/hooks/useDocumentEditor";
import { EditorToolbar } from "@/components/dashboard/documents/EditorToolbar";
import { DocMetaSidebar } from "@/components/dashboard/documents/DocMetaSidebar";
import { MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

const MOCK_CONTENT = `
  <h1>Quantum Core System Specs</h1>
  <p>This document outlines the software requirements specification (SRS) for the initial deployment of the Quantum Core architecture within the enterprise logistics grid.</p>
  <h2>1. Architecture Overview</h2>
  <p>The system leverages a distributed node network, ensuring zero-latency data synchronization across global terminals. The following diagram illustrates the primary data flow.</p>
  <img src="https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=1000&auto=format&fit=crop" alt="System Diagram" />
  <h3>1.1 Compliance Requirements</h3>
  <ul>
    <li>Data encryption at rest using AES-256 standards.</li>
    <li>Multi-factor authentication mandatory for administrative access.</li>
    <li>Real-time audit logging for all configuration changes.</li>
  </ul>
`;

export default function DocumentEditorPage() {
  const { docId } = useParams();
  const { editor, lastSaved, wordCount, charCount } = useDocumentEditor(MOCK_CONTENT);

  return (
    <div className="h-screen flex flex-col bg-[#050505] overflow-hidden -m-8">
      {/* Top Toolbar */}
      <EditorToolbar editor={editor} lastSaved={lastSaved} version="V2" />

      <div className="flex-1 flex overflow-hidden">
        {/* Editor Canvas Area */}
        <div className="flex-1 overflow-y-auto bg-grid-slate-900/[0.04] p-12 custom-scrollbar relative">
          {/* Float Comment Marker */}
          <div className="absolute left-12 top-48">
            <button className="w-8 h-8 rounded-full bg-accent flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
              <MessageSquare className="w-4 h-4 text-[#050505]" />
            </button>
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="max-w-[760px] mx-auto bg-[#FAFAFA] min-h-[1000px] shadow-[0_40px_100px_rgba(0,0,0,0.6)] rounded-sm border border-white/10"
          >
            {editor && <EditorContent editor={editor} />}
          </motion.div>
        </div>

        {/* Right Sidebar */}
        <DocMetaSidebar
          docId={docId as string}
          prjId="PRJ-GOOG-26-001"
          author={{
            name: "Dr. Aris Thorne",
            avatar:
              "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop",
            role: "Lead Architect",
          }}
          stats={{ words: wordCount, chars: charCount }}
        />
      </div>
    </div>
  );
}
