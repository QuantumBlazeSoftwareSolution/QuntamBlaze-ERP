"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { ProposalSection } from "@/types/proposal";
import { useEffect } from "react";

interface SectionEditorProps {
  section: ProposalSection;
  onContentChange: (id: string, content: string) => void;
}

function SectionEditor({ section, onContentChange }: SectionEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: `Define ${section.title.toLowerCase()}...`,
      }),
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
    ],
    content: section.content,
    onUpdate: ({ editor }) => {
      onContentChange(section.id, editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-invert max-w-none focus:outline-none min-h-[100px] text-[16px] text-[#8A8A8A] leading-[1.7]",
      },
    },
  });

  // Update editor content if it changes externally (e.g. from state)
  useEffect(() => {
    if (editor && section.content !== editor.getHTML()) {
      editor.commands.setContent(section.content);
    }
  }, [section.content, editor]);

  return (
    <div className="bg-bg-card/30 border border-border rounded-2xl p-10 hover:border-accent/30 transition-all group scroll-mt-32">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-medium text-text-primary group-hover:text-accent transition-colors">
          {section.title}
        </h2>
        <div className="w-10 h-10 rounded-lg bg-white/5 border border-border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-[10px] text-text-muted font-bold">Edit</span>
        </div>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}

interface ProposalEditorProps {
  sections: ProposalSection[];
  onSectionContentChange: (id: string, content: string) => void;
}

export function ProposalEditor({ sections, onSectionContentChange }: ProposalEditorProps) {
  return (
    <div className="flex-1 overflow-y-auto p-12 bg-[#050505] custom-scrollbar">
      <div className="max-w-[900px] mx-auto space-y-12 pb-32">
        {sections.map((section) => (
          <div key={section.id} id={section.id}>
            <SectionEditor section={section} onContentChange={onSectionContentChange} />
          </div>
        ))}
      </div>
    </div>
  );
}
