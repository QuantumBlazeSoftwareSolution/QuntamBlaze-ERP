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
} from "lucide-react";
import Pusher from "pusher-js";
import { getChatMessagesAction, sendChatMessageAction, uploadChatAttachmentAction } from "@/app/actions/chatActions";
import { getPusherStatusAction } from "@/app/actions/pusherActions";
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

  // Pusher State
  const [pusherConfig, setPusherConfig] = useState<{ key: string; cluster: string } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter projects by search
  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  // Scroll to bottom helper
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Load Pusher configuration parameters dynamically
  useEffect(() => {
    async function loadPusherKeys() {
      const res = await getPusherStatusAction();
      if (res.success && res.isConfigured && res.key && res.cluster) {
        setPusherConfig({ key: res.key, cluster: res.cluster });
      }
    }
    loadPusherKeys();
  }, []);

  // Fetch messages when selected project changes
  useEffect(() => {
    if (!selectedProjectId) return;

    async function fetchMessages() {
      setLoadingMessages(true);
      try {
        const res = await getChatMessagesAction(selectedProjectId);
        if (res.success && res.messages) {
          // Cast parsed jsonb column securely
          const parsed = res.messages.map((m: any) => ({
            ...m,
            attachments: typeof m.attachments === "string" 
              ? JSON.parse(m.attachments) 
              : (m.attachments || []),
          }));
          setMessages(parsed);
        }
      } catch (err) {
        console.error("Error loading chat messages:", err);
      } finally {
        setLoadingMessages(false);
        setTimeout(scrollToBottom, 100);
      }
    }

    fetchMessages();
    setAttachmentsQueue([]);
    setUploadError("");
  }, [selectedProjectId]);

  // Connect to Pusher dynamically and subscribe to the project channel
  useEffect(() => {
    if (!selectedProjectId || !pusherConfig) return;

    // Enable logging in dev for verification
    if (process.env.NODE_ENV === "development") {
      Pusher.logToConsole = true;
    }

    const pusherClient = new Pusher(pusherConfig.key, {
      cluster: pusherConfig.cluster,
    });

    const channelName = `project-${selectedProjectId}`;
    const channel = pusherClient.subscribe(channelName);

    channel.bind("new-message", (newMessage: any) => {
      // Prevent duplicating client's optimistic or already updated lists
      setMessages((prev) => {
        if (prev.some((m) => m.id === newMessage.id)) return prev;

        // If this message belongs to the current user (optimistic message replacement check)
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
    });

    return () => {
      channel.unbind_all();
      pusherClient.unsubscribe(channelName);
      pusherClient.disconnect();
    };
  }, [selectedProjectId, pusherConfig]);

  // Trigger scroll to bottom on initial message load
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle file uploads
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedProjectId) return;

    // 10MB validation
    const maxBytes = 10 * 1024 * 1024;
    if (file.size > maxBytes) {
      setUploadError("Standard attachment limit is 10MB. Please choose a smaller file.");
      return;
    }

    setUploadError("");
    setUploadingFile(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await uploadChatAttachmentAction(selectedProjectId, formData);
      if (res.success && res.attachment) {
        setAttachmentsQueue((prev) => [...prev, res.attachment as Attachment]);
      } else {
        setUploadError(res.error || "File upload failed.");
      }
    } catch (err: any) {
      setUploadError(err.message || "An unexpected error occurred during upload.");
    } finally {
      setUploadingFile(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeAttachment = (id: string) => {
    setAttachmentsQueue((prev) => prev.filter((a) => a.id !== id));
  };

  // Handle message send submission
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId) return;
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
    setSendingMessage(true);
    setTimeout(scrollToBottom, 50);

    try {
      const res = await sendChatMessageAction(selectedProjectId, messageText, attachments);
      if (res.success && res.message) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === tempId
              ? { ...res.message, status: "delivered" }
              : msg
          )
        );
      } else {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === tempId
              ? { ...msg, status: "failed" }
              : msg
          )
        );
        setUploadError(res.error || "Failed to deliver message.");
      }
    } catch (err: any) {
      console.error(err);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempId
            ? { ...msg, status: "failed" }
            : msg
        )
      );
      setUploadError("Could not dispatch message.");
    } finally {
      setSendingMessage(false);
      setTimeout(scrollToBottom, 50);
    }
  };

  const handleRetrySendMessage = async (msg: Message) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === msg.id
          ? { ...m, status: "waiting" }
          : m
      )
    );

    try {
      const res = await sendChatMessageAction(selectedProjectId, msg.messageText || "", msg.attachments);
      if (res.success && res.message) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === msg.id
              ? { ...res.message, status: "delivered" }
              : m
          )
        );
      } else {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === msg.id
              ? { ...m, status: "failed" }
              : m
          )
        );
        setUploadError(res.error || "Failed to deliver message.");
      }
    } catch (err: any) {
      console.error(err);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === msg.id
            ? { ...m, status: "failed" }
            : m
        )
      );
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
  const getFileIcon = (mime: string) => {
    if (mime.startsWith("image/")) return <Image className="w-4 h-4 text-emerald-500" />;
    if (mime.startsWith("video/")) return <Video className="w-4 h-4 text-rose-500" />;
    if (mime.startsWith("audio/")) return <Music className="w-4 h-4 text-amber-500" />;
    return <FileText className="w-4 h-4 text-blue-500" />;
  };

  return (
    <div className={cn(
      "flex bg-[#F8FAFC] border border-border rounded-3xl overflow-hidden shadow-sm",
      hideSidebar ? "h-[650px]" : "h-[calc(100vh-140px)]"
    )}>
      {/* LEFT PANEL: Projects Directory */}
      {!hideSidebar && (
        <div className="w-80 border-r border-border flex flex-col bg-white shrink-0">
          {/* Directory Header */}
          <div className="p-6 border-b border-border space-y-4">
            <div>
              <h3 className="text-lg font-bold text-text-primary">Project Channels</h3>
              <p className="text-[11px] text-text-muted uppercase tracking-wider font-bold">Collaborators Feed</p>
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
                <div className="w-10 h-10 rounded-xl bg-accent/5 border border-accent/15 flex items-center justify-center text-accent">
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

              {/* Connected Active Badges */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-100/50 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Sync Active
                </div>
                <div className="flex items-center gap-1 text-[11px] font-bold text-text-muted">
                  <Users className="w-3.5 h-3.5" />
                  <span>Team Workspace</span>
                </div>
              </div>
            </div>

            {/* Error notifications */}
            {uploadError && (
              <div className="mx-8 mt-4 p-4 bg-danger/10 border border-danger/15 rounded-2xl flex items-center justify-between text-danger font-bold text-[12px]">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{uploadError}</span>
                </div>
                <button onClick={() => setUploadError("")} className="text-danger hover:scale-105 border-0 bg-transparent">
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
                      This is the beginning of the real-time project collaboration feed. Type a message below to start!
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
                      ? msg.senderName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
                      : "U";

                    return (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 28 }}
                        className={cn("flex gap-3 max-w-[80%]", isSelf ? "ml-auto flex-row-reverse" : "mr-auto")}
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
                          <div className={cn("flex items-center gap-2 text-[11px]", isSelf ? "justify-end" : "justify-start")}>
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
                                    <CheckCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" title="Delivered" />
                                  )}
                                  {msg.status === "waiting" && (
                                    <Clock className="w-3 h-3 text-slate-400 animate-pulse shrink-0" title="Sending..." />
                                  )}
                                  {msg.status === "failed" && (
                                    <div className="flex items-center gap-1 text-danger font-bold text-[10px] shrink-0">
                                      <AlertCircle className="w-3 h-3" title="Failed to send" />
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
                              <div className={cn("space-y-2 mt-2", msg.messageText ? "pt-2 border-t border-white/10" : "")}>
                                {msg.attachments.map((file) => (
                                  <a
                                    key={file.id}
                                    href={file.link}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={cn(
                                      "flex items-center justify-between gap-4 p-2.5 rounded-xl border transition-all text-[11px] font-medium leading-none group",
                                      isSelf
                                        ? "bg-white/10 border-white/15 text-white hover:bg-white/15"
                                        : "bg-slate-50 border-border text-text-secondary hover:bg-slate-100"
                                    )}
                                  >
                                    <div className="flex items-center gap-2 truncate">
                                      {getFileIcon(file.mimeType)}
                                      <span className="truncate block font-bold max-w-[140px]">
                                        {file.name}
                                      </span>
                                      <span className="opacity-60 text-[9px] font-mono shrink-0">
                                        ({formatBytes(file.size)})
                                      </span>
                                    </div>
                                    <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 shrink-0 transition-opacity" />
                                  </a>
                                ))}
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
              {/* Attachment queue list */}
              {attachmentsQueue.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {attachmentsQueue.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-border rounded-xl text-[11px] text-text-secondary"
                    >
                      {getFileIcon(file.mimeType)}
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
                  disabled={
                    uploadingFile || 
                    (!inputValue.trim() && attachmentsQueue.length === 0)
                  }
                  className="h-12 px-6 bg-accent text-white font-bold rounded-xl text-[12px] uppercase tracking-wider flex items-center justify-center gap-2 hover:scale-[1.01] shadow-lg shadow-accent/15 transition-all disabled:opacity-40 shrink-0 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Send</span>
                </button>
              </form>

              {/* Upload limits hints */}
              <div className="flex items-center justify-between text-[10px] text-text-muted font-bold uppercase tracking-wider">
                <span>Supports PDF, Docs, Images, Zip</span>
                <span className="flex items-center gap-1 text-accent font-semibold">
                  <CheckCircle2 className="w-3 h-3" /> Auto-saved in GDrive chat/ folder (Limit: 10MB)
                </span>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-text-muted text-center p-8 max-w-sm mx-auto space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-accent/5 border border-accent/10 flex items-center justify-center text-accent animate-bounce-slow">
              <MessageSquare className="w-7 h-7" />
            </div>
            <div className="space-y-1.5">
              <h4 className="font-bold text-text-primary text-[14px]">Select a Project Chat Channel</h4>
              <p className="text-[12px] leading-relaxed">
                Choose one of the assigned project channels from the directory on the left to start collaborating in real-time.
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
