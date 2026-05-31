"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Paperclip,
  Trash2,
  Loader2,
  MessageSquare,
  ExternalLink,
  Search,
  Users,
  AlertCircle,
  FileText,
  Image,
  Video,
  Music,
  CheckCircle2,
  X,
  Clock,
  CheckCheck,
  RefreshCw,
  ArrowLeft,
} from "lucide-react";
import PartySocket from "partysocket";
import { getChatMessagesAction, sendChatMessageAction } from "@/app/actions/chatActions";
import {
  getGDriveUploadContextAction,
  grantGDriveFilePermissionAction,
} from "@/app/actions/gdriveActions";
import { cn } from "@/lib/utils";

interface Attachment {
  id: string;
  name: string;
  link: string;
  mimeType: string;
  size: number;
}

interface Message {
  id: string;
  projectId: string;
  senderId: string | null;
  messageText: string | null;
  attachments: Attachment[];
  createdAt: any;
  senderName: string | null;
  senderAvatar: string | null;
  roleName: string | null;
  roleColor: string | null;
  status?: "waiting" | "delivered" | "failed";
}

interface Project {
  id: string;
  name: string;
  status: string;
  progress: number;
  description: string | null;
}

interface ChatWorkspaceClientProps {
  initialProjects: Project[];
  currentUser: {
    userId: string;
    name: string;
    email: string;
    roleName: string;
    roleColor: string;
  };
  initialSelectedProjectId?: string;
  hideSidebar?: boolean;
}

