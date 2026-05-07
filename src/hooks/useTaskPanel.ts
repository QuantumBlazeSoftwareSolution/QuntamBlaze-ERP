"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";

export function useTaskPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const activeTaskId = searchParams.get("task");

  const openTask = useCallback((taskId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("task", taskId);
    router.push(`${pathname}?${params.toString()}`);
  }, [router, pathname, searchParams]);

  const closeTask = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("task");
    router.push(`${pathname}?${params.toString()}`);
  }, [router, pathname, searchParams]);

  return {
    activeTaskId,
    openTask,
    closeTask,
    isOpen: !!activeTaskId,
  };
}
