"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback } from "react";

export function useLeadSelection() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const selectedLeadId = searchParams.get("lead");

  const setSelectedLeadId = useCallback(
    (id: string) => {
      const params = new URLSearchParams(searchParams);
      if (id) {
        params.set("lead", id);
      } else {
        params.delete("lead");
      }
      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, router, pathname]
  );

  return { selectedLeadId, setSelectedLeadId };
}
