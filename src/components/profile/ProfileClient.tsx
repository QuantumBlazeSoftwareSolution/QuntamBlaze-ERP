"use client";

import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Shield,
  Calendar,
  CheckSquare,
  AlertCircle,
  Plus,
  Trash2,
  Edit3,
  Check,
  X,
  ChevronDown,
  Filter,
  CheckCircle,
  ListTodo,
  TrendingUp,
  Clock,
  Briefcase,
  SlidersHorizontal,
  Loader2,
  GripVertical
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SessionData } from "@/lib/session";
import {
  createPersonalTaskAction,
  updatePersonalTaskAction,
  deletePersonalTaskAction,
  PersonalTaskData,
  ChecklistItem
} from "@/app/actions/personalTaskActions";

// dnd-kit imports
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SortableChecklistItemProps {
  id: string;
  item: ChecklistItem;
  onToggle: () => void;
}

function SortableChecklistItem({ id, item, onToggle }: SortableChecklistItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    zIndex: isDragging ? 50 : "auto",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center justify-between gap-3 px-4 py-3 hover:bg-page-bg/40 transition-colors select-none ${
        isDragging ? "bg-page-bg/30 cursor-grabbing shadow-sm" : ""
      }`}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Grab Handle */}
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab text-text-muted hover:text-text-secondary p-1 rounded hover:bg-page-bg/60 shrink-0 touch-none flex items-center justify-center"
          title="Drag to reorder"
        >
          <GripVertical className="w-3.5 h-3.5" />
        </div>

        {/* Checkbox & Text Wrapper */}
        <div
          onClick={onToggle}
          className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
        >
          <div
            className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
              item.completed
                ? "bg-indigo-500 border-indigo-600 text-white"
                : "bg-white border-border/80 text-transparent"
            }`}
          >
            <Check className="w-2.5 h-2.5 stroke-[3]" />
          </div>
          <span
            className={`text-xs truncate ${
              item.completed ? "line-through text-text-muted" : "text-text-primary"
            }`}
          >
            {item.text}
          </span>
        </div>
      </div>
    </div>
  );
}

interface ProfileClientProps {
  session: SessionData;
  initialTasks: any[];
}

