"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, Bell, User, LogOut, ShieldCheck, ChevronDown, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getCurrentSessionAction, signOutAction } from "@/app/actions/auth";
import { useRouter } from "next/navigation";
import { SessionData } from "@/lib/session";

export const TopBar = ({ title }: { title: string }) => {
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
        console.error("Failed to load session in TopBar:", error);
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
      console.error("Logout failed:", error);
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

  const displayName = session ? session.name : "Jane Doe";
  const displayId = session ? session.userId : "USR-JD-26-004";
  const displayRole = session ? session.roleName : "Admin";
  const displayRoleColor = session ? session.roleColor : "#10B981";
  const initials = getInitials(displayName);

  return (
    <header className="h-16 border-b border-divider bg-white px-8 flex items-center justify-between sticky top-0 z-30 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
      <h1 className="text-text-primary text-xl font-bold font-outfit">{title}</h1>

      <div className="flex items-center gap-6">
        {/* Search Bar */}
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-accent transition-colors" />
          <input
            type="text"
            placeholder="Search ID or name... (⌘K)"
            className="h-9 w-64 pl-10 pr-4 bg-white border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all placeholder:text-text-muted"
          />
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-4">
          <button className="relative p-2 text-text-secondary hover:text-text-primary hover:bg-page-bg rounded-lg transition-all group cursor-pointer border-0 bg-transparent">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-danger border-2 border-white rounded-full animate-pulse" />
          </button>

          <div className="h-8 w-px bg-divider mx-1" />

          {/* Interactive Profile Area */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-3 pl-2 group cursor-pointer border-0 bg-transparent text-left focus:outline-none"
            >
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-text-primary leading-tight font-outfit group-hover:text-accent transition-colors">
                  {displayName}
                </p>
                <p className="text-[10px] font-mono text-text-muted uppercase tracking-tighter mt-0.5">
                  {displayId}
                </p>
              </div>

              {/* Avatar Circle */}
              <div
                className="w-9 h-9 rounded-full border flex items-center justify-center text-sm font-bold transition-all relative overflow-hidden shrink-0"
                style={{
                  backgroundColor: `${displayRoleColor}15`,
                  borderColor: `${displayRoleColor}30`,
                  color: displayRoleColor,
                }}
              >
                <span>{initials}</span>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all" />
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-text-muted group-hover:text-text-primary transition-all shrink-0 hidden sm:block" />
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
                      {session?.email || "jane@company.com"}
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
                        // Redirect to onboarding or settings profile
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
                        // Redirect to onboarding/settings
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
        </div>
      </div>
    </header>
  );
};
