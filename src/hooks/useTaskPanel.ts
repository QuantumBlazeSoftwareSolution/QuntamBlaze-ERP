"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";

export function useTaskPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const selectedTaskId = searchParams.get("task");

  const openTask = useCallback(
    (taskId: string) => {
      const params = new URLSearchParams(searchParams);
      params.set("task", taskId);
      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, router]
  );

  const closeTask = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    params.delete("task");
    router.push(`${pathname}?${params.toString()}`);
  }, [searchParams, pathname, router]);

  return {
    selectedTaskId,
    openTask,
    closeTask,
  };
}
