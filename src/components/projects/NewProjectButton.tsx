"use client";

import { Plus } from "lucide-react";
import { useModalStore } from "@/store/modalStore";

export function NewProjectButton() {
  const openModal = useModalStore((state) => state.openModal);

  return (
    <button
      onClick={() => openModal("newProject")}
      className="flex items-center gap-2 px-4 py-2 border border-accent/50 text-accent text-[11px] font-bold tracking-[0.1em] uppercase rounded-lg hover:bg-accent/10 hover:shadow-[0_0_12px_rgba(0,229,255,0.15)] transition-all"
    >
      <Plus className="w-4 h-4" />
      New Project
    </button>
  );
}
