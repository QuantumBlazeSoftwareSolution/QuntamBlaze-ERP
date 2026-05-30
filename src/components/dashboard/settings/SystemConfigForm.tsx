"use client";

import React, { useState, useEffect } from "react";
import { useSystemConfig } from "@/hooks/useSystemConfig";
import { Globe, DollarSign, Save, Loader2, Check, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CountryOption {
  name: string;
  code: string;
  flag?: string;
}

interface CurrencyOption {
  code: string;
  symbol: string;
  name: string;
}

// Robust static fallbacks in case the public REST countries API fails or is slow
const STATIC_COUNTRIES: CountryOption[] = [
  { name: "Sri Lanka", code: "LK" },
  { name: "United States", code: "US" },
  { name: "United Kingdom", code: "GB" },
  { name: "Australia", code: "AU" },
  { name: "India", code: "IN" },
  { name: "Germany", code: "DE" },
  { name: "Canada", code: "CA" },
  { name: "Singapore", code: "SG" },
  { name: "Japan", code: "JP" },
  { name: "United Arab Emirates", code: "AE" },
];

const STATIC_CURRENCIES: CurrencyOption[] = [
  { code: "LKR", symbol: "Rs.", name: "Sri Lankan Rupee" },
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
];

export function SystemConfigForm() {
  const { currency, country, updateConfig } = useSystemConfig();

  // Selected states
  const [selectedCountryCode, setSelectedCountryCode] = useState(country.code);
  const [selectedCurrencyCode, setSelectedCurrencyCode] = useState(currency.code);

  // Lists loaded from API
  const [countries, setCountries] = useState<CountryOption[]>(STATIC_COUNTRIES);
  const [currencies, setCurrencies] = useState<CurrencyOption[]>(STATIC_CURRENCIES);
  const [loadingLists, setLoadingLists] = useState(false);

  // Form submit states
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // Sync state with global config when it loads
  useEffect(() => {
    if (country.code) setSelectedCountryCode(country.code);
    if (currency.code) setSelectedCurrencyCode(currency.code);
  }, [country, currency]);

  // Fetch list of countries and currencies from public REST Countries API
  useEffect(() => {
    async function fetchCountriesAndCurrencies() {
      setLoadingLists(true);
      try {
        const response = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,cca2,currencies,flags"
        );
        if (!response.ok) throw new Error("API response error");

        const data = await response.json();

        const countryList: CountryOption[] = [];
        const currencyMap = new Map<string, CurrencyOption>();

        // Always put defaults/popular currencies in map first to preserve nice sorting/symbols
        STATIC_CURRENCIES.forEach((curr) => currencyMap.set(curr.code, curr));

        data.forEach((item: any) => {
          // Parse Country
          const countryName = item.name?.common;
          const countryCode = item.cca2;
          const countryFlag = item.flags?.png;

          if (countryName && countryCode) {
            countryList.push({
              name: countryName,
              code: countryCode,
              flag: countryFlag,
            });
          }

          // Parse Currencies
          const currs = item.currencies;
          if (currs) {
            Object.keys(currs).forEach((code) => {
              if (code && !currencyMap.has(code)) {
                currencyMap.set(code, {
                  code,
                  symbol: currs[code].symbol || code,
                  name: currs[code].name || code,
                });
              }
            });
          }
        });

        // Sort lists alphabetically
        countryList.sort((a, b) => a.name.localeCompare(b.name));
        const currencyList = Array.from(currencyMap.values()).sort((a, b) =>
          a.code.localeCompare(b.code)
        );

        if (countryList.length > 0) setCountries(countryList);
        if (currencyList.length > 0) setCurrencies(currencyList);
      } catch (err) {
        console.warn(
          "RestCountries API failed, proceeding with high-quality static fallbacks.",
          err
        );
        // Fallbacks already set as initial states
      } finally {
        setLoadingLists(false);
      }
    }

    fetchCountriesAndCurrencies();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveStatus("idle");
    setErrorMessage("");

    try {
      // Find matching object templates
      const targetCountryObj =
        countries.find((c) => c.code === selectedCountryCode) ||
        STATIC_COUNTRIES.find((c) => c.code === selectedCountryCode);
      const targetCurrencyObj =
        currencies.find((c) => c.code === selectedCurrencyCode) ||
        STATIC_CURRENCIES.find((c) => c.code === selectedCurrencyCode);

      if (!targetCountryObj || !targetCurrencyObj) {
        throw new Error("Invalid country or currency selection.");
      }

      // Save configurations using server actions through useSystemConfig context provider
      const countrySaved = await updateConfig("country", {
        name: targetCountryObj.name,
        code: targetCountryObj.code,
      });

      const currencySaved = await updateConfig("currency", {
        code: targetCurrencyObj.code,
        symbol: targetCurrencyObj.symbol,
        name: targetCurrencyObj.name,
      });

      if (countrySaved && currencySaved) {
        setSaveStatus("success");
        setTimeout(() => setSaveStatus("idle"), 3000);
      } else {
        throw new Error("Failed to write configurations to database store.");
      }
    } catch (err: any) {
      console.error(err);
      setSaveStatus("error");
      setErrorMessage(err.message || "An error occurred while saving system settings.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <form onSubmit={handleSave} className="space-y-8">
        {/* Host Country & Localization */}
        <div className="bg-white border border-border rounded-2xl p-8 space-y-6 shadow-sm relative overflow-hidden">
          <div className="flex items-center gap-3 mb-2">
            <Globe className="w-5 h-5 text-accent" />
            <h3 className="text-xl font-bold text-text-primary">Enterprise Hosting Identity</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-text-muted uppercase tracking-widest">
                System Host Country
              </label>
              <div className="relative">
                <select
                  value={selectedCountryCode}
                  onChange={(e) => setSelectedCountryCode(e.target.value)}
                  className="w-full bg-white border border-border rounded-xl px-4 py-4 text-[13px] text-text-primary focus:border-accent outline-none focus:ring-1 focus:ring-accent appearance-none"
                >
                  {countries.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name} ({c.code})
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-text-muted">
                  ▼
                </div>
              </div>
              <p className="text-[11px] text-text-muted">
                Configures the geographic operational jurisdiction of the enterprise client.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-text-muted uppercase tracking-widest">
                API Fetch Status
              </label>
              <div className="flex items-center gap-2 border border-border rounded-xl p-4 bg-page-bg/40 text-[12px] text-text-secondary">
                {loadingLists ? (
                  <>
                    <Loader2 className="w-4 h-4 text-accent animate-spin" />
                    <span>Syncing international records from REST Countries API...</span>
                  </>
                ) : (
                  <>
                    <div className="w-2.5 h-2.5 rounded-full bg-success animate-pulse" />
                    <span>
                      Loaded {countries.length} countries and {currencies.length} active global
                      currencies.
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Base Currency & Format settings */}
        <div className="bg-white border border-border rounded-2xl p-8 space-y-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="w-5 h-5 text-accent" />
            <h3 className="text-xl font-bold text-text-primary">System Base Currency</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-text-muted uppercase tracking-widest">
                Base Currency Symbol & Code
              </label>
              <div className="relative">
                <select
                  value={selectedCurrencyCode}
                  onChange={(e) => setSelectedCurrencyCode(e.target.value)}
                  className="w-full bg-white border border-border rounded-xl px-4 py-4 text-[13px] text-text-primary focus:border-accent outline-none focus:ring-1 focus:ring-accent appearance-none"
                >
                  {currencies.map((curr) => (
                    <option key={curr.code} value={curr.code}>
                      {curr.code} ({curr.symbol}) - {curr.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-text-muted">
                  ▼
                </div>
              </div>
              <p className="text-[11px] text-text-muted">
                Configures the currency prefix/symbol dynamically rendered across all global project
                budget matrices.
              </p>
            </div>

            <div className="flex flex-col justify-center border border-border rounded-xl p-5 bg-page-bg/30">
              <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-2">
                Real-Time Formatting Preview
              </span>
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <p className="text-[11px] text-text-muted">Compact Budget Column:</p>
                  <p className="text-[11px] text-text-muted">Full Amount Display:</p>
                </div>
                <div className="text-right font-mono font-bold text-text-primary">
                  {/* Derive current format values dynamically */}
                  {(() => {
                    const tempCurr =
                      currencies.find((c) => c.code === selectedCurrencyCode) ||
                      STATIC_CURRENCIES[0];
                    const symbol = tempCurr.symbol;
                    const space = symbol.endsWith(".") || symbol.length > 1 ? " " : "";
                    return (
                      <>
                        <p className="text-accent">
                          {symbol}
                          {space}23k / {symbol}
                          {space}2.1M
                        </p>
                        <p className="text-text-secondary">
                          {symbol}
                          {space}23,000.00
                        </p>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notification overlays */}
        <AnimatePresence mode="wait">
          {saveStatus === "success" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-3 bg-success/10 border border-success/30 text-success px-6 py-4 rounded-xl text-[13px] font-bold shadow-sm"
            >
              <Check className="w-4 h-4 flex-shrink-0" />
              <span>
                System configurations successfully updated! Dynamic currency format applied
                instantly system-wide.
              </span>
            </motion.div>
          )}

          {saveStatus === "error" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-3 bg-danger/10 border border-danger/30 text-danger px-6 py-4 rounded-xl text-[13px] font-bold shadow-sm"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>Error: {errorMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form Actions */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => {
              setSelectedCountryCode(country.code);
              setSelectedCurrencyCode(currency.code);
            }}
            className="px-8 py-4 text-[14px] font-bold text-text-muted hover:text-text-primary transition-colors cursor-pointer"
          >
            Reset Form
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-10 py-4 bg-accent/10 border border-accent/30 text-accent font-bold rounded-xl hover:bg-accent/20 transition-all cursor-pointer disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Configuration
          </button>
        </div>
      </form>
    </div>
  );
}
