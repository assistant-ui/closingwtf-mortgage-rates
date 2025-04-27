"use client";

import { useComposerRuntime } from "@assistant-ui/react";
import { createContext, useContext, useState, useEffect } from "react";

type ZipData = {
  zip: number;
  countyName: string;
  state: string;
  stCountyFp: number;
  classFp: string;
} | null | undefined;

interface ZipContextType {
  zipData: ZipData;
  setZipData: (data: ZipData) => void;
}

const ZipContext = createContext<ZipContextType | undefined>(undefined);

const STORAGE_KEY = "mortgage-copilot-zip-data";
 
export const DEFAULT_ZIP_DATA = {
  zip: 45237,
  countyName: "Hamilton",
  state: "Ohio",
  stCountyFp: 39061,
  classFp: "H1"
};
export function ZipProvider({ children }: { children: React.ReactNode }) {
  const [zipData, setZipDataState] = useState<ZipData>(DEFAULT_ZIP_DATA);
  const [isInitialized, setIsInitialized] = useState(false);
  const composerRuntime = useComposerRuntime();

  // Load initial data from localStorage
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        setZipDataState(JSON.parse(savedData));
      } else {
        // Set default zip data if none is found
        setZipDataState(DEFAULT_ZIP_DATA);
      }
    } catch (error) {
      console.error("Failed to load zip data from localStorage:", error);
        setZipDataState(DEFAULT_ZIP_DATA);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Update composerRuntime config on initialization and whenever zipData changes
  useEffect(() => {
    if (!isInitialized) return;
    composerRuntime.setRunConfig({
      custom: { zipCode: zipData }
    });
  }, [isInitialized, zipData, composerRuntime]);

  // Wrapper function to update both state and localStorage
  const setZipData = (data: ZipData) => {
    setZipDataState(data);
    try {
      if (data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        // Update composerRuntime config with new zip code
        composerRuntime.setRunConfig({
          custom: {zipCode: zipData}
        });
      } else {
        localStorage.removeItem(STORAGE_KEY);
        // Optionally clear zipCode from composerRuntime config if needed
        composerRuntime.setRunConfig({
          custom: { zipCode: DEFAULT_ZIP_DATA }
        });
      }
    } catch (error) {
      console.error("Failed to save zip data to localStorage:", error);
    }
  };

  return (
    <ZipContext.Provider value={{ zipData, setZipData }}>
      {isInitialized ? children : null}
    </ZipContext.Provider>
  );
}

export function useZip() {
  const context = useContext(ZipContext);
  if (context === undefined) {
    throw new Error("useZip must be used within a ZipProvider");
  }
  return context;
} 