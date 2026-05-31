"use client";

import React, { useEffect, useState, useRef } from "react";
import Pusher from "pusher-js";
import { getCurrentSessionAction } from "@/app/actions/auth";
import { getPusherStatusAction } from "@/app/actions/pusherActions";
import { useNotificationsStore } from "@/store/notificationsStore";
import { getVapidPublicKeyAction, savePushSubscriptionAction } from "@/app/actions/notificationActions";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, CheckSquare, Receipt, FileText, UserPlus, Info } from "lucide-react";
import { cn } from "@/lib/utils";

// Custom Toast Alert structure
interface ActiveToast {
  id: string;
  type: "invoice" | "task" | "proposal" | "lead" | "info";
  message: string;
}

export function RealtimeNotificationManager() {
  const [activeToasts, setActiveToasts] = useState<ActiveToast[]>([]);
  const { addNotification } = useNotificationsStore();
  const pusherRef = useRef<Pusher | null>(null);

  useEffect(() => {
    // 1. Register Public Service Worker for browser push alerts
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          console.log("[QB-SERVICEWORKER] ✓ Background Service Worker ready:", reg.scope);
        })
        .catch((err) => {
          console.warn("[QB-SERVICEWORKER] Failed to register Service Worker:", err);
        });
    }

    // 2. Fetch Session and connect to Pusher WebSocket Channel
    let activeChannel: any = null;

    async function initRealtime() {
      try {
        const session = await getCurrentSessionAction();
        if (!session || !session.userId) return;

        const pusherStatus = await getPusherStatusAction();
        if (!pusherStatus.success || !pusherStatus.isConfigured) {
          console.warn("[QB-PUSH] Pusher is not configured. Falling back to local events.");
          return;
        }

        // Initialize Pusher Client
        const pusher = new Pusher(pusherStatus.key || "", {
          cluster: pusherStatus.cluster || "us2",
          forceTLS: true,
        });
        pusherRef.current = pusher;

        // Subscribe to user private channel
        const channelName = `user-${session.userId}`;
        activeChannel = pusher.subscribe(channelName);
        console.log(`[QB-PUSH] ✓ Subscribed to live WebSocket notifications: ${channelName}`);

        // Listen for new operational alerts
        activeChannel.bind("new-notification", (data: any) => {
          console.log("[QB-PUSH] Received real-time alert event:", data);

          // Add to global state
          addNotification({
            id: data.id || `NTF-${Date.now()}`,
            type: data.type || "task",
            entityId: data.entityId || "",
            message: data.message || "",
            timestamp: data.timestamp || new Date().toISOString(),
            read: data.read || false,
            group: data.group || "today",
          });

          // Display visual in-app glassmorphic toast
          const newToast: ActiveToast = {
            id: data.id || `TST-${Date.now()}`,
            type: data.type || "info",
            message: data.message || "",
          };
          setActiveToasts((prev) => [newToast, ...prev]);

          // Play subtle notification chime
          try {
            const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-84.wav");
            audio.volume = 0.25;
            audio.play().catch(() => {});
          } catch {}
        });

      } catch (err) {
        console.error("[QB-PUSH] Live notifications manager init error:", err);
      }
    }

    initRealtime();

    return () => {
      if (pusherRef.current && activeChannel) {
        pusherRef.current.unsubscribe(activeChannel.name);
        pusherRef.current.disconnect();
      }
    };
  }, [addNotification]);

  const removeToast = (id: string) => {
    setActiveToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3.5 w-full max-w-[380px] pointer-events-none">
      <AnimatePresence>
        {activeToasts.map((toast) => (
          <ToastCard key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastCard({ toast, onClose }: { toast: ActiveToast; onClose: () => void }) {
  useEffect(() => {
    // Auto remove after 6.5s
    const timer = setTimeout(onClose, 6500);
    return () => clearTimeout(timer);
  }, [onClose]);

  const getToastMetadata = (type: ActiveToast["type"]) => {
    switch (type) {
      case "invoice":
        return { Icon: Receipt, color: "text-red-500", bg: "bg-red-500/10 border-red-500/20" };
      case "task":
        return { Icon: CheckSquare, color: "text-[#10B981]", bg: "bg-[#10B981]/10 border-[#10B981]/20" };
      case "proposal":
        return { Icon: FileText, color: "text-[#8B5CF6]", bg: "bg-[#8B5CF6]/10 border-[#8B5CF6]/20" };
      case "lead":
        return { Icon: UserPlus, color: "text-amber-500", bg: "bg-amber-500/10 border-amber-500/20" };
      default:
        return { Icon: Info, color: "text-blue-500", bg: "bg-blue-500/10 border-blue-500/20" };
    }
  };

  const { Icon, color, bg } = getToastMetadata(toast.type);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className="w-full pointer-events-auto bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 shadow-[0_12px_32px_rgba(0,0,0,0.12)] p-4 rounded-2xl flex gap-3.5 relative overflow-hidden"
    >
      {/* Dynamic side accent */}
      <div className={cn("w-1 rounded-full shrink-0", color.replace("text-", "bg-"))} />

      {/* Icon frame */}
      <div className={cn("w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 shadow-sm", bg)}>
        <Icon className={cn("w-4.5 h-4.5", color)} />
      </div>

      {/* Message content */}
      <div className="flex-1 pr-3 min-w-0">
        <h5 className="text-[11px] font-bold tracking-wider text-text-muted uppercase mb-0.5">
          QuantumBlaze Alert
        </h5>
        <p className="text-[12.5px] leading-relaxed text-text-primary font-medium break-words">
          {toast.message}
        </p>
      </div>

      {/* Close switch */}
      <button
        onClick={onClose}
        className="h-6 w-6 rounded-lg flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border-0 bg-transparent cursor-pointer active:scale-90"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Glassy running timer bar */}
      <motion.div
        initial={{ width: "100%" }}
        animate={{ width: "0%" }}
        transition={{ duration: 6.5, ease: "linear" }}
        className={cn("absolute bottom-0 left-0 h-0.75", color.replace("text-", "bg-"))}
      />
    </motion.div>
  );
}

/**
 * Utility helper to register user VAPID credentials in browser push notifications.
 * Requests native OS/Browser consent first.
 */
export async function subscribeUserToPush() {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    console.warn("[QB-PUSH] Browser does not support native push notifications.");
    return false;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.warn("[QB-PUSH] Native notification permission denied by user.");
      return false;
    }

    const registration = await navigator.serviceWorker.ready;

    // Load VAPID public key dynamically from server action
    const res = await getVapidPublicKeyAction();
    if (!res.success || !res.publicKey) {
      console.error("[QB-PUSH] VAPID Key unavailable:", res.error);
      return false;
    }

    // Convert key to raw binary buffer
    const applicationServerKey = urlBase64ToUint8Array(res.publicKey);

    // Subscribe to browser vendor server (FCM / APNs)
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey,
    });

    console.log("[QB-PUSH] Browser subscribed successfully. Registering on server...");

    // Convert non-plain PushSubscription object to a plain JSON object for Next.js Server Action transfer
    const plainSubscription = JSON.parse(JSON.stringify(subscription));

    // Save browser endpoint credentials on server
    const saveRes = await savePushSubscriptionAction(plainSubscription);
    return saveRes.success;
  } catch (err) {
    console.error("[QB-PUSH] Push subscription subscription sequence failed:", err);
    return false;
  }
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
