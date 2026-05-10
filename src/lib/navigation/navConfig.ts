import {
  LayoutDashboard,
  Users,
  Briefcase,
  FileText,
  CreditCard,
  Settings,
  Shield,
  Zap,
  BarChart3,
  MessageSquare,
} from "lucide-react";
import { NavSection } from "@/types/navigation";

export const NAV_CONFIG: NavSection[] = [
  {
    label: "Core",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "Operations", href: "/dashboard/operations", icon: Zap },
      { label: "Intelligence", href: "/dashboard/intelligence", icon: Shield },
    ],
  },
  {
    label: "CRM",
    items: [
      {
        label: "Leads",
        href: "/dashboard/leads",
        icon: MessageSquare,
        badge: { count: 8, color: "bg-accent/20", textColor: "text-accent" },
      },
      { label: "Clients", href: "/dashboard/clients", icon: Users },
    ],
  },
  {
    label: "Execution",
    items: [
      {
        label: "Projects",
        href: "/dashboard/projects",
        icon: Briefcase,
        badge: { count: 12, color: "bg-sidebar-border", textColor: "text-white" },
      },
      { label: "Documents", href: "/dashboard/documents", icon: FileText },
    ],
  },
  {
    label: "Finance",
    items: [
      {
        label: "Finance",
        href: "/dashboard/finance",
        icon: CreditCard,
        badge: { count: 4, color: "bg-danger", textColor: "text-white" },
      },
      { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    ],
  },
  {
    label: "Workforce",
    items: [
      {
        label: "HR",
        href: "/dashboard/hr",
        icon: Users,
        badge: { count: 3, color: "bg-[#10B981]/20", textColor: "text-[#10B981]" },
      },
    ],
  },
];
