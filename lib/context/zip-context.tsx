"use client";

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
 

export function ZipProvider({ children }: { children: React.ReactNode }) {
  const [zipData, setZipDataState] = useState<ZipData>(undefined);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load initial data from localStorage
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        setZipDataState(JSON.parse(savedData));
      } else {
        setZipDataState(null);
      }
    } catch (error) {
      console.error("Failed to load zip data from localStorage:", error);
      setZipDataState(null);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Wrapper function to update both state and localStorage
  const setZipData = (data: ZipData) => {
    setZipDataState(data);
    try {
      if (data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } else {
        localStorage.removeItem(STORAGE_KEY);
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