export default function ProfileClient({ session, initialTasks }: ProfileClientProps) {
  const [tasks, setTasks] = useState<any[]>(initialTasks);

  // Configure sensors for drag & drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Load and apply sorted checklist orders from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("qb-checklist-order");
      if (stored) {
        const orderMap = JSON.parse(stored);
        
        setTasks((prevTasks) => {
          return prevTasks.map((task) => {
            const savedOrder = orderMap[task.id];
            if (savedOrder && Array.isArray(savedOrder) && task.checklist) {
              const checklist = [...task.checklist];
              checklist.sort((a, b) => {
                const idxA = savedOrder.indexOf(a.id);
                const idxB = savedOrder.indexOf(b.id);
                const posA = idxA === -1 ? 9999 : idxA;
                const posB = idxB === -1 ? 9999 : idxB;
                return posA - posB;
              });
              return { ...task, checklist };
            }
            return task;
          });
        });
      }
    } catch (err) {
      console.error("Failed to load checklist order from localStorage:", err);
    }
  }, []);

  // Handle checklist reordering via drag & drop
  const handleDragEnd = (taskId: string, event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const currentChecklist = [...(task.checklist as ChecklistItem[])];
    const oldIndex = currentChecklist.findIndex((item) => item.id === active.id);
    const newIndex = currentChecklist.findIndex((item) => item.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const newChecklist = arrayMove(currentChecklist, oldIndex, newIndex);

    // 1. Optimistically update local state
    setTasks(
      tasks.map((t) =>
        t.id === taskId ? { ...t, checklist: newChecklist } : t
      )
    );

    // 2. Persist new checklist order to localStorage mapping task ID -> checklist item ID array
    try {
      const stored = localStorage.getItem("qb-checklist-order") || "{}";
      const orderMap = JSON.parse(stored);
      orderMap[taskId] = newChecklist.map((item) => item.id);
      localStorage.setItem("qb-checklist-order", JSON.stringify(orderMap));
    } catch (err) {
      console.error("Failed to save checklist order to localStorage:", err);
    }
  };

  const [activeTab, setActiveTab] = useState<"All" | "Todo" | "In Progress" | "Completed">("All");
  const [priorityFilter, setPriorityFilter] = useState<"All" | "High" | "Medium" | "Low">("All");
  const [sortBy, setSortBy] = useState<"created" | "due" | "priority">("created");
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  
  // Loading states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionTaskId, setActionTaskId] = useState<string | null>(null);

  // New task form state
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newPriority, setNewPriority] = useState<"Low" | "Medium" | "High">("Medium");
  const [newStatus, setNewStatus] = useState<"Todo" | "In Progress" | "Completed">("Todo");
  const [newDueDate, setNewDueDate] = useState("");
  const [newChecklist, setNewChecklist] = useState<ChecklistItem[]>([]);
  const [checklistInput, setChecklistInput] = useState("");

  // Edit task form state
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPriority, setEditPriority] = useState<"Low" | "Medium" | "High">("Medium");
  const [editStatus, setEditStatus] = useState<"Todo" | "In Progress" | "Completed">("Todo");
  const [editDueDate, setEditDueDate] = useState("");
  const [editChecklist, setEditChecklist] = useState<ChecklistItem[]>([]);

  // Get user initials for avatar
  const getInitials = (name: string) => {
    if (!name) return "AM";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const displayName = session?.name || "Anonymous User";
  const displayEmail = session?.email || "user@company.com";
  const displayId = session?.userId || "USR-26-001";
  const displayRole = session?.roleName || "Standard User";
  const displayRoleColor = session?.roleColor || "#10B981";
  const initials = getInitials(displayName);

  // ─── Task Math ─────────────────────────────────────────────────────────────
  const totalTasksCount = tasks.length;
  const completedTasksCount = tasks.filter((t) => t.status === "Completed").length;
  const pendingTasksCount = totalTasksCount - completedTasksCount;
  const completionPercentage = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

  // ─── Filter & Sort Logic ───────────────────────────────────────────────────
  const filteredTasks = tasks.filter((task) => {
    // 1. Tab Status Filter
    const matchesTab = activeTab === "All" ? true : task.status === activeTab;
    // 2. Priority Filter
    const matchesPriority = priorityFilter === "All" ? true : task.priority === priorityFilter;
    return matchesTab && matchesPriority;
  });

  const priorityWeights = { High: 3, Medium: 2, Low: 1 };
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === "created") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (sortBy === "due") {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    if (sortBy === "priority") {
      const wA = priorityWeights[a.priority as keyof typeof priorityWeights] || 0;
      const wB = priorityWeights[b.priority as keyof typeof priorityWeights] || 0;
      return wB - wA;
    }
    return 0;
  });

  // ─── Checklists Helpers ─────────────────────────────────────────────────────
  const addChecklistItem = () => {
    if (!checklistInput.trim()) return;
    const newItem: ChecklistItem = {
      id: Math.random().toString(36).substring(2, 9),
      text: checklistInput.trim(),
      completed: false,
    };
    setNewChecklist([...newChecklist, newItem]);
    setChecklistInput("");
  };

  const removeChecklistItem = (id: string) => {
    setNewChecklist(newChecklist.filter((item) => item.id !== id));
  };

  const addEditChecklistItem = () => {
    if (!checklistInput.trim()) return;
    const newItem: ChecklistItem = {
      id: Math.random().toString(36).substring(2, 9),
      text: checklistInput.trim(),
      completed: false,
    };
    setEditChecklist([...editChecklist, newItem]);
    setChecklistInput("");
  };

  const removeEditChecklistItem = (id: string) => {
    setEditChecklist(editChecklist.filter((item) => item.id !== id));
  };

  // ─── Server Action Invocations ─────────────────────────────────────────────
  
  // Toggle a single checklist item in the list directly
  const handleToggleChecklist = async (taskId: string, itemId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const updatedChecklist = (task.checklist as ChecklistItem[]).map((item) =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );

    // Optimistic UI Update
    setTasks(tasks.map((t) => (t.id === taskId ? { ...t, checklist: updatedChecklist } : t)));

    try {
      await updatePersonalTaskAction(taskId, { checklist: updatedChecklist });
    } catch (err) {
      console.error("Failed to update checklist item:", err);
      // Revert optimistic update on failure
      const revertedChecklist = (task.checklist as ChecklistItem[]).map((item) =>
        item.id === itemId ? { ...item, completed: item.completed } : item
      );
      setTasks(tasks.map((t) => (t.id === taskId ? { ...t, checklist: revertedChecklist } : t)));
    }
  };

  // Change task status directly from dropdown
  const handleStatusChange = async (taskId: string, newStatus: "Todo" | "In Progress" | "Completed") => {
    setActionTaskId(taskId);
    try {
      const res = await updatePersonalTaskAction(taskId, { status: newStatus });
      if (res.success) {
        setTasks(tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)));
      }
    } catch (err) {
      console.error("Failed to update task status:", err);
    } finally {
      setActionTaskId(null);
    }
  };

  // Handle new task submission
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setIsSubmitting(true);
    const data: PersonalTaskData = {
      title: newTitle.trim(),
      description: newDescription.trim() || null,
      priority: newPriority,
      status: newStatus,
      dueDate: newDueDate || null,
      checklist: newChecklist,
    };

    try {
      const res = await createPersonalTaskAction(data);
      if (res.success && res.taskId) {
        // Append newly created task locally
        const newTask = {
          id: res.taskId,
          userId: session.userId,
          title: data.title,
          description: data.description,
          priority: data.priority,
          status: data.status,
          dueDate: data.dueDate ? new Date(data.dueDate) : null,
          checklist: data.checklist,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        setTasks([newTask, ...tasks]);

        // Persist initial checklist order to localStorage for new task
        try {
          const stored = localStorage.getItem("qb-checklist-order") || "{}";
          const orderMap = JSON.parse(stored);
          orderMap[res.taskId] = data.checklist.map((item) => item.id);
          localStorage.setItem("qb-checklist-order", JSON.stringify(orderMap));
        } catch (err) {
          console.error("Failed to save initial checklist order to localStorage:", err);
        }
        
        // Reset form
        setNewTitle("");
        setNewDescription("");
        setNewPriority("Medium");
        setNewStatus("Todo");
        setNewDueDate("");
        setNewChecklist([]);
        setShowAddModal(false);
      }
    } catch (err) {
      console.error("Failed to create personal task:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Pre-load edit task modal
  const openEditModal = (task: any) => {
    setSelectedTask(task);
    setEditTitle(task.title);
    setEditDescription(task.description || "");
    setEditPriority(task.priority);
    setEditStatus(task.status);
    setEditDueDate(task.dueDate ? new Date(task.dueDate).toISOString().substring(0, 10) : "");
    setEditChecklist(task.checklist || []);
    setShowEditModal(true);
  };

  // Handle edit task submission
  const handleEditTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask || !editTitle.trim()) return;

    setIsSubmitting(true);
    const data: Partial<PersonalTaskData> = {
      title: editTitle.trim(),
      description: editDescription.trim() || null,
      priority: editPriority,
      status: editStatus,
      dueDate: editDueDate || null,
      checklist: editChecklist,
    };

    try {
      const res = await updatePersonalTaskAction(selectedTask.id, data);
      if (res.success) {
        setTasks(
          tasks.map((t) =>
            t.id === selectedTask.id
              ? {
                  ...t,
                  title: data.title!,
                  description: data.description || null,
                  priority: data.priority!,
                  status: data.status!,
                  dueDate: data.dueDate ? new Date(data.dueDate) : null,
                  checklist: data.checklist!,
                  updatedAt: new Date(),
                }
              : t
          )
        );
        setShowEditModal(false);
        setSelectedTask(null);
      }
    } catch (err) {
      console.error("Failed to edit task:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle task deletion
  const handleDeleteTask = async (taskId: string) => {
    if (!confirm("Are you sure you want to permanently delete this personal task?")) return;
    setActionTaskId(taskId);

    try {
      const res = await deletePersonalTaskAction(taskId);
      if (res.success) {
        setTasks(tasks.filter((t) => t.id !== taskId));
        if (expandedTaskId === taskId) setExpandedTaskId(null);

        // Clean up checklist order from localStorage
        try {
          const stored = localStorage.getItem("qb-checklist-order");
          if (stored) {
            const orderMap = JSON.parse(stored);
            delete orderMap[taskId];
            localStorage.setItem("qb-checklist-order", JSON.stringify(orderMap));
          }
        } catch (err) {
          console.error("Failed to clean up localStorage checklist order:", err);
        }
      }
    } catch (err) {
      console.error("Failed to delete task:", err);
    } finally {
      setActionTaskId(null);
    }
  };

  // Format date helper
  const formatDate = (dateStr: any) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  // Style priority badges helper
  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-rose-500/10 text-rose-500 border border-rose-500/20";
      case "Medium":
        return "bg-amber-500/10 text-amber-500 border border-amber-500/20";
      case "Low":
      default:
        return "bg-sky-500/10 text-sky-500 border border-sky-500/20";
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16 font-sans">
      {/* ─── Profile Glass Card ────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl bg-white border border-border/80 shadow-lg p-8 flex flex-col md:flex-row gap-8 items-center">
        {/* Dynamic decorative backdrop gradient */}
        <div
          className="absolute -right-24 -top-24 w-96 h-96 rounded-full blur-3xl opacity-15 pointer-events-none"
          style={{ backgroundColor: displayRoleColor }}
        />

        {/* Large Initials Avatar */}
        <div
          className="w-24 h-24 rounded-2xl flex items-center justify-center text-3xl font-black relative overflow-hidden shadow-inner shrink-0 border"
          style={{
            backgroundColor: `${displayRoleColor}15`,
            borderColor: `${displayRoleColor}30`,
            color: displayRoleColor,
          }}
        >
          <span>{initials}</span>
        </div>

        {/* Profile details */}
        <div className="flex-1 text-center md:text-left space-y-3">
          <div className="flex flex-col md:flex-row md:items-center gap-3 justify-center md:justify-start">
            <h1 className="text-2xl md:text-3xl font-extrabold text-text-primary tracking-tight font-outfit">
              {displayName}
            </h1>
            
            {/* Dynamic Role Pill */}
            <div className="flex items-center justify-center gap-1.5 self-center">
              <span
                className="w-2.5 h-2.5 rounded-full animate-pulse"
                style={{ backgroundColor: displayRoleColor }}
              />
              <span
                className="text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-full font-mono border"
                style={{
                  backgroundColor: `${displayRoleColor}10`,
                  borderColor: `${displayRoleColor}20`,
                  color: displayRoleColor,
                }}
              >
                {displayRole}
              </span>
            </div>
          </div>

          <p className="text-xs font-mono text-text-muted select-all uppercase tracking-wide">
            ID: {displayId}
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-y-2 gap-x-6 pt-1 text-sm text-text-secondary">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-text-muted" />
              <span>{displayEmail}</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-text-muted" />
              <span>Authorized Portal Account</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Task Statistics ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div className="bg-white border border-border/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
            <ListTodo className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-text-muted font-bold uppercase tracking-wider">Total Tasks</p>
            <p className="text-2xl font-black text-text-primary mt-1 font-outfit">{totalTasksCount}</p>
          </div>
        </div>

        <div className="bg-white border border-border/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-text-muted font-bold uppercase tracking-wider">Pending Tasks</p>
            <p className="text-2xl font-black text-text-primary mt-1 font-outfit">{pendingTasksCount}</p>
          </div>
        </div>

        <div className="bg-white border border-border/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-text-muted font-bold uppercase tracking-wider">Completed</p>
            <p className="text-2xl font-black text-text-primary mt-1 font-outfit">{completedTasksCount}</p>
          </div>
        </div>

        <div className="bg-white border border-border/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-text-muted font-bold uppercase tracking-wider">Productivity Rate</span>
            <span className="text-xs font-extrabold text-emerald-500">{completionPercentage}%</span>
          </div>
          {/* Custom sleek progress bar */}
          <div className="w-full h-2.5 bg-page-bg rounded-full overflow-hidden mt-3">
            <div
              className="h-full bg-emerald-500 transition-all duration-500 rounded-full"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <p className="text-[10px] text-text-muted mt-2 leading-none">Overall completed checklist ratio</p>
        </div>
      </div>

      {/* ─── Personal Task Management Board ───────────────────────────────── */}
      <div className="bg-white border border-border/85 rounded-3xl p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-divider pb-5">
          <div>
            <h2 className="text-xl font-bold text-text-primary font-outfit flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-accent" />
              <span>Personal Action Center</span>
            </h2>
            <p className="text-xs text-text-muted mt-1">Manage private checklists, daily tasks, and agenda items safely</p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-accent hover:bg-accent-hover transition-colors rounded-xl shadow-md cursor-pointer border-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Task</span>
          </button>
        </div>

        {/* Task Filtering / Sorting Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-page-bg/40 p-4 rounded-2xl border border-border/50 text-xs">
          {/* Status tabs */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-border/80">
            {["All", "Todo", "In Progress", "Completed"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all border-0 cursor-pointer text-xs ${
                  activeTab === tab
                    ? "bg-text-primary text-white"
                    : "text-text-secondary hover:text-text-primary hover:bg-page-bg"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Priority Filter */}
            <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-xl border border-border/80">
              <Filter className="w-3.5 h-3.5 text-text-muted" />
              <span className="text-text-muted mr-1">Priority:</span>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value as any)}
                className="bg-transparent border-0 font-bold text-text-primary focus:outline-none cursor-pointer"
              >
                <option value="All">All Levels</option>
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-xl border border-border/80">
              <SlidersHorizontal className="w-3.5 h-3.5 text-text-muted" />
              <span className="text-text-muted mr-1">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent border-0 font-bold text-text-primary focus:outline-none cursor-pointer"
              >
                <option value="created">Recently Added</option>
                <option value="due">Due Dates</option>
                <option value="priority">Priority Weight</option>
              </select>
            </div>
          </div>
        </div>

        {/* Task Cards Grid/List */}
        <div className="space-y-4">
          {sortedTasks.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-border rounded-2xl bg-page-bg/10 flex flex-col items-center justify-center">
              <AlertCircle className="w-8 h-8 text-text-muted mb-2.5" />
              <p className="text-sm font-bold text-text-secondary">No personal tasks matched the filters</p>
              <p className="text-xs text-text-muted mt-1">Get started by creating a task or adjusting active criteria.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence initial={false}>
                {sortedTasks.map((task) => {
                  const items = (task.checklist as ChecklistItem[]) || [];
                  const doneCount = items.filter((item) => item.completed).length;
                  const checklistTotal = items.length;
                  const ratio = checklistTotal > 0 ? Math.round((doneCount / checklistTotal) * 100) : 0;
                  const isExpanded = expandedTaskId === task.id;

                  return (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className={`border rounded-2xl bg-white transition-all overflow-hidden ${
                        isExpanded ? "border-accent/30 shadow-md" : "border-border/80 hover:border-border-hover shadow-sm"
                      }`}
                    >
                      {/* Main Task Card Header */}
                      <div className="p-5 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                        {/* Title and Description */}
                        <div className="flex-1 flex gap-3.5 items-start">
                          <button
                            onClick={() => {
                              // Fast checklist item toggle if only 1 checklist item exists
                              if (checklistTotal === 0) {
                                handleStatusChange(task.id, task.status === "Completed" ? "Todo" : "Completed");
                              } else {
                                setExpandedTaskId(isExpanded ? null : task.id);
                              }
                            }}
                            className={`w-5 h-5 rounded-md mt-0.5 border flex items-center justify-center shrink-0 cursor-pointer transition-all ${
                              task.status === "Completed"
                                ? "bg-emerald-500 border-emerald-600 text-white"
                                : "bg-white border-border/80 text-transparent hover:border-text-primary"
                            }`}
                          >
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </button>

                          <div className="space-y-1">
                            <h3
                              onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}
                              className={`text-sm font-bold tracking-tight cursor-pointer font-outfit select-none ${
                                task.status === "Completed" ? "line-through text-text-muted" : "text-text-primary hover:text-accent"
                              }`}
                            >
                              {task.title}
                            </h3>
                            {task.description && (
                              <p className="text-xs text-text-secondary line-clamp-1 max-w-xl select-none">
                                {task.description}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Metadata Badges & Trigger Options */}
                        <div className="flex flex-wrap items-center gap-3 sm:shrink-0">
                          {/* Priority Badge */}
                          <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${getPriorityStyle(task.priority)}`}>
                            {task.priority}
                          </span>

                          {/* Due Date Indicator */}
                          {task.dueDate && (
                            <span className="flex items-center gap-1 bg-page-bg border border-border/60 text-text-secondary text-[10px] font-medium px-2 py-0.5 rounded font-mono">
                              <Calendar className="w-3 h-3 text-text-muted" />
                              <span>{formatDate(task.dueDate)}</span>
                            </span>
                          )}

                          {/* Checklist Ratio Progress Bar */}
                          {checklistTotal > 0 && (
                            <div
                              onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <span className="text-[10px] font-bold text-text-secondary bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded font-mono">
                                {doneCount}/{checklistTotal} Done
                              </span>
                              <div className="w-12 h-1.5 bg-page-bg rounded-full overflow-hidden hidden md:block">
                                <div
                                  className="h-full bg-indigo-500 rounded-full"
                                  style={{ width: `${ratio}%` }}
                                />
                              </div>
                            </div>
                          )}

                          {/* Inline Action Select */}
                          <select
                            value={task.status}
                            onChange={(e) => handleStatusChange(task.id, e.target.value as any)}
                            disabled={actionTaskId === task.id}
                            className="bg-page-bg hover:bg-border/40 text-text-secondary border border-border/80 text-[10px] font-bold rounded px-1.5 py-1 focus:outline-none cursor-pointer"
                          >
                            <option value="Todo">Todo</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                          </select>

                          {/* Expand Trigger Button */}
                          <button
                            onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}
                            className={`p-1.5 text-text-muted hover:text-text-primary rounded-lg hover:bg-page-bg transition-transform cursor-pointer border-0 bg-transparent ${
                              isExpanded ? "rotate-180" : ""
                            }`}
                          >
                            <ChevronDown className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Expanded Section (Checklists and Details) */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: "auto" }}
                            exit={{ height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="border-t border-divider bg-page-bg/15 overflow-hidden"
                          >
                            <div className="p-5 space-y-5">
                              {/* Task Long Description */}
                              {task.description && (
                                <div className="space-y-1.5">
                                  <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Description</h4>
                                  <p className="text-xs text-text-secondary bg-white p-3 border border-border/60 rounded-xl leading-relaxed whitespace-pre-line">
                                    {task.description}
                                  </p>
                                </div>
                              )}

                              {/* Checklist Items Interactive List */}
                              <div className="space-y-2">
                                <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-wider flex items-center gap-1">
                                  <span>Task Checklist</span>
                                  {checklistTotal > 0 && <span className="font-mono text-accent">({ratio}% Completed)</span>}
                                </h4>

                                {checklistTotal === 0 ? (
                                  <p className="text-xs text-text-muted italic bg-white p-3 border border-border/60 rounded-xl">
                                    No checklist items defined. You can edit this task to add sub-items.
                                  </p>
                                ) : (
                                  <DndContext
                                    sensors={sensors}
                                    collisionDetection={closestCenter}
                                    onDragEnd={(event) => handleDragEnd(task.id, event)}
                                  >
                                    <SortableContext
                                      items={items.map((item) => item.id)}
                                      strategy={verticalListSortingStrategy}
                                    >
                                      <div className="bg-white border border-border/60 rounded-xl divide-y divide-divider/40">
                                        {items.map((item) => (
                                          <SortableChecklistItem
                                            key={item.id}
                                            id={item.id}
                                            item={item}
                                            onToggle={() => handleToggleChecklist(task.id, item.id)}
                                          />
                                        ))}
                                      </div>
                                    </SortableContext>
                                  </DndContext>
                                )}
                              </div>

                              {/* Expanded Footer / Actions */}
                              <div className="flex items-center justify-between border-t border-divider/60 pt-4 text-[10px] text-text-muted">
                                <span className="font-mono">Created: {new Date(task.createdAt).toLocaleString()}</span>

                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => openEditModal(task)}
                                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border bg-white text-text-secondary hover:text-text-primary hover:bg-page-bg transition-colors font-bold cursor-pointer"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                    <span>Edit Task</span>
                                  </button>

                                  <button
                                    onClick={() => handleDeleteTask(task.id)}
                                    disabled={actionTaskId === task.id}
                                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-red-500/10 bg-white text-danger hover:bg-red-500/5 transition-colors font-bold cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span>Delete</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* ─── CREATE TASK OVERLAY MODAL ────────────────────────────────────── */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            {/* Dark glass backdrop backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-[#0F172A]/70 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-xl bg-white border border-border/80 rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[85vh]"
            >
              <div className="px-6 py-5 border-b border-divider bg-page-bg/10 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-text-primary font-outfit text-sm">Create New Personal Task</h3>
                  <p className="text-[10px] text-text-muted mt-0.5">Define checklists, set schedules, and flag priority weights</p>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1 text-text-muted hover:text-text-primary hover:bg-page-bg rounded-lg border-0 bg-transparent cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Content scrollable */}
              <form onSubmit={handleCreateTask} className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">Task Title *</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Complete PM roadmap review"
                    className="w-full px-3 py-2 border border-border rounded-xl text-xs text-text-primary bg-white focus:outline-none focus:border-accent"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">Description</label>
                  <textarea
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Provide additional details or goals..."
                    rows={3}
                    className="w-full px-3 py-2 border border-border rounded-xl text-xs text-text-primary bg-white focus:outline-none focus:border-accent resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">Priority</label>
                    <select
                      value={newPriority}
                      onChange={(e) => setNewPriority(e.target.value as any)}
                      className="w-full px-3 py-2 border border-border rounded-xl text-xs text-text-primary bg-white focus:outline-none focus:border-accent cursor-pointer"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">Initial Status</label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as any)}
                      className="w-full px-3 py-2 border border-border rounded-xl text-xs text-text-primary bg-white focus:outline-none focus:border-accent cursor-pointer"
                    >
                      <option value="Todo">Todo</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">Due Date</label>
                    <input
                      type="date"
                      value={newDueDate}
                      onChange={(e) => setNewDueDate(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-xl text-xs text-text-primary bg-white focus:outline-none focus:border-accent cursor-pointer font-mono"
                    />
                  </div>
                </div>

                {/* Checklist Creator Panel */}
                <div className="space-y-3 border-t border-divider/60 pt-4">
                  <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider block">Add Checklist Items</label>
                  
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={checklistInput}
                      onChange={(e) => setChecklistInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addChecklistItem();
                        }
                      }}
                      placeholder="e.g. Schedule call with DevOps lead"
                      className="flex-1 px-3 py-2 border border-border rounded-xl text-xs text-text-primary bg-white focus:outline-none focus:border-accent"
                    />
                    <button
                      type="button"
                      onClick={addChecklistItem}
                      className="px-3.5 bg-page-bg border border-border hover:bg-border/40 text-text-primary hover:text-accent rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      Add
                    </button>
                  </div>

                  {/* Checklist current items in creation */}
                  {newChecklist.length > 0 && (
                    <div className="border border-border rounded-xl bg-page-bg/25 divide-y divide-divider/40">
                      {newChecklist.map((item) => (
                        <div key={item.id} className="flex items-center justify-between px-3 py-2 text-xs">
                          <span className="text-text-primary leading-tight">{item.text}</span>
                          <button
                            type="button"
                            onClick={() => removeChecklistItem(item.id)}
                            className="p-1 hover:bg-white text-danger hover:text-red-700 rounded-lg cursor-pointer border-0 bg-transparent"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions Footer inside Modal */}
                <div className="border-t border-divider pt-5 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 border border-border bg-white text-text-secondary hover:text-text-primary hover:bg-page-bg transition-colors rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !newTitle.trim()}
                    className="flex items-center gap-1 px-4 py-2 bg-accent hover:bg-accent-hover text-white transition-colors rounded-xl text-xs font-bold cursor-pointer shadow-md border-0"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Creating...</span>
                      </>
                    ) : (
                      <span>Save Task</span>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── EDIT TASK OVERLAY MODAL ──────────────────────────────────────── */}
      <AnimatePresence>
        {showEditModal && selectedTask && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            {/* Dark glass backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowEditModal(false);
                setSelectedTask(null);
              }}
              className="absolute inset-0 bg-[#0F172A]/70 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-xl bg-white border border-border/80 rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[85vh]"
            >
              <div className="px-6 py-5 border-b border-divider bg-page-bg/10 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-text-primary font-outfit text-sm">Edit Personal Task</h3>
                  <p className="text-[10px] text-text-muted mt-0.5">Task ID: {selectedTask.id}</p>
                </div>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedTask(null);
                  }}
                  className="p-1 text-text-muted hover:text-text-primary hover:bg-page-bg rounded-lg border-0 bg-transparent cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Content scrollable */}
              <form onSubmit={handleEditTask} className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">Task Title *</label>
                  <input
                    type="text"
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="Task Title..."
                    className="w-full px-3 py-2 border border-border rounded-xl text-xs text-text-primary bg-white focus:outline-none focus:border-accent"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">Description</label>
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    placeholder="Provide additional details or goals..."
                    rows={3}
                    className="w-full px-3 py-2 border border-border rounded-xl text-xs text-text-primary bg-white focus:outline-none focus:border-accent resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">Priority</label>
                    <select
                      value={editPriority}
                      onChange={(e) => setEditPriority(e.target.value as any)}
                      className="w-full px-3 py-2 border border-border rounded-xl text-xs text-text-primary bg-white focus:outline-none focus:border-accent cursor-pointer"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">Status</label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value as any)}
                      className="w-full px-3 py-2 border border-border rounded-xl text-xs text-text-primary bg-white focus:outline-none focus:border-accent cursor-pointer"
                    >
                      <option value="Todo">Todo</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">Due Date</label>
                    <input
                      type="date"
                      value={editDueDate}
                      onChange={(e) => setEditDueDate(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-xl text-xs text-text-primary bg-white focus:outline-none focus:border-accent cursor-pointer font-mono"
                    />
                  </div>
                </div>

                {/* Checklist Creator Panel */}
                <div className="space-y-3 border-t border-divider/60 pt-4">
                  <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider block">Add Checklist Items</label>
                  
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={checklistInput}
                      onChange={(e) => setChecklistInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addEditChecklistItem();
                        }
                      }}
                      placeholder="e.g. Schedule call with DevOps lead"
                      className="flex-1 px-3 py-2 border border-border rounded-xl text-xs text-text-primary bg-white focus:outline-none focus:border-accent"
                    />
                    <button
                      type="button"
                      onClick={addEditChecklistItem}
                      className="px-3.5 bg-page-bg border border-border hover:bg-border/40 text-text-primary hover:text-accent rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      Add
                    </button>
                  </div>

                  {/* Checklist current items in editing */}
                  {editChecklist.length > 0 && (
                    <div className="border border-border rounded-xl bg-page-bg/25 divide-y divide-divider/40">
                      {editChecklist.map((item) => (
                        <div key={item.id} className="flex items-center justify-between px-3 py-2 text-xs">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setEditChecklist(
                                  editChecklist.map((c) => (c.id === item.id ? { ...c, completed: !c.completed } : c))
                                );
                              }}
                              className={`w-3.5 h-3.5 border rounded flex items-center justify-center cursor-pointer transition-colors border-border/80 ${
                                item.completed ? "bg-indigo-500 border-indigo-600 text-white" : "bg-white text-transparent"
                              }`}
                            >
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                            </button>
                            <span className={`text-text-primary leading-tight ${item.completed ? "line-through text-text-muted" : ""}`}>
                              {item.text}
                            </span>
                          </div>
                          
                          <button
                            type="button"
                            onClick={() => removeEditChecklistItem(item.id)}
                            className="p-1 hover:bg-white text-danger hover:text-red-700 rounded-lg cursor-pointer border-0 bg-transparent"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions Footer inside Modal */}
                <div className="border-t border-divider pt-5 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setSelectedTask(null);
                    }}
                    className="px-4 py-2 border border-border bg-white text-text-secondary hover:text-text-primary hover:bg-page-bg transition-colors rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !editTitle.trim()}
                    className="flex items-center gap-1 px-4 py-2 bg-accent hover:bg-accent-hover text-white transition-colors rounded-xl text-xs font-bold cursor-pointer shadow-md border-0"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <span>Save Changes</span>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
