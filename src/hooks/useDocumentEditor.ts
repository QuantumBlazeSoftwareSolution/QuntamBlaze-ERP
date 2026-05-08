"use client";

import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import Image from "@tiptap/extension-image";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import { useEffect, useState } from "react";
import { useDebounce } from "./useDebounce";

const lowlight = createLowlight(common);

export function useDocumentEditor(initialContent: string) {
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [content, setContent] = useState(initialContent);
  const debouncedContent = useDebounce(content, 1000);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
      Placeholder.configure({
        placeholder: "Start writing your document...",
      }),
      CharacterCount,
      Image,
      CodeBlockLowlight.configure({ lowlight }),
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-lg max-w-none focus:outline-none text-[#1A1A1A] p-12 min-h-[800px]",
      },
    },
  });

  // Auto-save logic
  useEffect(() => {
    if (debouncedContent) {
      const now = new Date();
      setLastSaved(now.toLocaleTimeString());
      // In a real app, send to API here
      console.log("Auto-saving document...");
    }
  }, [debouncedContent]);

  return {
    editor,
    lastSaved,
    wordCount: editor?.storage.characterCount.words() || 0,
    charCount: editor?.storage.characterCount.characters() || 0,
  };
}
