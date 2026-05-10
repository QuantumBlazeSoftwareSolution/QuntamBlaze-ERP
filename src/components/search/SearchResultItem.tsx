import { FolderKanban, Users, Receipt, CheckSquare, UserPlus, CornerDownLeft } from "lucide-react";
import { SearchEntity } from "@/lib/searchIndex";
import { cn } from "@/lib/utils";

interface SearchResultItemProps {
  entity: SearchEntity;
  isSelected: boolean;
  onMouseEnter: () => void;
  onClick: () => void;
}

export function SearchResultItem({
  entity,
  isSelected,
  onMouseEnter,
  onClick,
}: SearchResultItemProps) {
  return (
    <div
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      className={cn(
        "flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all border-l-2",
        isSelected
          ? "bg-accent/5 border-accent shadow-[inset_1px_1px_0_rgba(0,229,255,0.05)]"
          : "bg-transparent border-transparent hover:bg-bg-surface"
      )}
    >
      <div className="flex items-center gap-4">
        {/* Entity Icon */}
        <div className="w-8 h-8 rounded bg-bg-surface border border-border flex items-center justify-center text-text-secondary shadow-[inset_1px_1px_0_rgba(255,255,255,0.02)]">
          <EntityIcon type={entity.type} className="w-4 h-4" />
        </div>

        {/* Entity Details */}
        <div className="flex flex-col">
          <div className="text-sm font-medium text-text-primary">{entity.name}</div>
          <div className="text-xs font-mono text-accent">{entity.id}</div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Status Chip */}
        {entity.status && (
          <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded border border-border bg-bg-surface text-[10px] font-bold tracking-[0.1em] text-text-secondary uppercase">
            <div className={`w-1.5 h-1.5 rounded-full ${getStatusColor(entity.status)}`} />
            {entity.status}
          </div>
        )}

        {/* Selected Label */}
        {isSelected && (
          <div className="hidden md:flex items-center gap-1 text-[10px] font-bold tracking-[0.1em] text-text-secondary uppercase bg-bg-surface px-1.5 py-0.5 rounded border border-border">
            <CornerDownLeft className="w-3 h-3" />
            Jump To
          </div>
        )}
      </div>
    </div>
  );
}

function EntityIcon({ type, className }: { type: string; className?: string }) {
  switch (type) {
    case "PROJECTS":
      return <FolderKanban className={className} />;
    case "CLIENTS":
      return <Users className={className} />;
    case "INVOICES":
      return <Receipt className={className} />;
    case "TASKS":
      return <CheckSquare className={className} />;
    case "LEADS":
      return <UserPlus className={className} />;
    default:
      return <FolderKanban className={className} />;
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case "ACTIVE":
    case "HOT":
    case "PAID":
    case "COMPLETED":
      return "bg-success";
    case "ON-HOLD":
    case "OVERDUE":
    case "BACKLOG":
      return "bg-danger";
    case "REVIEW":
    case "WARM":
    case "PENDING":
    case "IN-PROGRESS":
    case "PROCESSING":
      return "bg-warning";
    default:
      return "bg-text-secondary";
  }
}
