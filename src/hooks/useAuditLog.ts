import { useAuditStore } from "@/store/useAuditStore";

export function useAuditLog() {
  const { openAuditLog, closeAuditLog, isOpen, entityId } = useAuditStore();

  return {
    open: (id?: string) => openAuditLog(id),
    close: () => closeAuditLog(),
    isOpen,
    entityId,
  };
}
