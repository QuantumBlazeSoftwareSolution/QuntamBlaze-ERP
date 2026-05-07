"use client";

import { useState } from "react";
import { Send, Clock } from "lucide-react";
import { TaskComment } from "@/types/task";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";

interface TaskActivityThreadProps {
  comments: TaskComment[];
  onPostComment: (text: string) => void;
}

export function TaskActivityThread({ comments, onPostComment }: TaskActivityThreadProps) {
  const [newComment, setNewComment] = useState("");

  const handlePost = () => {
    if (newComment.trim()) {
      onPostComment(newComment.trim());
      setNewComment("");
    }
  };

  return (
    <div className="space-y-6 pt-6 border-t border-[#1A1A1A]">
      <label className="text-[11px] font-bold tracking-[0.1em] text-text-secondary uppercase">Activity</label>

      {/* Feed */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-4">
            <div className={cn(
              "w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold border border-[#1A1A1A]",
              comment.userColor
            )}>
              {comment.userInitials}
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-text-primary">{comment.userName}</span>
                  <span className="text-[9px] font-mono text-text-secondary/40 tracking-wider uppercase">{comment.userId}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[9px] font-mono text-text-secondary/60">
                  <Clock className="w-3 h-3" />
                  {format(parseISO(comment.timestamp), "MMM dd, HH:mm")}
                </div>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed bg-[#0F0F0F]/30 p-3 rounded-lg border border-[#1A1A1A]/50">
                {comment.text}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* New Comment Input */}
      <div className="relative mt-8 group">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handlePost())}
          placeholder="Write a comment..."
          className="w-full bg-[#0F0F0F] border border-[#1A1A1A] rounded-xl px-4 py-3 pb-12 text-sm text-text-primary placeholder:text-text-secondary/20 focus:outline-none focus:border-accent transition-all resize-none min-h-[100px]"
        />
        <div className="absolute bottom-3 right-3 flex items-center gap-3">
          <span className="text-[9px] text-text-secondary/40 font-mono tracking-widest uppercase hidden group-focus-within:block">
            Shift + Enter for newline
          </span>
          <button
            onClick={handlePost}
            disabled={!newComment.trim()}
            className="p-2 bg-accent text-[#050505] rounded-lg disabled:opacity-30 disabled:grayscale transition-all shadow-lg shadow-accent/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
