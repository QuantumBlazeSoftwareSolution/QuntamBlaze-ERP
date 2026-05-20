"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { getSystemConfigsAction, saveSystemConfigAction } from "@/app/actions/config";

interface CurrencyConfig {
  code: string;
  symbol: string;
  name: string;
}

interface CountryConfig {
  name: string;
  code: string;
}

interface SystemConfigContextType {
  currency: CurrencyConfig;
  country: CountryConfig;
  loading: boolean;
  refreshConfigs: () => Promise<void>;
  updateConfig: (key: string, value: any) => Promise<boolean>;
  formatCurrency: (amount: number | string, isCompact?: boolean) => string;
}

const SystemConfigContext = createContext<SystemConfigContextType | undefined>(undefined);

export function SystemConfigProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<CurrencyConfig>({
    code: "LKR",
    symbol: "Rs.",
    name: "Sri Lankan Rupee",
  });
  const [country, setCountry] = useState<CountryConfig>({
    name: "Sri Lanka",
    code: "LK",
  });
  const [loading, setLoading] = useState(true);

  const refreshConfigs = async () => {
    try {
      const res = await getSystemConfigsAction();
      if (res.success && res.configs) {
        if (res.configs.currency) setCurrency(res.configs.currency);
        if (res.configs.country) setCountry(res.configs.country);
      }
    } catch (err) {
      console.error("Error refreshing system configurations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshConfigs();
  }, []);

  const updateConfig = async (key: string, value: any) => {
    try {
      const res = await saveSystemConfigAction(key, value);
      if (res.success) {
        if (key === "currency") setCurrency(value);
        if (key === "country") setCountry(value);
        return true;
      }
      return false;
    } catch (err) {
      console.error(`Error updating system configuration for ${key}:`, err);
      return false;
    }
  };

  const formatCurrency = (amount: number | string, isCompact = false) => {
    const value = Number(amount || 0);
    const symbol = currency.symbol || "Rs.";
    const space = symbol.endsWith(".") || symbol.length > 1 ? " " : "";

    if (isCompact) {
      if (value >= 1000000) {
        return `${symbol}${space}${(value / 1000000).toFixed(1)}M`;
      }
      if (value >= 1000) {
        return `${symbol}${space}${(value / 1000).toFixed(0)}k`;
      }
      return `${symbol}${space}${value.toLocaleString()}`;
    }

    return `${symbol}${space}${value.toLocaleString()}`;
  };

  return (
    <SystemConfigContext.Provider
      value={{
        currency,
        country,
        loading,
        refreshConfigs,
        updateConfig,
        formatCurrency,
      }}
    >
      {children}
    </SystemConfigContext.Provider>
  );
}

export function useSystemConfig() {
  const context = useContext(SystemConfigContext);
  if (context === undefined) {
    throw new Error("useSystemConfig must be used within a SystemConfigProvider");
  }
  return context;
}
