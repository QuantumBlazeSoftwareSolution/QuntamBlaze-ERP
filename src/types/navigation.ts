import { LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: {
    count: number;
    color: string;
    textColor: string;
  };
}

export interface NavSection {
  label: string;
  items: NavItem[];
}
