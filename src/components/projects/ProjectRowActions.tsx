"use client";

import { useState, useRef, useEffect } from "react";
import { MoreHorizontal, Eye, Edit, Archive } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

interface ProjectRowActionsProps {
  projectId: string;
}

export function ProjectRowActions({ projectId }: ProjectRowActionsProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const actions = [
    { icon: Eye, label: "View", onClick: () => router.push(`/dashboard/projects/${projectId}`) },
    { icon: Edit, label: "Edit", onClick: () => console.log(`Edit ${projectId}`) },
    { icon: Archive, label: "Archive", onClick: () => console.log(`Archive ${projectId}`) },
  ];

  return (
    <div ref={ref} className="relative flex justify-end">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="p-1.5 rounded text-text-secondary hover:text-text-primary hover:bg-bg-card transition-colors"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.95 }}
            transition={{ duration: 0.12 }}
            className="absolute right-0 top-8 z-20 w-36 bg-bg-surface border border-border rounded-lg shadow-xl overflow-hidden"
          >
            {actions.map((action) => (
              <button
                key={action.label}
                onClick={() => {
                  action.onClick();
                  setOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-card transition-colors"
              >
                <action.icon className="w-3.5 h-3.5" />
                {action.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
