import { SearchEntity } from "@/lib/searchIndex";
import { SearchResultItem } from "./SearchResultItem";

interface SearchResultGroupProps {
  label: string;
  items: SearchEntity[];
  globalStartIndex: number;
  selectedIndex: number;
  onHover: (index: number) => void;
  onSelect: (index: number) => void;
}

export function SearchResultGroup({
  label,
  items,
  globalStartIndex,
  selectedIndex,
  onHover,
  onSelect,
}: SearchResultGroupProps) {
  if (items.length === 0) return null;

  return (
    <div className="mb-4 last:mb-0">
      <div className="text-[10px] font-bold tracking-[0.12em] text-[#3A3A3A] uppercase mb-2 px-3">
        {label}
      </div>
      <div className="space-y-1">
        {items.map((item, index) => {
          const globalIndex = globalStartIndex + index;
          return (
            <SearchResultItem
              key={item.id}
              entity={item}
              isSelected={selectedIndex === globalIndex}
              onMouseEnter={() => onHover(globalIndex)}
              onClick={() => onSelect(globalIndex)}
            />
          );
        })}
      </div>
    </div>
  );
}
