"use client";

import { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Table as TableIcon,
  Code,
  Image as ImageIcon,
  Save,
  Send,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface EditorToolbarProps {
  editor: Editor | null;
  lastSaved: string | null;
  version: string;
}

const ToolbarButton = ({
  onClick,
  active = false,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    className={cn(
      "p-2 rounded-lg transition-all",
      active
        ? "bg-accent/20 text-accent shadow-[0_0_10px_rgba(0,229,255,0.2)]"
        : "text-text-muted hover:bg-white/5 hover:text-text-primary"
    )}
  >
    {children}
  </button>
);

export function EditorToolbar({ editor, lastSaved, version }: EditorToolbarProps) {
  if (!editor) return null;

  return (
    <div className="h-16 bg-[#0A0A0A] border-b border-border flex items-center justify-between px-8 sticky top-0 z-50">
      <div className="flex items-center gap-1">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive("heading", { level: 1 })}
        >
          <Heading1 className="w-5 h-5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive("heading", { level: 2 })}
        >
          <Heading2 className="w-5 h-5" />
        </ToolbarButton>
        <div className="w-px h-6 bg-border mx-2" />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
        >
          <Bold className="w-5 h-5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
        >
          <Italic className="w-5 h-5" />
        </ToolbarButton>
        <div className="w-px h-6 bg-border mx-2" />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
        >
          <List className="w-5 h-5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
        >
          <ListOrdered className="w-5 h-5" />
        </ToolbarButton>
        <div className="w-px h-6 bg-border mx-2" />
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
          }
        >
          <TableIcon className="w-5 h-5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive("codeBlock")}
        >
          <Code className="w-5 h-5" />
        </ToolbarButton>
        <ToolbarButton onClick={() => {}}>
          <ImageIcon className="w-5 h-5" />
        </ToolbarButton>
      </div>

      <div className="flex items-center gap-6">
        {lastSaved && (
          <span className="text-[11px] font-medium text-text-muted italic">
            Auto-saved · {lastSaved}
          </span>
        )}
        <div className="px-2 py-1 bg-white/5 border border-border rounded text-[10px] font-bold text-text-muted hover:text-accent cursor-pointer transition-colors">
          {version}
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-[13px] font-bold text-text-muted hover:text-text-primary transition-colors">
            <Save className="w-4 h-4" />
            Save
          </button>
          <button className="flex items-center gap-2 px-6 py-2.5 bg-accent/10 border border-accent/30 text-accent font-bold text-[13px] rounded-lg hover:bg-accent/20 transition-all">
            <Send className="w-4 h-4" />
            Send for Review
          </button>
        </div>
      </div>
    </div>
  );
}
