"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  HardDrive,
  Mail,
  ChevronRight,
  X,
  Key,
  Settings,
  RefreshCw,
  FolderPlus,
  Folder,
  CheckCircle,
  Trash2,
  AlertCircle,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getGoogleDriveStatusAction,
  saveGoogleDriveClientConfigAction,
  getGoogleDriveAuthUrlAction,
  disconnectGoogleDriveAction,
  listBaseFolderOptionsAction,
  saveBaseFolderSettingsAction,
  createBaseFolderAction,
} from "@/app/actions/gdriveActions";

export function IntegrationsTab() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Integration card states
  const [gdriveStatus, setGDriveStatus] = useState<{
    hasConfig: boolean;
    isConnected: boolean;
    baseFolder: { baseFolderId: string; baseFolderName: string } | null;
    clientId: string;
  }>({
    hasConfig: false,
    isConnected: false,
    baseFolder: null,
    clientId: "",
  });
  const [loadingStatus, setLoadingStatus] = useState(true);

  // Drawer & Selection states
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [folders, setFolders] = useState<Array<{ id: string; name: string }>>([]);
  const [loadingFolders, setLoadingFolders] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState("");
  const [newFolderName, setNewFolderName] = useState("");

  // Action status states
  const [isSavingConfig, setIsSavingConfig] = useState(false);
  const [isSavingFolder, setIsSavingFolder] = useState(false);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  // Form states
  const [clientIdInput, setClientIdInput] = useState("");
  const [clientSecretInput, setClientSecretInput] = useState("");
  const [drawerError, setDrawerError] = useState("");
  const [drawerSuccess, setDrawerSuccess] = useState("");

  // Notification banners from URL redirect
  const [urlNotification, setUrlNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Fetch status on load
  const loadStatus = async () => {
    try {
      const res = await getGoogleDriveStatusAction();
      if (res.success) {
        setGDriveStatus({
          hasConfig: res.hasConfig || false,
          isConnected: res.isConnected || false,
          baseFolder: res.baseFolder || null,
          clientId: res.clientId || "",
        });
        if (res.clientId) setClientIdInput(res.clientId);
        if (res.baseFolder) setSelectedFolderId(res.baseFolder.baseFolderId);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingStatus(false);
    }
  };

  useEffect(() => {
    loadStatus();

    // Check URL query parameters
    const success = searchParams.get("gdrive_success");
    const error = searchParams.get("gdrive_error");

    if (success) {
      setUrlNotification({
        type: "success",
        message: "Google Drive authenticated successfully! You can now configure the base sync folder.",
      });
      setDrawerOpen(true); // Open drawer automatically to pick the base folder
      // Clear URL params
      router.replace("/dashboard/settings?tab=integrations");
    } else if (error) {
      setUrlNotification({
        type: "error",
        message: `Google Drive connection failed: ${error}`,
      });
      // Clear URL params
      router.replace("/dashboard/settings?tab=integrations");
    }
  }, [searchParams]);

  // Load folders list when connected
  const loadFolders = async () => {
    setLoadingFolders(true);
    setDrawerError("");
    try {
      const res = await listBaseFolderOptionsAction();
      if (res.success && res.folders) {
        setFolders(res.folders);
      } else {
        setDrawerError(res.error || "Failed to load folders from Google Drive.");
      }
    } catch (err: any) {
      setDrawerError(err.message || "Failed to retrieve folders.");
    } finally {
      setLoadingFolders(false);
    }
  };

  useEffect(() => {
    if (drawerOpen && gdriveStatus.isConnected) {
      loadFolders();
    }
  }, [drawerOpen, gdriveStatus.isConnected]);

  // Handle Client Credentials saving
  const handleSaveCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingConfig(true);
    setDrawerError("");
    setDrawerSuccess("");

    try {
      const res = await saveGoogleDriveClientConfigAction(clientIdInput, clientSecretInput);
      if (res.success) {
        setDrawerSuccess("OAuth credentials saved successfully! You can now connect your Google account.");
        await loadStatus();
      } else {
        setDrawerError(res.error || "Failed to save configuration.");
      }
    } catch (err: any) {
      setDrawerError(err.message || "An unexpected error occurred.");
    } finally {
      setIsSavingConfig(false);
    }
  };

  // Initiate Google Authentication Redirect
  const handleConnectAccount = async () => {
    setDrawerError("");
    try {
      const res = await getGoogleDriveAuthUrlAction(window.location.origin);
      if (res.success && res.url) {
        // Redirect to Google Consent screen
        window.location.href = res.url;
      } else {
        setDrawerError(res.error || "Could not retrieve authorization link.");
      }
    } catch (err: any) {
      setDrawerError(err.message || "Connection request failed.");
    }
  };

  // Disconnect Google Drive
  const handleDisconnect = async () => {
    if (!confirm("Are you sure you want to disconnect Google Drive? This will revoke access and clear all sync configurations.")) {
      return;
    }
    setIsDisconnecting(true);
    setDrawerError("");
    try {
      const res = await disconnectGoogleDriveAction();
      if (res.success) {
        setDrawerSuccess("Google Drive successfully disconnected.");
        setClientIdInput("");
        setClientSecretInput("");
        setSelectedFolderId("");
        setFolders([]);
        await loadStatus();
        setTimeout(() => setDrawerOpen(false), 2000);
      } else {
        setDrawerError(res.error || "Failed to disconnect account.");
      }
    } catch (err: any) {
      setDrawerError(err.message || "Disconnection failed.");
    } finally {
      setIsDisconnecting(false);
    }
  };

  // Save selected Base Folder
  const handleSaveFolder = async () => {
    setIsSavingFolder(true);
    setDrawerError("");
    setDrawerSuccess("");

    try {
      const folderName = folders.find((f) => f.id === selectedFolderId)?.name || "Google Drive Folder";
      const res = await saveBaseFolderSettingsAction(selectedFolderId, folderName);
      if (res.success) {
        setDrawerSuccess("Base sync folder updated successfully!");
        await loadStatus();
      } else {
        setDrawerError(res.error || "Failed to save folder selection.");
      }
    } catch (err: any) {
      setDrawerError(err.message || "Error updating folder config.");
    } finally {
      setIsSavingFolder(false);
    }
  };

  // Create new Base Folder
  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    setIsCreatingFolder(true);
    setDrawerError("");
    setDrawerSuccess("");

    try {
      const res = await createBaseFolderAction(newFolderName);
      if (res.success) {
        setDrawerSuccess(`Created and selected base folder: "${res.folderName}"`);
        setNewFolderName("");
        await loadStatus();
        await loadFolders();
        if (res.folderId) setSelectedFolderId(res.folderId);
      } else {
        setDrawerError(res.error || "Failed to create new folder.");
      }
    } catch (err: any) {
      setDrawerError(err.message || "Error creating folder.");
    } finally {
      setIsCreatingFolder(false);
    }
  };

  const INTEGRATIONS = [
    {
      id: "slack",
      name: "Slack",
      description: "Receive real-time system alerts and activity updates in your channels.",
      icon: MessageSquare,
      status: "Connected",
      color: "text-purple-500",
      actionLabel: "CONFIGURE HUB",
      onAction: () => {},
    },
    {
      id: "gdrive",
      name: "Google Drive",
      description: "Auto-sync all generated agreements and proposals to your cloud storage.",
      icon: HardDrive,
      status: loadingStatus
        ? "Loading..."
        : gdriveStatus.isConnected && gdriveStatus.baseFolder
        ? "Connected"
        : gdriveStatus.isConnected
        ? "Requires Sync Folder"
        : "Not Connected",
      color: "text-blue-500",
      actionLabel: "CONFIGURE HUB",
      onAction: () => setDrawerOpen(true),
    },
    {
      id: "gmail",
      name: "Gmail SMTP",
      description: "Send outbound invoices and reports using your corporate SMTP server.",
      icon: Mail,
      status: "Connected",
      color: "text-amber-500",
      actionLabel: "CONFIGURE HUB",
      onAction: () => {},
    },
  ];

  return (
    <div className="space-y-6">
      {/* Dynamic URL Notifications */}
      <AnimatePresence>
        {urlNotification && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={cn(
              "flex items-center gap-3 px-6 py-4 rounded-xl text-[13px] font-bold border shadow-sm",
              urlNotification.type === "success"
                ? "bg-emerald-50 border-emerald-100 text-emerald-600"
                : "bg-danger/10 border-danger/20 text-danger"
            )}
          >
            {urlNotification.type === "success" ? (
              <Check className="w-5 h-5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <span className="flex-1">{urlNotification.message}</span>
            <button
              onClick={() => setUrlNotification(null)}
              className="p-1 rounded-lg hover:bg-black/5 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Integration Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {INTEGRATIONS.map((integration) => (
          <motion.div
            key={integration.id}
            whileHover={{ y: -4 }}
            className="bg-white border border-border rounded-2xl p-6 flex flex-col justify-between group hover:border-accent/30 transition-all shadow-sm hover:shadow-md"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div
                  className={cn("p-3 rounded-xl bg-page-bg border border-border", integration.color)}
                >
                  <integration.icon className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "w-1.5 h-1.5 rounded-full",
                      integration.status === "Connected"
                        ? "bg-success"
                        : integration.status === "Requires Sync Folder"
                        ? "bg-amber-500 animate-pulse"
                        : integration.status === "Loading..."
                        ? "bg-text-muted animate-spin"
                        : "bg-text-muted"
                    )}
                  />
                  <span
                    className={cn(
                      "text-[10px] font-bold uppercase tracking-widest",
                      integration.status === "Connected"
                        ? "text-success"
                        : integration.status === "Requires Sync Folder"
                        ? "text-amber-500"
                        : "text-text-muted"
                    )}
                  >
                    {integration.status}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-bold text-text-primary mb-1">{integration.name}</h4>
                <p className="text-[12px] text-text-muted leading-relaxed">
                  {integration.description}
                </p>
              </div>
            </div>

            <button
              onClick={integration.onAction}
              disabled={integration.id !== "gdrive"}
              className={cn(
                "mt-8 flex items-center justify-between w-full p-4 rounded-xl bg-page-bg border border-divider group-hover:border-accent/50 transition-all cursor-pointer",
                integration.id !== "gdrive" && "opacity-50 cursor-not-allowed"
              )}
            >
              <span className="text-[12px] font-bold text-text-secondary group-hover:text-text-primary">
                {integration.actionLabel}
              </span>
              <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-accent" />
            </button>
          </motion.div>
        ))}
      </div>

      {/* Slide-over Drawer for Google Drive Configuration */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Drawer Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 bg-black z-40"
            />

            {/* Drawer Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-white border-l border-border shadow-2xl p-8 flex flex-col justify-between overflow-y-auto"
            >
              {/* Header */}
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-divider">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-blue-500">
                      <HardDrive className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-text-primary">Google Drive</h3>
                      <p className="text-[11px] text-text-muted uppercase tracking-widest font-bold">Cloud Sync Settings</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setDrawerOpen(false)}
                    className="p-2 rounded-xl hover:bg-page-bg text-text-muted hover:text-text-primary transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Notifications in Drawer */}
                {drawerError && (
                  <div className="flex items-center gap-3 bg-danger/10 border border-danger/20 text-danger p-4 rounded-xl text-[12px] font-bold">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{drawerError}</span>
                  </div>
                )}
                {drawerSuccess && (
                  <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 text-emerald-600 p-4 rounded-xl text-[12px] font-bold">
                    <CheckCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{drawerSuccess}</span>
                  </div>
                )}

                {/* Main Action Modules */}
                {!gdriveStatus.hasConfig ? (
                  /* STEP 1: Save Client Config */
                  <form onSubmit={handleSaveCredentials} className="space-y-6">
                    <div className="bg-blue-50/50 border border-blue-100/50 p-5 rounded-2xl space-y-2">
                      <div className="flex items-center gap-2 text-[12px] font-black text-blue-600 uppercase tracking-widest">
                        <Settings className="w-4 h-4" />
                        Setup Instructions
                      </div>
                      <p className="text-[11px] text-text-secondary leading-relaxed">
                        To enable direct cloud transfers, create an **OAuth 2.0 Web Application** inside your [Google Cloud Console](https://console.cloud.google.com). 
                      </p>
                      <div className="p-3 bg-white border border-border rounded-xl text-[11px] font-mono text-text-primary break-all select-all">
                        <span className="font-bold text-text-muted">Redirect URI:</span> {window.location.origin}/api/auth/callback/google-drive
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest flex items-center gap-1.5">
                          <Key className="w-3 h-3 text-accent" />
                          OAuth Client ID
                        </label>
                        <input
                          type="text"
                          required
                          value={clientIdInput}
                          onChange={(e) => setClientIdInput(e.target.value)}
                          placeholder="e.g. 12345-abcde.apps.googleusercontent.com"
                          className="w-full h-11 px-4 border border-border rounded-xl text-[13px] text-text-primary focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest flex items-center gap-1.5">
                          <Key className="w-3 h-3 text-accent" />
                          OAuth Client Secret
                        </label>
                        <input
                          type="password"
                          required
                          value={clientSecretInput}
                          onChange={(e) => setClientSecretInput(e.target.value)}
                          placeholder="Enter your Google Client Secret"
                          className="w-full h-11 px-4 border border-border rounded-xl text-[13px] text-text-primary focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSavingConfig}
                      className="w-full flex items-center justify-center gap-2 h-12 bg-accent text-white font-bold rounded-xl text-[12px] uppercase tracking-widest shadow-lg shadow-accent/20 hover:scale-[1.01] transition-all disabled:opacity-50 cursor-pointer"
                    >
                      {isSavingConfig ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        "Save Credentials"
                      )}
                    </button>
                  </form>
                ) : !gdriveStatus.isConnected ? (
                  /* STEP 2: Authenticate Account */
                  <div className="space-y-6">
                    <div className="p-6 bg-slate-50 border border-border rounded-2xl text-center space-y-4">
                      <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-500 mx-auto">
                        <HardDrive className="w-6 h-6 animate-pulse" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-text-primary">Credentials Configured</h4>
                        <p className="text-[11px] text-text-muted break-all">
                          Client ID: {gdriveStatus.clientId.slice(0, 15)}...
                        </p>
                      </div>
                      <p className="text-[12px] text-text-secondary leading-relaxed">
                        OAuth endpoints are loaded. Click the connection link below to authenticate with Google Consent.
                      </p>
                    </div>

                    <button
                      onClick={handleConnectAccount}
                      className="w-full flex items-center justify-center gap-2 h-12 bg-blue-500 text-white font-bold rounded-xl text-[12px] uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:scale-[1.01] transition-all cursor-pointer"
                    >
                      Connect Google Account
                    </button>

                    <div className="flex justify-between items-center pt-4 border-t border-divider">
                      <p className="text-[10px] text-text-muted">Need to edit Client ID/Secret?</p>
                      <button
                        onClick={async () => {
                          if (confirm("Reset current credentials?")) {
                            await disconnectGoogleDriveAction();
                            await loadStatus();
                          }
                        }}
                        className="text-[11px] font-bold text-danger hover:underline cursor-pointer"
                      >
                        Reset Credentials
                      </button>
                    </div>
                  </div>
                ) : (
                  /* STEP 3: Configure Sync Folder */
                  <div className="space-y-8">
                    {/* Connection Banner */}
                    <div className="p-4 bg-emerald-50 border border-emerald-100/50 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                          <Check className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-[12px] font-bold text-text-primary">Account Authorized</p>
                          <p className="text-[10px] text-emerald-600 font-mono">Status: Connected</p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest rounded-full">ACTIVE</span>
                    </div>

                    {/* Folder Selection Option */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest flex items-center gap-1.5">
                          <Folder className="w-3.5 h-3.5 text-blue-500" />
                          Choose System Sync Folder
                        </label>
                        {loadingFolders ? (
                          <div className="flex items-center justify-center h-12 bg-slate-50 border border-border rounded-xl text-[12px] text-text-muted gap-2">
                            <RefreshCw className="w-4 h-4 animate-spin text-accent" />
                            Loading folders from Google Drive...
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <div className="relative flex-1">
                              <select
                                value={selectedFolderId}
                                onChange={(e) => setSelectedFolderId(e.target.value)}
                                className="w-full bg-white border border-border rounded-xl px-4 h-11 text-[13px] text-text-primary focus:border-accent outline-none appearance-none"
                              >
                                <option value="">-- Select a Folder --</option>
                                {folders.map((f) => (
                                  <option key={f.id} value={f.id}>
                                    {f.name}
                                  </option>
                                ))}
                              </select>
                              <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-text-muted">
                                ▼
                              </div>
                            </div>
                            <button
                              onClick={handleSaveFolder}
                              disabled={!selectedFolderId || isSavingFolder}
                              className="px-6 bg-accent text-white font-bold text-[11px] uppercase tracking-widest rounded-xl hover:scale-[1.02] disabled:opacity-50 transition-all cursor-pointer"
                            >
                              {isSavingFolder ? "Saving..." : "Apply"}
                            </button>
                          </div>
                        )}
                        <p className="text-[11px] text-text-muted leading-relaxed">
                          All project proposals, receipts, and agreements will sync directly inside this base folder.
                        </p>
                      </div>

                      {/* Folder Setup status */}
                      {gdriveStatus.baseFolder && (
                        <div className="p-4 bg-slate-50 border border-border rounded-xl flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-accent" />
                          <div>
                            <p className="text-[11px] text-text-muted uppercase tracking-widest font-black">Active Base Folder</p>
                            <p className="text-[13px] font-bold text-text-primary">
                              {gdriveStatus.baseFolder.baseFolderName}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Divider */}
                      <div className="relative flex py-4 items-center">
                        <div className="flex-grow border-t border-divider"></div>
                        <span className="flex-shrink mx-4 text-text-muted text-[10px] font-black uppercase tracking-wider">or</span>
                        <div className="flex-grow border-t border-divider"></div>
                      </div>

                      {/* Create New Base Folder Form */}
                      <form onSubmit={handleCreateFolder} className="space-y-3">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest flex items-center gap-1.5">
                            <FolderPlus className="w-3.5 h-3.5 text-accent" />
                            Create New Base Folder
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              required
                              value={newFolderName}
                              onChange={(e) => setNewFolderName(e.target.value)}
                              placeholder="e.g. QuantumBlaze ERP Sync"
                              className="flex-1 h-11 px-4 border border-border rounded-xl text-[13px] text-text-primary focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                            />
                            <button
                              type="submit"
                              disabled={isCreatingFolder || !newFolderName.trim()}
                              className="px-6 bg-slate-900 text-white font-bold text-[11px] uppercase tracking-widest rounded-xl hover:scale-[1.02] disabled:opacity-50 transition-all cursor-pointer"
                            >
                              {isCreatingFolder ? "Creating..." : "Create"}
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>

              {/* Drawer Footer Actions */}
              {gdriveStatus.isConnected && (
                <div className="pt-6 border-t border-divider mt-auto">
                  <button
                    onClick={handleDisconnect}
                    disabled={isDisconnecting}
                    className="w-full flex items-center justify-center gap-2 h-12 border border-danger/25 text-danger/80 hover:text-white hover:bg-danger hover:border-transparent font-bold rounded-xl text-[12px] uppercase tracking-widest transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isDisconnecting ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4" />
                        Disconnect Integration
                      </>
                    )}
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
