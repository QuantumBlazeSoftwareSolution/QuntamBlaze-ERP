"use client";

import { useSearchOverlay } from "@/hooks/useSearchOverlay";
import { SearchOverlay } from "@/components/search/SearchOverlay";

export function GlobalSearchOverlay() {
  const { isOpen, close } = useSearchOverlay();

  return <SearchOverlay isOpen={isOpen} onClose={close} />;
}