export function ChatWorkspaceClient({
  initialProjects,
  currentUser,
  initialSelectedProjectId = "",
  hideSidebar = false,
}: ChatWorkspaceClientProps) {
  const [projects] = useState<Project[]>(initialProjects);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(initialSelectedProjectId);
  const [searchTerm, setSearchTerm] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // Message Input State
  const [inputValue, setInputValue] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);

  // Attachments State
  const [attachmentsQueue, setAttachmentsQueue] = useState<Attachment[]>([]);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadingFileName, setUploadingFileName] = useState<string>("");
  const [uploadingFileSize, setUploadingFileSize] = useState<number>(0);
  const [uploadingFileMime, setUploadingFileMime] = useState<string>("");

  // PartySocket State & Reference
  const socketRef = useRef<PartySocket | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter projects by search
  const filteredProjects = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  // Scroll to bottom helper
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Connect to PartyKit dynamically and load history/messages
  useEffect(() => {
    if (!selectedProjectId) {
      setMessages([]);
      return;
    }

    setLoadingMessages(true);
    const host = process.env.NEXT_PUBLIC_PARTYKIT_HOST || "localhost:1999";
    const clientId = process.env.NEXT_PUBLIC_CLIENT_ID || "default";
    const multitenantRoomId = `${clientId}_${selectedProjectId}`;

    const socket = new PartySocket({
      host: host,
      room: multitenantRoomId,
    });

    socketRef.current = socket;

    socket.onmessage = (event) => {
      try {
        const response = JSON.parse(event.data);

        if (response.type === "history") {
          setMessages(response.data);
          setLoadingMessages(false);
          setTimeout(scrollToBottom, 100);
        } else if (response.type === "message") {
          const newMessage = response.data;
          setMessages((prev) => {
            if (prev.some((m) => m.id === newMessage.id)) return prev;

            // Optimistic replacement
            const optimisticIndex = prev.findIndex(
              (m) =>
                m.status === "waiting" &&
                m.senderId === newMessage.senderId &&
                m.messageText === newMessage.messageText
            );

            if (optimisticIndex !== -1) {
              const updated = [...prev];
              updated[optimisticIndex] = { ...newMessage, status: "delivered" };
              return updated;
            }

            return [...prev, newMessage];
          });
          setTimeout(scrollToBottom, 80);
        }
      } catch (err) {
        console.error("Failed to parse websocket message:", err);
      }
    };

    setAttachmentsQueue([]);
    setUploadError("");

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [selectedProjectId]);

  // Trigger scroll to bottom on initial message load
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle file uploads
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedProjectId) return;

    // 100MB validation for client resumable upload
    const maxBytes = 100 * 1024 * 1024;
    if (file.size > maxBytes) {
      setUploadError("Standard attachment limit is 100MB. Please choose a smaller file.");
      return;
    }

    setUploadError("");
    setUploadingFile(true);
    setUploadingFileName(file.name);
    setUploadingFileSize(file.size);
    setUploadingFileMime(file.type || "application/octet-stream");
    setUploadProgress(0);

    try {
      // 1. Fetch token and target folder ID from Server Action
      const contextRes = await getGDriveUploadContextAction(selectedProjectId, "chat");
      if (!contextRes.success || !contextRes.accessToken || !contextRes.folderId) {
        throw new Error(
          contextRes.error?.includes("authenticated") || contextRes.error?.includes("configured") || contextRes.error?.includes("active")
            ? "Google Drive is not linked or your authorization has expired. Please go to Settings > Integrations to authenticate."
            : contextRes.error || "Failed to initialize cloud credentials."
        );
      }

      const { accessToken, folderId } = contextRes;

      // 2. Initiate Resumable Session with Google Drive
      const initRes = await fetch(
        "https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json; charset=UTF-8",
            "X-Upload-Content-Type": file.type || "application/octet-stream",
          },
          body: JSON.stringify({
            name: file.name,
            parents: [folderId],
          }),
        }
      );

      if (!initRes.ok) {
        const initErr = await initRes.json();
        throw new Error(
          initErr.error?.message || "Failed to initialize Google Drive upload session."
        );
      }

      const uploadUrl = initRes.headers.get("Location");
      if (!uploadUrl) {
        throw new Error("Failed to retrieve resumable upload target location from Google.");
      }

      // 3. Directly stream the binary payload to Google using XHR for progress tracking
      const uploadFileWithProgress = (url: string, uploadFile: File): Promise<any> => {
        return new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open("PUT", url);
          xhr.setRequestHeader("Content-Type", uploadFile.type || "application/octet-stream");

          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              const percentComplete = Math.round((event.loaded / event.total) * 100);
              setUploadProgress(percentComplete);
            }
          };

          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              try {
                const response = JSON.parse(xhr.responseText);
                resolve(response);
              } catch (e) {
                reject(new Error("Invalid response format from Google Drive."));
              }
            } else {
              try {
                const response = JSON.parse(xhr.responseText);
                reject(new Error(response.error?.message || "File upload failed."));
              } catch (e) {
                reject(new Error(`Upload failed with status code ${xhr.status}`));
              }
            }
          };

          xhr.onerror = () => {
            reject(new Error("Network connection error occurred during file upload."));
          };

          xhr.send(uploadFile);
        });
      };

      const uploadedFile = await uploadFileWithProgress(uploadUrl, file);
      const fileId = uploadedFile.id;

      if (!fileId) {
        throw new Error("No Google Drive File ID returned after completion.");
      }

      // 4. Grant "anyone with link can read" permissions so team members can view it inline
      // We run this via a secure Server Action to completely bypass browser CORS limitations.
      const permRes = await grantGDriveFilePermissionAction(fileId);
      if (!permRes.success) {
        console.warn(
          "Failed to grant public viewing permissions on direct client upload:",
          permRes.error
        );
      }

      // 5. Append attachment details to message queue
      setAttachmentsQueue((prev) => [
        ...prev,
        {
          id: fileId,
          name: file.name,
          link: `https://drive.google.com/open?id=${fileId}`,
          mimeType: file.type || "application/octet-stream",
          size: file.size,
        },
      ]);
    } catch (err: any) {
      console.error("Client Google Drive upload error:", err);
      setUploadError(err.message || "An unexpected error occurred during direct upload.");
    } finally {
      setUploadingFile(false);
      setUploadProgress(null);
      setUploadingFileName("");
      setUploadingFileSize(0);
      setUploadingFileMime("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeAttachment = (id: string) => {
    setAttachmentsQueue((prev) => prev.filter((a) => a.id !== id));
  };

  // Handle message send submission
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim() && attachmentsQueue.length === 0) return;

    const messageText = inputValue.trim();
    const attachments = [...attachmentsQueue];
    const tempId = `temp-${Date.now()}`;

    const optimisticMessage: Message = {
      id: tempId,
      projectId: selectedProjectId,
      senderId: currentUser.userId,
      messageText,
      attachments,
      createdAt: new Date().toISOString(),
      senderName: currentUser.name,
      senderAvatar: null,
      roleName: currentUser.roleName,
      roleColor: currentUser.roleColor,
      status: "waiting",
    };

    // Optimistic Reset
    setInputValue("");
    setAttachmentsQueue([]);
    setMessages((prev) => [...prev, optimisticMessage]);
    setTimeout(scrollToBottom, 50);

    try {
      if (socketRef.current) {
        socketRef.current.send(
          JSON.stringify({
            senderId: currentUser.userId,
            messageText,
            attachments,
          })
        );
      } else {
        throw new Error("Chat connection is offline.");
      }
    } catch (err: any) {
      console.error(err);
      setMessages((prev) =>
        prev.map((msg) => (msg.id === tempId ? { ...msg, status: "failed" } : msg))
      );
      setUploadError(err.message || "Could not dispatch message.");
    }
  };

  const handleRetrySendMessage = async (msg: Message) => {
    setMessages((prev) => prev.map((m) => (m.id === msg.id ? { ...m, status: "waiting" } : m)));

    try {
      if (socketRef.current) {
        socketRef.current.send(
          JSON.stringify({
            senderId: currentUser.userId,
            messageText: msg.messageText || "",
            attachments: msg.attachments,
          })
        );
      } else {
        throw new Error("Chat connection is offline.");
      }
    } catch (err: any) {
      console.error(err);
      setMessages((prev) => prev.map((m) => (m.id === msg.id ? { ...m, status: "failed" } : m)));
      setUploadError("Could not dispatch message.");
    }
  };
  // Utility to format bytes beautifully
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  // Select friendly icons for attachments
  const getFileIcon = (mime: string, name?: string) => {
    const isImg = mime.startsWith("image/") || (name && /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(name));
    if (isImg) return <Image className="w-4.5 h-4.5 text-emerald-500" />;
    if (mime.startsWith("video/")) return <Video className="w-4.5 h-4.5 text-rose-500" />;
    if (mime.startsWith("audio/")) return <Music className="w-4.5 h-4.5 text-amber-500" />;
    return <FileText className="w-4.5 h-4.5 text-blue-500" />;
  };

  // Resolve user-friendly document type labels
  const getFileTypeLabel = (mime: string, name?: string): string => {
    const lowerName = name ? name.toLowerCase() : "";
    const lowerMime = mime.toLowerCase();
    if (lowerMime.startsWith("image/") || /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(lowerName)) {
      return "Image File";
    }
    if (lowerMime.startsWith("video/") || /\.(mp4|mkv|mov|avi|wmv)$/i.test(lowerName)) {
      return "Video File";
    }
    if (lowerMime.startsWith("audio/") || /\.(mp3|wav|ogg|m4a|flac)$/i.test(lowerName)) {
      return "Audio File";
    }
    if (lowerMime.includes("pdf") || lowerName.endsWith(".pdf")) {
      return "PDF Document";
    }
    if (lowerMime.includes("word") || lowerName.endsWith(".docx") || lowerName.endsWith(".doc")) {
      return "Word Document";
    }
    if (lowerMime.includes("excel") || lowerName.endsWith(".xlsx") || lowerName.endsWith(".xls") || lowerName.endsWith(".csv")) {
      return "Spreadsheet";
    }
    if (lowerMime.includes("presentation") || lowerName.endsWith(".pptx") || lowerName.endsWith(".ppt")) {
      return "Presentation";
    }
    return "Document";
  };

  return (
    <div
      className={cn(
        "flex bg-[#F8FAFC] border border-border rounded-3xl overflow-hidden shadow-sm",
        hideSidebar ? "h-[650px]" : "h-full"
      )}
    >
      {/* LEFT PANEL: Projects Directory */}
      {!hideSidebar && !selectedProjectId && (
        <div className="w-80 border-r border-border flex flex-col bg-white shrink-0">
          {/* Directory Header */}
          <div className="p-6 border-b border-border space-y-4">
            <div>
              <h3 className="text-lg font-bold text-text-primary">Project Channels</h3>
              <p className="text-[11px] text-text-muted uppercase tracking-wider font-bold">
                Collaborators Feed
              </p>
            </div>
            {/* Search bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search workspaces..."
                className="w-full pl-9 pr-4 h-10 border border-border rounded-xl text-[12px] bg-slate-50 focus:bg-white focus:border-accent outline-none transition-colors"
              />
            </div>
          </div>

          {/* Channels List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-1.5 custom-scrollbar">
            {filteredProjects.length === 0 ? (
              <div className="text-center py-12 px-4 text-text-muted text-[12px] space-y-2">
                <MessageSquare className="w-8 h-8 mx-auto stroke-[1.5] text-slate-300" />
                <p>No project channels found.</p>
              </div>
            ) : (
              filteredProjects.map((p) => {
                const isActive = p.id === selectedProjectId;
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedProjectId(p.id)}
                    className={cn(
                      "w-full text-left p-4 rounded-2xl flex items-center justify-between group transition-all duration-200 border border-transparent cursor-pointer",
                      isActive
                        ? "bg-accent/5 border-accent/20 text-accent font-bold"
                        : "hover:bg-slate-50 text-text-secondary"
                    )}
                  >
                    <div className="space-y-1.5 truncate max-w-[85%]">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "w-2 h-2 rounded-full",
                            p.status === "Active" ? "bg-success" : "bg-text-muted"
                          )}
                        />
                        <span className="text-[13px] font-bold tracking-tight truncate block">
                          {p.name}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono tracking-widest text-text-muted uppercase block">
                        {p.id}
                      </span>
                    </div>
                    <ChevronRightSmall isActive={isActive} />
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* RIGHT PANEL: Dynamic Chat Console */}
      <div className="flex-1 flex flex-col bg-slate-50/50 relative overflow-hidden">
        {selectedProject ? (
          <>
            {/* Chat Room Header */}
            <div className="px-8 py-5 border-b border-border bg-white flex items-center justify-between z-10 shadow-sm shadow-slate-100/50">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSelectedProjectId("")}
                  className="p-2 text-text-secondary hover:text-accent transition-all rounded-xl hover:bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200 bg-slate-50/50 cursor-pointer shadow-sm active:scale-95 duration-200"
                  title="Back to Channels"
                >
                  <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
                </button>

                <div className="w-10 h-10 rounded-xl bg-accent/5 border border-accent/15 flex items-center justify-center text-accent shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-text-primary flex items-center gap-2">
                    {selectedProject.name}
                  </h4>
                  <p className="text-[11px] text-text-muted font-mono tracking-wider">
                    CHANNEL ID: {selectedProject.id}
                  </p>
                </div>
              </div>
            </div>

            {/* Error notifications */}
            {uploadError && (
              <div className="mx-8 mt-4 p-4 bg-danger/10 border border-danger/15 rounded-2xl flex items-center justify-between text-danger font-bold text-[12px]">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>
                    {uploadError.includes("Settings > Integrations") ? (
                      <>
                        {uploadError.split("Settings > Integrations")[0]}
                        <a
                          href="/dashboard/settings?tab=integrations"
                          className="underline hover:text-rose-700 ml-1 font-extrabold cursor-pointer"
                        >
                          Settings &gt; Integrations
                        </a>
                        {uploadError.split("Settings > Integrations")[1]}
                      </>
                    ) : (
                      uploadError
                    )}
                  </span>
                </div>
                <button
                  onClick={() => setUploadError("")}
                  className="text-danger hover:scale-105 border-0 bg-transparent cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Chat Feed */}
            <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6 custom-scrollbar">
              {loadingMessages ? (
                <div className="h-full flex flex-col items-center justify-center text-text-muted text-[12px] gap-2">
                  <Loader2 className="w-6 h-6 animate-spin text-accent" />
                  <span>Retrieving project sync history...</span>
                </div>
              ) : messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-text-muted text-center py-20 max-w-sm mx-auto space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                    <MessageSquare className="w-6 h-6 stroke-[1.5]" />
                  </div>
                  <div className="space-y-1">
                    <h5 className="font-bold text-text-primary text-[13px]">No Messages Yet</h5>
                    <p className="text-[12px] leading-relaxed">
                      This is the beginning of the real-time project collaboration feed. Type a
                      message below to start!
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  {messages.map((msg, index) => {
                    const isSelf = msg.senderId === currentUser.userId;
                    // Format timestamp
                    const dateObj = new Date(msg.createdAt);
                    const formattedTime = dateObj.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    });

                    // Render avatar initial
                    const nameInitials = msg.senderName
                      ? msg.senderName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()
                      : "U";

                    return (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 28 }}
                        className={cn(
                          "flex gap-3 max-w-[80%]",
                          isSelf ? "ml-auto flex-row-reverse" : "mr-auto"
                        )}
                      >
                        {/* Avatar */}
                        <div
                          className="w-9 h-9 rounded-xl shrink-0 flex items-center justify-center text-white text-[12px] font-black border border-white/10 shadow-sm"
                          style={{ backgroundColor: msg.roleColor || "#10B981" }}
                        >
                          {nameInitials}
                        </div>

                        {/* Content Container */}
                        <div className="space-y-1.5">
                          {/* Sender Info */}
                          <div
                            className={cn(
                              "flex items-center gap-2 text-[11px]",
                              isSelf ? "justify-end" : "justify-start"
                            )}
                          >
                            <span className="font-bold text-text-primary">{msg.senderName}</span>
                            <span
                              className="px-1.5 py-0.5 rounded-md font-black text-[9px] uppercase tracking-wider border"
                              style={{
                                color: msg.roleColor || "#10B981",
                                borderColor: `${msg.roleColor || "#10B981"}25`,
                                backgroundColor: `${msg.roleColor || "#10B981"}08`,
                              }}
                            >
                              {msg.roleName}
                            </span>
                            <div className="flex items-center gap-1.5">
                              <span className="text-text-muted text-[10px]">{formattedTime}</span>
                              {isSelf && (
                                <>
                                  {(!msg.status || msg.status === "delivered") && (
                                    <CheckCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                  )}
                                  {msg.status === "waiting" && (
                                    <Clock className="w-3 h-3 text-slate-400 animate-pulse shrink-0" />
                                  )}
                                  {msg.status === "failed" && (
                                    <div className="flex items-center gap-1 text-danger font-bold text-[10px] shrink-0">
                                      <AlertCircle className="w-3 h-3" />
                                      <button
                                        type="button"
                                        onClick={() => handleRetrySendMessage(msg)}
                                        className="text-[9.5px] hover:text-rose-600 font-bold transition-colors bg-transparent border-0 p-0 cursor-pointer flex items-center gap-0.5"
                                      >
                                        <RefreshCw className="w-2.5 h-2.5 animate-spin-slow" />
                                        <span>Retry</span>
                                      </button>
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          </div>

                          {/* Chat Bubble */}
                          <div
                            className={cn(
                              "px-5 py-3.5 rounded-2xl text-[13px] leading-relaxed shadow-sm",
                              isSelf
                                ? "bg-accent text-white rounded-tr-none"
                                : "bg-white text-text-secondary border border-border rounded-tl-none"
                            )}
                          >
                            {/* Message Text */}
                            {msg.messageText && (
                              <p className="whitespace-pre-wrap break-words">{msg.messageText}</p>
                            )}

                            {/* Attachments List */}
                            {msg.attachments && msg.attachments.length > 0 && (
                              <div
                                className={cn(
                                  "space-y-2 mt-2",
                                  msg.messageText ? "pt-2 border-t border-white/10" : ""
                                )}
                              >
                                {msg.attachments.map((file) => {
                                  const typeLabel = getFileTypeLabel(file.mimeType, file.name);
                                  return (
                                    <a
                                      key={file.id}
                                      href={file.link}
                                      target="_blank"
                                      rel="noreferrer"
                                      className={cn(
                                        "flex items-center justify-between gap-4 p-3 rounded-2xl border transition-all text-left group w-full max-w-[320px] shadow-sm",
                                        isSelf
                                          ? "bg-white/10 border-white/15 text-white hover:bg-white/20 hover:border-white/25"
                                          : "bg-slate-50 border-slate-200/60 text-text-primary hover:bg-slate-100 hover:border-slate-300"
                                      )}
                                    >
                                      <div className="flex items-center gap-3 truncate min-w-0">
                                        <div
                                          className={cn(
                                            "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-colors",
                                            isSelf
                                              ? "bg-white/10 group-hover:bg-white/15"
                                              : "bg-emerald-500/10 group-hover:bg-emerald-500/15"
                                          )}
                                        >
                                          {getFileIcon(file.mimeType, file.name)}
                                        </div>
                                        <div className="truncate min-w-0">
                                          <span className="block text-xs font-bold truncate leading-tight">
                                            {file.name}
                                          </span>
                                          <span
                                            className={cn(
                                              "block text-[10px] mt-0.5 font-medium leading-none opacity-75",
                                              isSelf ? "text-white/80" : "text-text-secondary/80"
                                            )}
                                          >
                                            {typeLabel} • {formatBytes(file.size)}
                                          </span>
                                        </div>
                                      </div>
                                      <ExternalLink 
                                        className={cn(
                                          "w-3.5 h-3.5 shrink-0 transition-opacity opacity-50 group-hover:opacity-100",
                                          isSelf ? "text-white" : "text-text-secondary"
                                        )} 
                                      />
                                    </a>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Bottom Actions Queue & Input */}
            <div className="p-6 bg-white border-t border-border space-y-4">
              {/* Active Upload Progress Card */}
              <AnimatePresence>
                {uploadProgress !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-4 bg-emerald-50/40 border border-emerald-500/10 backdrop-blur-md rounded-2xl flex flex-col gap-3 shadow-sm max-w-md"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 truncate">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/15 flex items-center justify-center text-emerald-600 shrink-0">
                          {getFileIcon(uploadingFileMime, uploadingFileName)}
                        </div>
                        <div className="truncate">
                          <span className="font-bold text-[12px] text-text-primary block truncate max-w-[200px]">
                            {uploadingFileName}
                          </span>
                          <span className="text-[10px] text-emerald-600 font-bold block">
                            {formatBytes(Math.round((uploadProgress / 100) * uploadingFileSize))} of{" "}
                            {formatBytes(uploadingFileSize)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[12px] font-black text-emerald-700 font-mono tracking-tighter">
                          {uploadProgress}%
                        </span>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600 shrink-0" />
                      </div>
                    </div>

                    {/* Shimmering Progress Bar */}
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden relative border border-slate-200/50">
                      <motion.div
                        className="h-full bg-emerald-500 rounded-full relative"
                        initial={{ width: "0%" }}
                        animate={{ width: `${uploadProgress}%` }}
                        transition={{ type: "spring", stiffness: 80, damping: 15 }}
                      >
                        {/* Premium shimmering visual pulse overlay */}
                        <div className="absolute inset-0 bg-white/20 animate-pulse" />
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Attachment queue list */}
              {attachmentsQueue.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {attachmentsQueue.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-border rounded-xl text-[11px] text-text-secondary"
                    >
                      {getFileIcon(file.mimeType, file.name)}
                      <span className="font-bold truncate max-w-[150px]">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeAttachment(file.id)}
                        className="text-text-muted hover:text-danger p-0.5 rounded-md hover:bg-black/5 transition-colors border-0 bg-transparent cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Message Input Area */}
              <form onSubmit={handleSendMessage} className="flex gap-3 items-end">
                {/* Upload Button */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  id="chat-file-upload-input"
                />
                <button
                  type="button"
                  disabled={uploadingFile || sendingMessage}
                  onClick={() => fileInputRef.current?.click()}
                  className="h-12 w-12 border border-border rounded-xl bg-slate-50 text-text-secondary hover:text-text-primary hover:bg-slate-100 flex items-center justify-center transition-colors shrink-0 disabled:opacity-50 cursor-pointer"
                  title="Upload attachment to Google Drive"
                >
                  {uploadingFile ? (
                    <Loader2 className="w-5 h-5 animate-spin text-accent" />
                  ) : (
                    <Paperclip className="w-5 h-5" />
                  )}
                </button>

                {/* Input Text Box */}
                <textarea
                  rows={1}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                    }
                  }}
                  placeholder={
                    uploadingFile
                      ? "Uploading cloud attachment..."
                      : "Type your message here... (Press Enter to send)"
                  }
                  className="flex-1 bg-slate-50 border border-border rounded-xl px-4 py-3.5 text-[13px] text-text-primary focus:bg-white focus:border-accent outline-none max-h-32 min-h-12 resize-none custom-scrollbar transition-colors leading-relaxed"
                />

                {/* Submit Send Button */}
                <button
                  type="submit"
                  disabled={uploadingFile || (!inputValue.trim() && attachmentsQueue.length === 0)}
                  className="h-12 px-6 bg-accent text-white font-bold rounded-xl text-[12px] uppercase tracking-wider flex items-center justify-center gap-2 hover:scale-[1.01] shadow-lg shadow-accent/15 transition-all disabled:opacity-40 shrink-0 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Send</span>
                </button>
              </form>

              {/* Upload limits hints */}
              <div className="flex items-center justify-between text-[10px] text-text-muted font-bold uppercase tracking-wider">
                <span>Supports PDF, Docs, Images, Zip</span>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-text-muted text-center p-8 max-w-sm mx-auto space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-accent/5 border border-accent/10 flex items-center justify-center text-accent animate-bounce-slow">
              <MessageSquare className="w-7 h-7" />
            </div>
            <div className="space-y-1.5">
              <h4 className="font-bold text-text-primary text-[14px]">
                Select a Project Chat Channel
              </h4>
              <p className="text-[12px] leading-relaxed">
                Choose one of the assigned project channels from the directory on the left to start
                collaborating in real-time.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Micro animation caret indicator
function ChevronRightSmall({ isActive }: { isActive: boolean }) {
  return (
    <motion.span
      animate={{ x: isActive ? 2 : 0 }}
      className={cn(
        "text-text-muted font-bold text-[12px] transition-colors shrink-0",
        isActive ? "text-accent" : "group-hover:text-text-secondary"
      )}
    >
      ❯
    </motion.span>
  );
}
