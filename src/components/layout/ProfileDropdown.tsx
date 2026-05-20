"use client";

import React, { useState, useEffect, useRef } from "react";
import { User, LogOut, ShieldCheck, ChevronDown, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getCurrentSessionAction, signOutAction } from "@/app/actions/auth";
import { useRouter } from "next/navigation";
import { SessionData } from "@/lib/session";

export function ProfileDropdown() {
  const [session, setSession] = useState<SessionData | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Load actual active session details on mount
  useEffect(() => {
    async function loadSession() {
      try {
        const activeSession = await getCurrentSessionAction();
        if (activeSession) {
          setSession(activeSession);
        }
      } catch (error) {
        console.error("[QB-PROFILE] Failed to load session in Dropdown:", error);
      }
    }
    loadSession();
  }, []);

  // Handle click outside to close the dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle logout
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const response = await signOutAction();
      if (response.success) {
        router.push("/login");
      }
    } catch (error) {
      console.error("[QB-PROFILE] Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Get user initials for the avatar placeholder
  const getInitials = (name: string) => {
    if (!name) return "AM";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const displayName = session ? session.name : "Alex Mercer";
  const displayId = session ? session.userId : "USR-AM-26-001";
  const displayRole = session ? session.roleName : "Admin";
  const displayRoleColor = session ? session.roleColor : "#10B981";
  const initials = getInitials(displayName);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-2 group cursor-pointer border-0 bg-transparent text-left focus:outline-none"
      >
        {/* Avatar Circle */}
        <div
          className="w-8 h-8 rounded-full border flex items-center justify-center text-xs font-bold transition-all relative overflow-hidden shrink-0"
          style={{
            backgroundColor: `${displayRoleColor}15`,
            borderColor: `${displayRoleColor}30`,
            color: displayRoleColor,
          }}
        >
          <span>{initials}</span>
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all" />
        </div>
        
        <div className="text-left hidden sm:block">
          <p className="text-xs font-bold text-text-primary leading-tight font-outfit group-hover:text-accent transition-colors flex items-center gap-1">
            <span>{displayName}</span>
            <ChevronDown className="w-3.5 h-3.5 text-text-muted group-hover:text-text-primary transition-all shrink-0" />
          </p>
          <p className="text-[9px] font-mono text-text-muted uppercase tracking-tighter mt-0.5">
            {displayId}
          </p>
        </div>
      </button>

      {/* Dropdown Menu Container */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 mt-3 w-64 bg-white/95 backdrop-blur-md border border-border/80 rounded-xl shadow-xl py-2 z-50 origin-top-right overflow-hidden"
          >
            {/* Dropdown Header */}
            <div className="px-4 py-3 border-b border-divider bg-page-bg/30">
              <p className="text-xs text-text-secondary leading-none">Signed in as</p>
              <p className="text-sm font-bold text-text-primary truncate mt-1.5 font-outfit">
                {displayName}
              </p>
              <p className="text-xs text-text-muted truncate mt-0.5 font-mono">
                {session?.email || "alex@company.com"}
              </p>
              
              {/* Role Pill Badge */}
              <div className="flex items-center gap-1.5 mt-3">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: displayRoleColor }}
                />
                <span
                  className="text-[10px] font-bold uppercase tracking-wide font-mono px-2 py-0.5 rounded"
                  style={{
                    backgroundColor: `${displayRoleColor}12`,
                    color: displayRoleColor,
                  }}
                >
                  {displayRole}
                </span>
              </div>
            </div>

            {/* Dropdown Options */}
            <div className="p-1">
              <button
                onClick={() => {
                  setShowDropdown(false);
                  router.push("/dashboard/hr/onboarding");
                }}
                className="w-full px-3 py-2 text-left rounded-lg text-sm text-text-primary hover:bg-page-bg transition-colors flex items-center gap-2.5 cursor-pointer border-0 bg-transparent"
              >
                <User className="w-4 h-4 text-text-secondary" />
                <span>View Profile</span>
              </button>
              
              <button
                onClick={() => {
                  setShowDropdown(false);
                  router.push("/dashboard");
                }}
                className="w-full px-3 py-2 text-left rounded-lg text-sm text-text-primary hover:bg-page-bg transition-colors flex items-center gap-2.5 cursor-pointer border-0 bg-transparent"
              >
                <ShieldCheck className="w-4 h-4 text-text-secondary" />
                <span>Access & Security</span>
              </button>
            </div>

            <div className="h-px bg-divider my-1" />

            {/* Logout Action */}
            <div className="p-1">
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full px-3 py-2 text-left rounded-lg text-sm text-danger hover:bg-red-500/5 transition-colors flex items-center gap-2.5 cursor-pointer border-0 bg-transparent font-medium"
              >
                {isLoggingOut ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-danger" />
                    <span>Logging out...</span>
                  </>
                ) : (
                  <>
                    <LogOut className="w-4 h-4 text-danger" />
                    <span>Log Out</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
