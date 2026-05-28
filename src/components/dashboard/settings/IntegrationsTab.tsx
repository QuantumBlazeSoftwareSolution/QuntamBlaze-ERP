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
  Copy,
  HelpCircle,
  Sparkles,
  Eye,
  EyeOff,
  GitBranch,
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
import {
  savePusherConfigAction,
  getPusherStatusAction,
  disconnectPusherAction,
} from "@/app/actions/pusherActions";
import {
  saveGeminiConfigAction,
  getGeminiStatusAction,
  disconnectGeminiAction,
  testGeminiConnectionAction,
  getAvailableGeminiModelsAction,
} from "@/app/actions/geminiActions";
import { checkKnowledgeBaseReadyAction } from "@/app/actions/knowledgeBaseActions";
import {
  saveGithubConfigAction,
  getGithubStatusAction,
  disconnectGithubAction,
  listAppInstalledOrganizationsAction,
} from "@/app/actions/githubActions";

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
  const [drawerType, setDrawerType] = useState<"gdrive" | "pusher" | "gemini" | "github" | null>(null);
  const drawerOpen = !!drawerType;
  const setDrawerOpen = (open: boolean) => {
    if (!open) setDrawerType(null);
  };
  const [folders, setFolders] = useState<Array<{ id: string; name: string }>>([]);
  const [loadingFolders, setLoadingFolders] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState("");
  const [newFolderName, setNewFolderName] = useState("");

  // Action status states
  const [isSavingConfig, setIsSavingConfig] = useState(false);
  const [isSavingFolder, setIsSavingFolder] = useState(false);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  // Pusher status and action states
  const [pusherStatus, setPusherStatus] = useState<{
    isConfigured: boolean;
    appId: string;
    key: string;
    cluster: string;
  }>({
    isConfigured: false,
    appId: "",
    key: "",
    cluster: "",
  });
  const [loadingPusherStatus, setLoadingPusherStatus] = useState(true);
  const [isSavingPusherConfig, setIsSavingPusherConfig] = useState(false);
  const [isDisconnectingPusher, setIsDisconnectingPusher] = useState(false);

  // Gemini AI states
  const [geminiStatus, setGeminiStatus] = useState<{
    isConfigured: boolean;
    maskedApiKey: string;
    baseModel: string;
  }>({
    isConfigured: false,
    maskedApiKey: "",
    baseModel: "gemini-2.0-flash",
  });
  const [loadingGeminiStatus, setLoadingGeminiStatus] = useState(true);
  const [isSavingGeminiConfig, setIsSavingGeminiConfig] = useState(false);
  const [isDisconnectingGemini, setIsDisconnectingGemini] = useState(false);
  const [isTestingGeminiConnection, setIsTestingGeminiConnection] = useState(false);

  // Gemini inputs
  const [geminiApiKeyInput, setGeminiApiKeyInput] = useState("");
  const [geminiBaseModelInput, setGeminiBaseModelInput] = useState("gemini-2.0-flash");
  const [showApiKey, setShowApiKey] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  
  // Dynamic Gemini models state
  const [availableGeminiModels, setAvailableGeminiModels] = useState<{ id: string; displayName: string; description?: string }[]>([]);
  const [isLoadingGeminiModels, setIsLoadingGeminiModels] = useState(false);

  // Knowledge Base stats (shown inside Gemini drawer)
  const [kbStats, setKbStats] = useState<{ docCount: number; chunkCount: number } | null>(null);

  // GitHub states
  const [githubStatus, setGithubStatus] = useState<{
    isConfigured: boolean;
    appId: string;
    clientId: string;
    orgName: string;
  }>({
    isConfigured: false,
    appId: "",
    clientId: "",
    orgName: "",
  });
  const [loadingGithubStatus, setLoadingGithubStatus] = useState(true);
  const [githubAppIdInput, setGithubAppIdInput] = useState("");
  const [githubClientIdInput, setGithubClientIdInput] = useState("");
  const [githubClientSecretInput, setGithubClientSecretInput] = useState("");
  const [githubPrivateKeyInput, setGithubPrivateKeyInput] = useState("");
  const [githubOrgNameInput, setGithubOrgNameInput] = useState("");
  const [showGithubClientSecret, setShowGithubClientSecret] = useState(false);
  const [showGithubPrivateKey, setShowGithubPrivateKey] = useState(false);
  const [isSavingGithubConfig, setIsSavingGithubConfig] = useState(false);
  const [isDisconnectingGithub, setIsDisconnectingGithub] = useState(false);
  const [githubInstalledOrgs, setGithubInstalledOrgs] = useState<string[]>([]);

  // Form states
  const [clientIdInput, setClientIdInput] = useState("");
  const [clientSecretInput, setClientSecretInput] = useState("");
  const [pusherAppIdInput, setPusherAppIdInput] = useState("");
  const [pusherKeyInput, setPusherKeyInput] = useState("");
  const [pusherSecretInput, setPusherSecretInput] = useState("");
  const [pusherClusterInput, setPusherClusterInput] = useState("");
  const [drawerError, setDrawerError] = useState("");
  const [drawerSuccess, setDrawerSuccess] = useState("");

  // Notification banners from URL redirect
  const [urlNotification, setUrlNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Setup Instruction Modal States
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [showPusherSetupModal, setShowPusherSetupModal] = useState(false);
  const [showGithubSetupModal, setShowGithubSetupModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [clientOrigin, setClientOrigin] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setClientOrigin(window.location.origin);
    }
  }, []);

  const copyRedirectUri = () => {
    navigator.clipboard.writeText(`${window.location.origin}/api/auth/callback/google-drive`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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

  const loadPusherStatus = async () => {
    try {
      const res = await getPusherStatusAction();
      if (res.success) {
        setPusherStatus({
          isConfigured: res.isConfigured || false,
          appId: res.appId || "",
          key: res.key || "",
          cluster: res.cluster || "",
        });
        if (res.appId) setPusherAppIdInput(res.appId);
        if (res.key) setPusherKeyInput(res.key);
        if (res.cluster) setPusherClusterInput(res.cluster);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPusherStatus(false);
    }
  };

  const loadGeminiStatus = async () => {
    try {
      const res = await getGeminiStatusAction();
      if (res.success) {
        setGeminiStatus({
          isConfigured: res.isConfigured || false,
          maskedApiKey: res.maskedApiKey || "",
          baseModel: res.baseModel || "gemini-2.0-flash",
        });
        if (res.maskedApiKey) setGeminiApiKeyInput(res.maskedApiKey);
        if (res.baseModel) setGeminiBaseModelInput(res.baseModel);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingGeminiStatus(false);
    }
  };

  const loadGithubStatus = async () => {
    try {
      const res = await getGithubStatusAction();
      if (res.success) {
        setGithubStatus({
          isConfigured: res.isConfigured || false,
          appId: res.appId || "",
          clientId: res.clientId || "",
          orgName: res.orgName || "",
        });
        if (res.appId) setGithubAppIdInput(res.appId);
        if (res.clientId) setGithubClientIdInput(res.clientId);
        if (res.orgName) setGithubOrgNameInput(res.orgName);
      }
      if (res.isConfigured) {
        const orgRes = await listAppInstalledOrganizationsAction();
        if (orgRes.success && orgRes.organizations) {
          setGithubInstalledOrgs(orgRes.organizations);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingGithubStatus(false);
    }
  };

  const handleSaveGithubCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingGithubConfig(true);
    setDrawerError("");
    setDrawerSuccess("");
    try {
      const res = await saveGithubConfigAction(
        githubAppIdInput,
        githubClientIdInput,
        githubClientSecretInput,
        githubPrivateKeyInput,
        githubOrgNameInput
      );
      if (res.success) {
        setDrawerSuccess("GitHub Suite App configuration saved successfully!");
        await loadGithubStatus();
      } else {
        setDrawerError(res.error || "Failed to save configuration.");
      }
    } catch (err: any) {
      setDrawerError(err.message || "An unexpected error occurred.");
    } finally {
      setIsSavingGithubConfig(false);
    }
  };

  const handleDisconnectGithub = async () => {
    if (!confirm("Are you sure you want to disconnect GitHub Developer Suite? This will wipe the global App settings.")) {
      return;
    }
    setIsDisconnectingGithub(true);
    setDrawerError("");
    setDrawerSuccess("");
    try {
      const res = await disconnectGithubAction();
      if (res.success) {
        setDrawerSuccess("GitHub integration successfully disconnected.");
        setGithubAppIdInput("");
        setGithubClientIdInput("");
        setGithubClientSecretInput("");
        setGithubPrivateKeyInput("");
        setGithubOrgNameInput("");
        setGithubInstalledOrgs([]);
        await loadGithubStatus();
        setTimeout(() => setDrawerType(null), 2000);
      } else {
        setDrawerError(res.error || "Failed to disconnect GitHub.");
      }
    } catch (err: any) {
      setDrawerError(err.message || "Disconnection failed.");
    } finally {
      setIsDisconnectingGithub(false);
    }
  };

  const fetchGeminiModels = async (key: string) => {
    if (!key) {
      setAvailableGeminiModels([]);
      return;
    }
    setIsLoadingGeminiModels(true);
    try {
      const res = await getAvailableGeminiModelsAction(key);
      if (res.success && res.models) {
        setAvailableGeminiModels(res.models);
        if (res.models.length > 0) {
          // If the currently selected model is not in the fetched models list, auto-select the first active model
          const modelExists = res.models.some((m: any) => m.id === geminiBaseModelInput);
          if (!modelExists) {
            setGeminiBaseModelInput(res.models[0].id);
          }
        }
      } else {
        console.error("Failed to load Gemini models:", res.error);
      }
    } catch (err) {
      console.error("Failed to fetch Gemini models:", err);
    } finally {
      setIsLoadingGeminiModels(false);
    }
  };

  // Fetch available models when the Gemini drawer is opened
  useEffect(() => {
    if (drawerType === "gemini" && geminiApiKeyInput) {
      fetchGeminiModels(geminiApiKeyInput);
    }
    // Also load KB stats when the Gemini drawer opens
    if (drawerType === "gemini") {
      checkKnowledgeBaseReadyAction().then((res) => {
        if (res.success !== false) {
          setKbStats({ docCount: res.docCount, chunkCount: res.chunkCount });
        }
      });
    }
  }, [drawerType]);

  // Debounced model fetch when the user inputs/pastes a new API key manually
  useEffect(() => {
    if (
      geminiApiKeyInput &&
      geminiApiKeyInput.startsWith("AIzaSy") &&
      geminiApiKeyInput.length > 25 &&
      !geminiApiKeyInput.includes("••••")
    ) {
      const delayDebounce = setTimeout(() => {
        fetchGeminiModels(geminiApiKeyInput);
      }, 800);
      return () => clearTimeout(delayDebounce);
    }
  }, [geminiApiKeyInput]);


  useEffect(() => {
    loadStatus();
    loadPusherStatus();
    loadGeminiStatus();
    loadGithubStatus();

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
    if (drawerType === "gdrive" && gdriveStatus.isConnected) {
      loadFolders();
    }
  }, [drawerType, gdriveStatus.isConnected]);

  // Clear drawer error/success state on drawer selection changes to prevent cross-bleeding
  useEffect(() => {
    setDrawerError("");
    setDrawerSuccess("");
  }, [drawerType]);

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

  const handleSavePusherCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingPusherConfig(true);
    setDrawerError("");
    setDrawerSuccess("");

    try {
      const res = await savePusherConfigAction(
        pusherAppIdInput,
        pusherKeyInput,
        pusherSecretInput,
        pusherClusterInput
      );
      if (res.success) {
        setDrawerSuccess("Pusher configuration saved successfully!");
        await loadPusherStatus();
      } else {
        setDrawerError(res.error || "Failed to save configuration.");
      }
    } catch (err: any) {
      setDrawerError(err.message || "An unexpected error occurred.");
    } finally {
      setIsSavingPusherConfig(false);
    }
  };

  const handleDisconnectPusher = async () => {
    if (!confirm("Are you sure you want to disconnect Pusher Channels? Real-time chats will stop working.")) {
      return;
    }
    setIsDisconnectingPusher(true);
    setDrawerError("");
    try {
      const res = await disconnectPusherAction();
      if (res.success) {
        setDrawerSuccess("Pusher Channels successfully disconnected.");
        setPusherAppIdInput("");
        setPusherKeyInput("");
        setPusherSecretInput("");
        setPusherClusterInput("");
        await loadPusherStatus();
        setTimeout(() => setDrawerType(null), 2000);
      } else {
        setDrawerError(res.error || "Failed to disconnect Pusher.");
      }
    } catch (err: any) {
      setDrawerError(err.message || "Disconnection failed.");
    } finally {
      setIsDisconnectingPusher(false);
    }
  };

  const handleSaveGeminiCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingGeminiConfig(true);
    setDrawerError("");
    setDrawerSuccess("");
    setTestResult(null);

    try {
      const res = await saveGeminiConfigAction(geminiApiKeyInput, geminiBaseModelInput);
      if (res.success) {
        setDrawerSuccess("Google Gemini AI configuration saved successfully!");
        await loadGeminiStatus();
      } else {
        setDrawerError(res.error || "Failed to save Gemini configuration.");
      }
    } catch (err: any) {
      setDrawerError(err.message || "An unexpected error occurred.");
    } finally {
      setIsSavingGeminiConfig(false);
    }
  };

  const handleDisconnectGemini = async () => {
    if (!confirm("Are you sure you want to disconnect Google Gemini AI? Custom AI features will stop working.")) {
      return;
    }
    setIsDisconnectingGemini(true);
    setDrawerError("");
    setDrawerSuccess("");
    setTestResult(null);
    try {
      const res = await disconnectGeminiAction();
      if (res.success) {
        setDrawerSuccess("Google Gemini AI successfully disconnected.");
        setGeminiApiKeyInput("");
        setGeminiBaseModelInput("gemini-2.0-flash");
        await loadGeminiStatus();
        setTimeout(() => setDrawerType(null), 2000);
      } else {
        setDrawerError(res.error || "Failed to disconnect Gemini.");
      }
    } catch (err: any) {
      setDrawerError(err.message || "Disconnection failed.");
    } finally {
      setIsDisconnectingGemini(false);
    }
  };

  const handleTestGeminiConnection = async () => {
    if (!geminiApiKeyInput) {
      setDrawerError("Please provide an API key to test the connection.");
      return;
    }
    setIsTestingGeminiConnection(true);
    setDrawerError("");
    setDrawerSuccess("");
    setTestResult(null);

    try {
      const res = await testGeminiConnectionAction(geminiApiKeyInput, geminiBaseModelInput);
      if (res.success) {
        setTestResult({
          success: true,
          message: res.message || "Connection verified successfully!",
        });
        setDrawerSuccess("Gemini API connection check passed!");
        // Fetch active models dynamically as the key is confirmed to be valid
        await fetchGeminiModels(geminiApiKeyInput);
      } else {
        setTestResult({
          success: false,
          message: res.error || "Connection check failed.",
        });
        setDrawerError(res.error || "Gemini API connection check failed.");
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || "An unexpected error occurred.",
      });
      setDrawerError(err.message || "Connection check failed.");
    } finally {
      setIsTestingGeminiConnection(false);
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
      onAction: () => setDrawerType("gdrive"),
    },
    {
      id: "pusher",
      name: "Pusher (WebSocket)",
      description: "Enable real-time messaging, collaboration, and instant updates across the workspace.",
      icon: MessageSquare,
      status: loadingPusherStatus
        ? "Loading..."
        : pusherStatus.isConfigured
        ? "Connected"
        : "Not Connected",
      color: "text-indigo-500",
      actionLabel: "CONFIGURE HUB",
      onAction: () => setDrawerType("pusher"),
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
    {
      id: "gemini",
      name: "Google Gemini AI",
      description: "Configure Google Gemini to activate intelligent context-aware ERP assistance and dynamic suggestions.",
      icon: Sparkles,
      status: loadingGeminiStatus
        ? "Loading..."
        : geminiStatus.isConfigured
        ? "Connected"
        : "Not Connected",
      color: "text-teal-600",
      actionLabel: "CONFIGURE HUB",
      onAction: () => setDrawerType("gemini"),
    },
    {
      id: "github",
      name: "GitHub Developer Suite",
      description: "Manage repository creation, branch setups, collaborator sync, and Pull Requests.",
      icon: GitBranch,
      status: loadingGithubStatus
        ? "Loading..."
        : githubStatus.isConfigured
        ? "Connected"
        : "Not Connected",
      color: "text-neutral-800",
      actionLabel: "CONFIGURE HUB",
      onAction: () => setDrawerType("github"),
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
            <Check className="w-5 h-5 flex-shrink-0" />
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
              disabled={integration.id !== "gdrive" && integration.id !== "pusher" && integration.id !== "gemini" && integration.id !== "github"}
              className={cn(
                "mt-8 flex items-center justify-between w-full p-4 rounded-xl bg-page-bg border border-divider group-hover:border-accent/50 transition-all cursor-pointer",
                (integration.id !== "gdrive" && integration.id !== "pusher" && integration.id !== "gemini" && integration.id !== "github") && "opacity-50 cursor-not-allowed"
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
              className="fixed inset-0 bg-black z-[999]"
            />

            {/* Drawer Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 z-[1000] w-full max-w-lg bg-white border-l border-border shadow-2xl p-8 flex flex-col justify-between overflow-y-auto"
            >
              {/* Header */}
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-divider">
                  {drawerType === "gdrive" ? (
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-blue-500">
                        <HardDrive className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-text-primary flex items-center gap-1.5">
                          Google Drive
                          <button
                            type="button"
                            onClick={() => setShowSetupModal(true)}
                            title="View Setup Guide"
                            className="text-text-muted hover:text-accent transition-colors border-0 bg-transparent p-0 cursor-pointer"
                          >
                            <HelpCircle className="w-4 h-4" />
                          </button>
                        </h3>
                        <p className="text-[11px] text-text-muted uppercase tracking-widest font-bold">Cloud Sync Settings</p>
                      </div>
                    </div>
                  ) : drawerType === "pusher" ? (
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-500">
                        <MessageSquare className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-text-primary flex items-center gap-1.5">
                          Pusher (WebSocket)
                          <button
                            type="button"
                            onClick={() => setShowPusherSetupModal(true)}
                            title="View Setup Guide"
                            className="text-text-muted hover:text-accent transition-colors border-0 bg-transparent p-0 cursor-pointer"
                          >
                            <HelpCircle className="w-4 h-4" />
                          </button>
                        </h3>
                        <p className="text-[11px] text-text-muted uppercase tracking-widest font-bold">Real-time Web Sync Settings</p>
                      </div>
                    </div>
                  ) : drawerType === "github" ? (
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-neutral-100 border border-neutral-200 rounded-xl text-neutral-800">
                        <GitBranch className="w-6 h-6 animate-pulse" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-text-primary flex items-center gap-1.5">
                          GitHub Developer Suite
                          <button
                            type="button"
                            onClick={() => setShowGithubSetupModal(true)}
                            title="View Setup Guide"
                            className="text-text-muted hover:text-accent transition-colors border-0 bg-transparent p-0 cursor-pointer"
                          >
                            <HelpCircle className="w-4 h-4" />
                          </button>
                        </h3>
                        <p className="text-[11px] text-text-muted uppercase tracking-widest font-bold">Repository Sync Settings</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-teal-50 border border-teal-100 rounded-xl text-teal-600">
                        <Sparkles className="w-6 h-6 animate-pulse" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-text-primary flex items-center gap-1.5">
                          Google Gemini AI
                        </h3>
                        <p className="text-[11px] text-text-muted uppercase tracking-widest font-bold">Artificial Intelligence Settings</p>
                      </div>
                    </div>
                  )}
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
                {drawerType === "gdrive" ? (
                  <>
                    {!gdriveStatus.hasConfig ? (
                      /* STEP 1: Save Client Config */
                      <form onSubmit={handleSaveCredentials} className="space-y-6">
                        <div className="bg-slate-50 border border-border p-5 rounded-2xl space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-[12px] font-bold text-slate-800 uppercase tracking-wider">
                              <Settings className="w-4 h-4 text-accent" />
                              Configuration Guide
                            </div>
                            <span className="px-2 py-0.5 bg-blue-50 text-blue-600 border border-blue-100 text-[9px] font-black uppercase tracking-widest rounded-full">
                              RECOMMENDED
                            </span>
                          </div>
                          <p className="text-[12px] text-text-secondary leading-relaxed">
                            To connect Google Drive, you'll need to create an OAuth Client ID and Secret in the Google Cloud Console. We've built an interactive step-by-step guide to help you do this in 2 minutes.
                          </p>
                          <button
                            type="button"
                            onClick={() => setShowSetupModal(true)}
                            className="w-full flex items-center justify-center gap-2 h-11 border border-accent/20 hover:border-accent bg-accent/5 hover:bg-accent/10 text-accent font-bold rounded-xl text-[12px] uppercase tracking-widest transition-all cursor-pointer"
                          >
                            <HelpCircle className="w-4 h-4" />
                            View Setup Instructions
                          </button>
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
                          <button
                            type="button"
                            onClick={() => setShowSetupModal(true)}
                            className="text-[11px] font-bold text-accent hover:underline flex items-center gap-1 cursor-pointer border-0 bg-transparent p-0"
                          >
                            <HelpCircle className="w-3.5 h-3.5" />
                            View Setup Guide
                          </button>
                          <button
                            onClick={async () => {
                              if (confirm("Reset current credentials?")) {
                                await disconnectGoogleDriveAction();
                                await loadStatus();
                              }
                            }}
                            className="text-[11px] font-bold text-danger hover:underline cursor-pointer border-0 bg-transparent p-0"
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
                  </>
                ) : drawerType === "pusher" ? (
                  /* PUSHER DRAWER CONTENT */
                  <form onSubmit={handleSavePusherCredentials} className="space-y-6">
                    <div className="bg-slate-50 border border-border p-5 rounded-2xl space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[12px] font-bold text-slate-800 uppercase tracking-wider">
                          <Settings className="w-4 h-4 text-accent" />
                          Configuration Guide
                        </div>
                        <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 border border-indigo-100 text-[9px] font-black uppercase tracking-widest rounded-full">
                          RECOMMENDED
                        </span>
                      </div>
                      <p className="text-[12px] text-text-secondary leading-relaxed">
                        To enable real-time collaboration, you can create a free account in Pusher and configure your Channels application. This keeps messages synced across active client browsers instantly.
                      </p>
                      <button
                        type="button"
                        onClick={() => setShowPusherSetupModal(true)}
                        className="w-full flex items-center justify-center gap-2 h-11 border border-accent/20 hover:border-accent bg-accent/5 hover:bg-accent/10 text-accent font-bold rounded-xl text-[12px] uppercase tracking-widest transition-all cursor-pointer"
                      >
                        <HelpCircle className="w-4 h-4" />
                        View Setup Instructions
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest flex items-center gap-1.5">
                          <Key className="w-3 h-3 text-accent" />
                          App ID
                        </label>
                        <input
                          type="text"
                          required
                          value={pusherAppIdInput}
                          onChange={(e) => setPusherAppIdInput(e.target.value)}
                          placeholder="e.g. 2157063"
                          className="w-full h-11 px-4 border border-border rounded-xl text-[13px] text-text-primary focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest flex items-center gap-1.5">
                          <Key className="w-3 h-3 text-accent" />
                          Key
                        </label>
                        <input
                          type="text"
                          required
                          value={pusherKeyInput}
                          onChange={(e) => setPusherKeyInput(e.target.value)}
                          placeholder="e.g. 226eb885d95848fe3c5c"
                          className="w-full h-11 px-4 border border-border rounded-xl text-[13px] text-text-primary focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest flex items-center gap-1.5">
                          <Key className="w-3 h-3 text-accent" />
                          Secret
                        </label>
                        <input
                          type="password"
                          required
                          value={pusherSecretInput}
                          onChange={(e) => setPusherSecretInput(e.target.value)}
                          placeholder="Enter your Pusher App Secret"
                          className="w-full h-11 px-4 border border-border rounded-xl text-[13px] text-text-primary focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest flex items-center gap-1.5">
                          <Key className="w-3 h-3 text-accent" />
                          Cluster
                        </label>
                        <input
                          type="text"
                          required
                          value={pusherClusterInput}
                          onChange={(e) => setPusherClusterInput(e.target.value)}
                          placeholder="e.g. ap2"
                          className="w-full h-11 px-4 border border-border rounded-xl text-[13px] text-text-primary focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSavingPusherConfig}
                      className="w-full flex items-center justify-center gap-2 h-12 bg-accent text-white font-bold rounded-xl text-[12px] uppercase tracking-widest shadow-lg shadow-accent/20 hover:scale-[1.01] transition-all disabled:opacity-50 cursor-pointer"
                    >
                      {isSavingPusherConfig ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        "Save Pusher Configuration"
                      )}
                    </button>
                  </form>
                ) : drawerType === "github" ? (
                  /* GITHUB DRAWER CONTENT */
                  <form onSubmit={handleSaveGithubCredentials} className="space-y-6">
                    <div className="bg-slate-50 border border-border p-5 rounded-2xl space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[12px] font-bold text-slate-800 uppercase tracking-wider">
                          <Settings className="w-4 h-4 text-accent" />
                          GitHub Integration Guide
                        </div>
                        <span className="px-2 py-0.5 bg-neutral-100 text-neutral-800 border border-neutral-200 text-[9px] font-black uppercase tracking-widest rounded-full">
                          RECOMMENDED
                        </span>
                      </div>
                      <p className="text-[12px] text-text-secondary leading-relaxed">
                        To enable the GitHub Developer Suite, create a dedicated GitHub App in your target organization and copy your App ID, Client ID, Client Secret, Org name, and Private Key. We've built a step-by-step setup guide to make this easy.
                      </p>
                      <button
                        type="button"
                        onClick={() => setShowGithubSetupModal(true)}
                        className="w-full flex items-center justify-center gap-2 h-11 border border-accent/20 hover:border-accent bg-accent/5 hover:bg-accent/10 text-accent font-bold rounded-xl text-[12px] uppercase tracking-widest transition-all cursor-pointer"
                      >
                        <HelpCircle className="w-4 h-4" />
                        View Setup Instructions
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest flex items-center gap-1.5">
                          <Key className="w-3 h-3 text-accent" />
                          GitHub App ID
                        </label>
                        <input
                          type="text"
                          required
                          value={githubAppIdInput}
                          onChange={(e) => setGithubAppIdInput(e.target.value)}
                          placeholder="e.g. 1042315"
                          className="w-full h-11 px-4 border border-border rounded-xl text-[13px] text-text-primary focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest flex items-center gap-1.5">
                          <Key className="w-3 h-3 text-accent" />
                          App Client ID
                        </label>
                        <input
                          type="text"
                          required
                          value={githubClientIdInput}
                          onChange={(e) => setGithubClientIdInput(e.target.value)}
                          placeholder="e.g. Iv1.abcdef0123"
                          className="w-full h-11 px-4 border border-border rounded-xl text-[13px] text-text-primary focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest flex items-center gap-1.5">
                          <Key className="w-3 h-3 text-accent" />
                          App Client Secret
                        </label>
                        <div className="relative">
                          <input
                            type={showGithubClientSecret ? "text" : "password"}
                            required
                            value={githubClientSecretInput}
                            onChange={(e) => setGithubClientSecretInput(e.target.value)}
                            placeholder="Enter GitHub App Client Secret"
                            className="w-full h-11 pl-4 pr-10 border border-border rounded-xl text-[13px] text-text-primary focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => setShowGithubClientSecret(!showGithubClientSecret)}
                            className="absolute inset-y-0 right-3 flex items-center text-text-muted hover:text-text-primary transition-colors border-0 bg-transparent p-0 cursor-pointer"
                          >
                            {showGithubClientSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest flex items-center gap-1.5">
                          <Key className="w-3 h-3 text-accent" />
                          GitHub Organization / Owner Name
                        </label>
                        <input
                          type="text"
                          required
                          value={githubOrgNameInput}
                          onChange={(e) => setGithubOrgNameInput(e.target.value)}
                          placeholder="e.g. QuantumBlazeSoftwareSolution"
                          className="w-full h-11 px-4 border border-border rounded-xl text-[13px] text-text-primary focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest flex items-center gap-1.5">
                          <Key className="w-3 h-3 text-accent" />
                          Private Key (PEM block)
                        </label>
                        <div className="relative">
                          <textarea
                            required
                            value={githubPrivateKeyInput}
                            onChange={(e) => setGithubPrivateKeyInput(e.target.value)}
                            placeholder="-----BEGIN RSA PRIVATE KEY-----&#10;...&#10;-----END RSA PRIVATE KEY-----"
                            rows={5}
                            className="w-full p-4 border border-border rounded-xl text-[12px] font-mono text-text-primary focus:border-accent focus:ring-1 focus:ring-accent outline-none resize-none"
                          />
                        </div>
                      </div>
                    </div>

                    {githubInstalledOrgs.length > 0 && (
                      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-[12px] space-y-1">
                        <p className="font-bold text-emerald-800">✓ App Installed & Verified on Orgs:</p>
                        <ul className="list-disc pl-5 text-emerald-700 font-semibold">
                          {githubInstalledOrgs.map((org) => (
                            <li key={org}>{org}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSavingGithubConfig}
                      className="w-full flex items-center justify-center gap-2 h-12 bg-slate-900 text-white font-bold rounded-xl text-[12px] uppercase tracking-widest shadow-lg shadow-slate-950/20 hover:scale-[1.01] transition-all disabled:opacity-50 cursor-pointer"
                    >
                      {isSavingGithubConfig ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        "Save GitHub Suite Configuration"
                      )}
                    </button>
                  </form>
                ) : (
                  /* GEMINI DRAWER CONTENT */
                  <div className="space-y-6">
                    <div className="bg-slate-50 border border-border p-5 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[12px] font-bold text-slate-800 uppercase tracking-wider">
                          <Sparkles className="w-4 h-4 text-teal-600 animate-pulse" />
                          Gemini AI Capabilities
                        </div>
                        <span className="px-2 py-0.5 bg-teal-50 text-teal-600 border border-teal-100 text-[9px] font-black uppercase tracking-widest rounded-full">
                          POWERFUL
                        </span>
                      </div>
                      <p className="text-[12px] text-text-secondary leading-relaxed">
                        Configure your Google Gemini API key to enable secure, lightning-fast intelligence directly within your ERP platform. No third-party servers required.
                      </p>
                    </div>

                    <form onSubmit={handleSaveGeminiCredentials} className="space-y-6">
                      <div className="space-y-4">
                        {/* API Key Input */}
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest flex items-center justify-between">
                            <span className="flex items-center gap-1.5">
                              <Key className="w-3.5 h-3.5 text-teal-600" />
                              Gemini API Key
                            </span>
                            <span className="text-[9px] text-teal-600 font-bold normal-case">
                              <a href="https://aistudio.google.com/" target="_blank" rel="noreferrer" className="hover:underline">
                                Get API Key from Google AI Studio ↗
                              </a>
                            </span>
                          </label>
                          <div className="relative">
                            <input
                              type={showApiKey ? "text" : "password"}
                              required
                              value={geminiApiKeyInput}
                              onChange={(e) => setGeminiApiKeyInput(e.target.value)}
                              placeholder={geminiStatus.isConfigured ? "••••••••••••••••" : "AIzaSy..."}
                              className="w-full h-11 pl-4 pr-10 border border-border rounded-xl text-[13px] text-text-primary focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => setShowApiKey(!showApiKey)}
                              className="absolute inset-y-0 right-3 flex items-center text-text-muted hover:text-text-primary cursor-pointer border-0 bg-transparent p-0"
                            >
                              {showApiKey ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Model Dropdown Selection */}
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest flex items-center justify-between gap-1.5 w-full">
                            <span className="flex items-center gap-1.5">
                              <Settings className="w-3.5 h-3.5 text-teal-600" />
                              Baseline AI Model
                            </span>
                            {isLoadingGeminiModels && (
                              <span className="text-[9px] text-teal-600 flex items-center gap-1 normal-case font-semibold animate-pulse">
                                <RefreshCw className="w-3 h-3 animate-spin" /> Fetching available models...
                              </span>
                            )}
                          </label>
                          <div className="relative">
                            <select
                              value={geminiBaseModelInput}
                              onChange={(e) => setGeminiBaseModelInput(e.target.value)}
                              className="w-full bg-white border border-border rounded-xl px-4 h-11 text-[13px] text-text-primary focus:border-teal-500 outline-none appearance-none cursor-pointer"
                              disabled={isLoadingGeminiModels}
                            >
                              {availableGeminiModels.length > 0 ? (
                                availableGeminiModels.map((m) => (
                                  <option key={m.id} value={m.id}>
                                    {m.displayName}
                                  </option>
                                ))
                              ) : (
                                <>
                                  <option value="gemini-2.0-flash">gemini-2.0-flash (Recommended, Fast & Smart)</option>
                                  <option value="gemini-2.5-flash">gemini-2.5-flash (Enhanced Capabilities)</option>
                                  <option value="gemini-1.5-flash">gemini-1.5-flash (Legacy Lightweight)</option>
                                  <option value="gemini-1.5-pro">gemini-1.5-pro (Deep Reasoning & Analysis)</option>
                                </>
                              )}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-text-muted">
                              ▼
                            </div>
                          </div>
                          {availableGeminiModels.length > 0 && (
                            <p className="text-[10px] text-emerald-600 font-medium">
                              ✓ Dynamically listed models verified for your specific API key.
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Connection Test Results */}
                      {testResult && (
                        <div
                          className={cn(
                            "flex items-start gap-3 p-4 rounded-xl text-[12px] font-bold border leading-relaxed",
                            testResult.success
                              ? "bg-emerald-50 border-emerald-100 text-emerald-600"
                              : "bg-danger/10 border-danger/20 text-danger"
                          )}
                        >
                          {testResult.success ? (
                            <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                          ) : (
                            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                          )}
                          <div>
                            <p className="font-extrabold">{testResult.success ? "Connection Check Passed!" : "Connection Check Failed"}</p>
                            <p className="text-[11px] font-normal mt-0.5 text-text-secondary">{testResult.message}</p>
                          </div>
                        </div>
                      )}

                      {/* Control Action Buttons */}
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={handleTestGeminiConnection}
                          disabled={isTestingGeminiConnection || !geminiApiKeyInput}
                          className="flex-1 flex items-center justify-center gap-2 h-12 border border-border hover:border-text-secondary text-text-primary font-bold rounded-xl text-[11px] uppercase tracking-widest transition-all disabled:opacity-50 cursor-pointer bg-white"
                        >
                          {isTestingGeminiConnection ? (
                            <RefreshCw className="w-4 h-4 animate-spin text-teal-600" />
                          ) : (
                            "Test Connection"
                          )}
                        </button>

                        <button
                          type="submit"
                          disabled={isSavingGeminiConfig || !geminiApiKeyInput}
                          className="flex-1 flex items-center justify-center gap-2 h-12 bg-teal-600 text-white font-bold rounded-xl text-[11px] uppercase tracking-widest shadow-lg shadow-teal-600/20 hover:bg-teal-700 transition-all disabled:opacity-50 cursor-pointer"
                        >
                          {isSavingGeminiConfig ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            "Save Settings"
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>

              {/* Drawer Footer Actions */}
              {drawerType === "gdrive" && gdriveStatus.isConnected && (
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

              {drawerType === "pusher" && pusherStatus.isConfigured && (
                <div className="pt-6 border-t border-divider mt-auto">
                  <button
                    onClick={handleDisconnectPusher}
                    disabled={isDisconnectingPusher}
                    className="w-full flex items-center justify-center gap-2 h-12 border border-danger/25 text-danger/80 hover:text-white hover:bg-danger hover:border-transparent font-bold rounded-xl text-[12px] uppercase tracking-widest transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isDisconnectingPusher ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4" />
                        Disconnect Pusher Channels
                      </>
                    )}
                  </button>
                </div>
              )}

              {drawerType === "gemini" && geminiStatus.isConfigured && (
                <div className="pt-6 border-t border-divider mt-auto space-y-4">
                  {/* Knowledge Base Stats */}
                  <div className="bg-page-bg border border-divider rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-bold text-text-muted uppercase tracking-wider flex items-center gap-1.5">
                        <span>📚</span> Knowledge Base
                      </p>
                      <a
                        href="/dashboard/knowledge-base"
                        className="text-[10px] font-bold text-accent hover:underline uppercase tracking-wider flex items-center gap-1"
                      >
                        Manage →
                      </a>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white border border-divider rounded-lg p-3 text-center">
                        <p className="text-xl font-bold text-text-primary">{kbStats?.docCount ?? "—"}</p>
                        <p className="text-[10px] text-text-muted uppercase tracking-wider">Documents</p>
                      </div>
                      <div className="bg-white border border-divider rounded-lg p-3 text-center">
                        <p className="text-xl font-bold text-text-primary">{kbStats?.chunkCount ?? "—"}</p>
                        <p className="text-[10px] text-text-muted uppercase tracking-wider">Vector Chunks</p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleDisconnectGemini}
                    disabled={isDisconnectingGemini}
                    className="w-full flex items-center justify-center gap-2 h-12 border border-danger/25 text-danger/80 hover:text-white hover:bg-danger hover:border-transparent font-bold rounded-xl text-[12px] uppercase tracking-widest transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isDisconnectingGemini ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4" />
                        Disconnect Gemini AI
                      </>
                    )}
                  </button>
                </div>
              )}

              {drawerType === "github" && githubStatus.isConfigured && (
                <div className="pt-6 border-t border-divider mt-auto">
                  <button
                    onClick={handleDisconnectGithub}
                    disabled={isDisconnectingGithub}
                    className="w-full flex items-center justify-center gap-2 h-12 border border-danger/25 text-danger/80 hover:text-white hover:bg-danger hover:border-transparent font-bold rounded-xl text-[12px] uppercase tracking-widest transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isDisconnectingGithub ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4" />
                        Disconnect GitHub Developer Suite
                      </>
                    )}
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Setup Instructions Popup Modal */}
      <AnimatePresence>
        {showSetupModal && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
            {/* Modal Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSetupModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />

            {/* Modal Container Panel */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative max-w-2xl w-full bg-white border border-border rounded-3xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden z-[2001]"
            >
              {/* Header */}
              <div className="p-6 md:p-8 border-b border-divider flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-50 border border-blue-100 rounded-2xl text-blue-500">
                    <Settings className="w-5 h-5 animate-spin-slow" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-text-primary">Google Cloud Configuration</h3>
                    <p className="text-[11px] text-text-muted uppercase tracking-widest font-black">2-Minute Setup Steps</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowSetupModal(false)}
                  className="p-2 rounded-xl hover:bg-page-bg text-text-muted hover:text-text-primary transition-all cursor-pointer border-0 bg-transparent"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Steps Scroll Area */}
              <div className="p-6 md:p-8 overflow-y-auto space-y-6 custom-scrollbar flex-1 text-[13px] text-text-secondary leading-relaxed">
                {/* Step 1 */}
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm shrink-0">
                    1
                  </div>
                  <div className="space-y-1.5 pt-0.5">
                    <h4 className="font-bold text-text-primary text-[14px]">Create a Google Cloud Project</h4>
                    <p>
                      Go to the <a href="https://console.cloud.google.com/" target="_blank" rel="noreferrer" className="text-blue-500 font-bold hover:underline">Google Cloud Console</a>. Click the project selector dropdown at the top, select <strong>"New Project"</strong>, name it <code>QuantumBlaze ERP Sync</code>, and click <strong>Create</strong>.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm shrink-0">
                    2
                  </div>
                  <div className="space-y-1.5 pt-0.5">
                    <h4 className="font-bold text-text-primary text-[14px]">Enable the Google Drive API</h4>
                    <p>
                      Search for <strong>"Google Drive API"</strong> in the top search bar, click on it, and click the blue <strong>"Enable"</strong> button to enable cloud file synchronizations.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm shrink-0">
                    3
                  </div>
                  <div className="space-y-1.5 pt-0.5">
                    <h4 className="font-bold text-text-primary text-[14px]">Configure OAuth Consent Screen & Scopes</h4>
                    <p>
                      Go to <strong>"OAuth consent screen"</strong> inside the left navigation pane. Set User Type to <strong>"External"</strong> and fill out the required App details.
                    </p>
                    <ul className="list-disc pl-5 space-y-1.5 mt-2 text-text-muted">
                      <li><strong>Scopes</strong>: Add the <code className="bg-slate-100 px-1.5 py-0.5 rounded text-accent font-bold font-mono">.../auth/drive.file</code> scope (this lets the app read and write files).</li>
                      <li><strong>Test Users (CRITICAL)</strong>: Add your personal Google/Gmail account under the test users section so you can authenticate during testing without needing Google's review.</li>
                    </ul>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm shrink-0">
                    4
                  </div>
                  <div className="space-y-3 pt-0.5 w-full">
                    <div className="space-y-1">
                      <h4 className="font-bold text-text-primary text-[14px]">Create OAuth Credentials</h4>
                      <p>
                        Go to the <strong>"Credentials"</strong> tab, click <strong>"+ Create Credentials"</strong> and select <strong>"OAuth client ID"</strong>. Select <strong>"Web application"</strong> as the Application Type.
                      </p>
                    </div>
                    
                    {/* Copy Box */}
                    <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-2xl space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-black text-blue-600 uppercase tracking-widest">
                        Authorized Redirect URI
                        <button
                          type="button"
                          onClick={copyRedirectUri}
                          className="text-[10px] font-bold bg-white border border-blue-200 hover:border-blue-400 text-blue-600 hover:text-blue-700 px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                        >
                          {copied ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              Copy Link
                            </>
                          )}
                        </button>
                      </div>
                      <div className="p-3 bg-white border border-border rounded-xl text-[11px] font-mono text-text-primary break-all select-all">
                        {clientOrigin || "http://localhost:3000"}/api/auth/callback/google-drive
                      </div>
                      <p className="text-[10px] text-text-muted">
                        Paste the exact link above into the <strong>"Authorized redirect URIs"</strong> section in your Google Cloud Console.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Step 5 */}
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm shrink-0">
                    5
                  </div>
                  <div className="space-y-1.5 pt-0.5">
                    <h4 className="font-bold text-text-primary text-[14px]">Connect and Sync!</h4>
                    <p>
                      Copy your generated <strong>Client ID</strong> and <strong>Client Secret</strong>, paste them into this drawer, click save, and click the connect button. You're fully ready!
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-divider bg-slate-50 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowSetupModal(false)}
                  className="px-6 h-11 bg-slate-900 hover:bg-slate-800 text-white font-bold text-[12px] uppercase tracking-widest rounded-xl hover:scale-[1.01] transition-all cursor-pointer border-0"
                >
                  Got It, Let's Setup!
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Pusher Setup Instructions Popup Modal */}
      <AnimatePresence>
        {showPusherSetupModal && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
            {/* Modal Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPusherSetupModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />

            {/* Modal Container Panel */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative max-w-2xl w-full bg-white border border-border rounded-3xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden z-[2001]"
            >
              {/* Header */}
              <div className="p-6 md:p-8 border-b border-divider flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-50 border border-purple-100 rounded-2xl text-purple-500">
                    <Settings className="w-5 h-5 animate-spin-slow" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-text-primary">Pusher Channels Configuration</h3>
                    <p className="text-[11px] text-text-muted uppercase tracking-widest font-black">2-Minute Setup Steps</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPusherSetupModal(false)}
                  className="p-2 rounded-xl hover:bg-page-bg text-text-muted hover:text-text-primary transition-all cursor-pointer border-0 bg-transparent"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Steps Scroll Area */}
              <div className="p-6 md:p-8 overflow-y-auto space-y-6 custom-scrollbar flex-1 text-[13px] text-text-secondary leading-relaxed">
                {/* Step 1 */}
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 font-bold text-sm shrink-0">
                    1
                  </div>
                  <div className="space-y-1.5 pt-0.5">
                    <h4 className="font-bold text-text-primary text-[14px]">Create a Pusher Account</h4>
                    <p>
                      Go to the <a href="https://dashboard.pusher.com/" target="_blank" rel="noreferrer" className="text-purple-500 font-bold hover:underline">Pusher Dashboard</a>. Sign up for a free account (no credit card required) or sign in to your existing account.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 font-bold text-sm shrink-0">
                    2
                  </div>
                  <div className="space-y-1.5 pt-0.5">
                    <h4 className="font-bold text-text-primary text-[14px]">Create a Channels App</h4>
                    <p>
                      Inside the Pusher Console, go to <strong>"Channels"</strong> in the sidebar. Click on the <strong>"Create app"</strong> button. Name your application (e.g. <code>QuantumBlaze ERP Chat</code>) and choose a cluster close to you (e.g. <code>ap2</code> for Mumbai/Colombo/Asia).
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 font-bold text-sm shrink-0">
                    3
                  </div>
                  <div className="space-y-1.5 pt-0.5">
                    <h4 className="font-bold text-text-primary text-[14px]">Go to "App Keys" Section</h4>
                    <p>
                      Once the app is created, navigate to the <strong>"App Keys"</strong> tab in the left-hand navigation menu of your Pusher app.
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 font-bold text-sm shrink-0">
                    4
                  </div>
                  <div className="space-y-3 pt-0.5 w-full">
                    <div className="space-y-1">
                      <h4 className="font-bold text-text-primary text-[14px]">Copy Credentials</h4>
                      <p>
                        You will see code blocks containing:
                      </p>
                    </div>
                    <ul className="list-disc pl-5 space-y-1.5 text-text-muted">
                      <li><code>app_id</code>: Your unique Pusher application identification</li>
                      <li><code>key</code>: The public client API key</li>
                      <li><code>secret</code>: Your private server API signature</li>
                      <li><code>cluster</code>: The regional server network cluster</li>
                    </ul>
                  </div>
                </div>

                {/* Step 5 */}
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 font-bold text-sm shrink-0">
                    5
                  </div>
                  <div className="space-y-1.5 pt-0.5">
                    <h4 className="font-bold text-text-primary text-[14px]">Save and Start Collaborating!</h4>
                    <p>
                      Paste all four parameters into the drawer configuration panel and click save. The ERP will immediately activate real-time syncing!
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-divider bg-slate-50 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowPusherSetupModal(false)}
                  className="px-6 h-11 bg-slate-900 hover:bg-slate-800 text-white font-bold text-[12px] uppercase tracking-widest rounded-xl hover:scale-[1.01] transition-all cursor-pointer border-0"
                >
                  Got It, Let's Setup!
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* GitHub Setup Instructions Popup Modal */}
      <AnimatePresence>
        {showGithubSetupModal && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
            {/* Modal Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowGithubSetupModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />

            {/* Modal Container Panel */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative max-w-2xl w-full bg-white border border-border rounded-3xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden z-[2001]"
            >
              {/* Header */}
              <div className="p-6 md:p-8 border-b border-divider flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-neutral-100 border border-neutral-200 rounded-2xl text-neutral-800">
                    <GitBranch className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-text-primary">GitHub App Developer Suite</h3>
                    <p className="text-[11px] text-text-muted uppercase tracking-widest font-black">Step-by-Step Setup Guide</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowGithubSetupModal(false)}
                  className="p-2 rounded-xl hover:bg-page-bg text-text-muted hover:text-text-primary transition-all cursor-pointer border-0 bg-transparent"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Steps Scroll Area */}
              <div className="p-6 md:p-8 overflow-y-auto space-y-6 custom-scrollbar flex-1 text-[13px] text-text-secondary leading-relaxed">
                {/* Step 1 */}
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-800 font-bold text-sm shrink-0">
                    1
                  </div>
                  <div className="space-y-1.5 pt-0.5">
                    <h4 className="font-bold text-text-primary text-[14px]">Create a New GitHub App</h4>
                    <p>
                      Navigate to your GitHub organization's developer settings page (e.g. <code>https://github.com/organizations/YOUR_ORG/settings/apps</code>) or your personal developer settings if running individually. Click **"New GitHub App"**.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-800 font-bold text-sm shrink-0">
                    2
                  </div>
                  <div className="space-y-1.5 pt-0.5">
                    <h4 className="font-bold text-text-primary text-[14px]">Set App Name & Homepage URL</h4>
                    <p>
                      Choose a descriptive name for your application (e.g. <code>QuantumBlaze ERP Suite</code>). Set the **Homepage URL** to your ERP instance domain or <code>http://localhost:3000</code> for local developer environments.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-800 font-bold text-sm shrink-0">
                    3
                  </div>
                  <div className="space-y-3 pt-0.5 w-full">
                    <div className="space-y-1">
                      <h4 className="font-bold text-text-primary text-[14px]">Configure OAuth & Callback URL</h4>
                      <p>
                        Enable **"User authorization response (OAuth)"**. Set the **Callback URL** to the exact authorization callback below:
                      </p>
                    </div>

                    {/* Copy Box */}
                    <div className="bg-neutral-50 border border-neutral-200 p-4 rounded-2xl space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-black text-neutral-700 uppercase tracking-widest">
                        GitHub OAuth Callback URL
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(`${clientOrigin || window.location.origin}/api/auth/github/callback`);
                            setCopied(true);
                            setTimeout(() => setCopied(false), 2000);
                          }}
                          className="text-[10px] font-bold bg-white border border-neutral-300 hover:border-neutral-400 text-neutral-800 px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                        >
                          {copied ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              Copy Link
                            </>
                          )}
                        </button>
                      </div>
                      <div className="p-3 bg-white border border-border rounded-xl text-[11px] font-mono text-text-primary break-all select-all">
                        {clientOrigin || "http://localhost:3000"}/api/auth/github/callback
                      </div>
                      <p className="text-[10px] text-text-muted">
                        Check the box for <strong>"Request user authorization (OAuth) during installation"</strong> right below the callback URL.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-800 font-bold text-sm shrink-0">
                    4
                  </div>
                  <div className="space-y-1.5 pt-0.5">
                    <h4 className="font-bold text-text-primary text-[14px]">Set Permissions & Webhook Events</h4>
                    <p>
                      Under **"Permissions & events"**, set the following access scopes:
                    </p>
                    <ul className="list-disc pl-5 mt-2 space-y-2 text-text-secondary font-medium">
                      <li>
                        <strong>Repository Permissions</strong>:
                        <ul className="list-circle pl-5 mt-1 text-text-muted space-y-0.5">
                          <li><strong>Administration</strong>: <code className="bg-slate-100 text-slate-800 px-1 py-0.5 rounded text-[11px]">Read & Write</code> (for repository provisioning & collaborator management)</li>
                          <li><strong>Contents</strong>: <code className="bg-slate-100 text-slate-800 px-1 py-0.5 rounded text-[11px]">Read & Write</code> (for git branch operations & code commits)</li>
                          <li><strong>Issues</strong>: <code className="bg-slate-100 text-slate-800 px-1 py-0.5 rounded text-[11px]">Read & Write</code> (for task ticket syncing)</li>
                          <li><strong>Pull Requests</strong>: <code className="bg-slate-100 text-slate-800 px-1 py-0.5 rounded text-[11px]">Read & Write</code> (for PR merges)</li>
                        </ul>
                      </li>
                      <li>
                        <strong>Organization Permissions</strong>:
                        <ul className="list-circle pl-5 mt-1 text-text-muted space-y-0.5">
                          <li><strong>Members</strong>: <code className="bg-slate-100 text-slate-800 px-1 py-0.5 rounded text-[11px]">Read-only</code> (to fetch collaborator profiles)</li>
                        </ul>
                      </li>
                      <li>
                        <strong>Webhook Events (at the bottom)</strong>:
                        <ul className="list-circle pl-5 mt-1 text-text-muted space-y-0.5">
                          <li>Check <strong>"Push"</strong>, <strong>"Pull request"</strong>, and <strong>"Issues"</strong> events to receive real-time webhook timeline logs.</li>
                        </ul>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Step 5 */}
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-800 font-bold text-sm shrink-0">
                    5
                  </div>
                  <div className="space-y-1.5 pt-0.5">
                    <h4 className="font-bold text-text-primary text-[14px]">Generate and Download Private Credentials</h4>
                    <p>
                      Click **"Create GitHub App"**. On your new App dashboard page, save these credentials:
                    </p>
                    <ul className="list-disc pl-5 mt-2 space-y-1 text-text-muted">
                      <li>Copy the <strong>App ID</strong> and <strong>Client ID</strong>.</li>
                      <li>Click <strong>"Generate a new client secret"</strong> and copy the generated secret key.</li>
                      <li>Scroll down, click <strong>"Generate a private key"</strong>. Open the downloaded <code>.pem</code> file in a text editor, and copy the full text starting with <code>-----BEGIN RSA PRIVATE KEY-----</code>.</li>
                    </ul>
                  </div>
                </div>

                {/* Step 6 */}
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-800 font-bold text-sm shrink-0">
                    6
                  </div>
                  <div className="space-y-1.5 pt-0.5">
                    <h4 className="font-bold text-text-primary text-[14px]">Install the App onto your Organization</h4>
                    <p>
                      In the left side panel of your GitHub App settings, click **"Install App"**, and install it onto your target Organization. Finally, enter your Organization name as the <strong>Organization / Owner Name</strong> in this configuration form alongside your credentials. You are all set!
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-divider bg-slate-50 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowGithubSetupModal(false)}
                  className="px-6 h-11 bg-slate-900 hover:bg-slate-800 text-white font-bold text-[12px] uppercase tracking-widest rounded-xl hover:scale-[1.01] transition-all cursor-pointer border-0"
                >
                  Got It, Let's Setup!
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
