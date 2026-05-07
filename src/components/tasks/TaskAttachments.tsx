"use client";

import { Paperclip, File, Download, X, Plus } from "lucide-react";
import { TaskAttachment } from "@/types/task";

interface TaskAttachmentsProps {
  attachments: TaskAttachment[];
}

export function TaskAttachments({ attachments }: TaskAttachmentsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-bold tracking-[0.1em] text-text-secondary uppercase flex items-center gap-2">
          Attachments
          <Paperclip className="w-3.5 h-3.5" />
        </label>
        <button className="text-text-secondary hover:text-text-primary transition-colors">
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {attachments.map((file) => (
          <div 
            key={file.id} 
            className="bg-[#0F0F0F] border border-[#1A1A1A] rounded-lg p-3 flex items-center gap-3 hover:border-[#252525] transition-all group relative"
          >
            <div className="w-8 h-8 rounded bg-[#1A1A1A] flex items-center justify-center text-accent">
              <File className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[12px] font-medium text-text-primary truncate">{file.name}</div>
              <div className="text-[10px] text-text-secondary">{file.size}</div>
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
              <button className="p-1.5 hover:bg-white/5 rounded-md text-text-secondary hover:text-text-primary transition-all">
                <Download className="w-3.5 h-3.5" />
              </button>
              <button className="p-1.5 hover:bg-white/5 rounded-md text-text-secondary hover:text-danger transition-all">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
