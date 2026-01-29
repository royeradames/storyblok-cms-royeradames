"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { Scenario, MockUser, MockOrder, MockNotification } from "./types";

interface SeedDataContextValue {
  scenario: Scenario | null;
  setScenarioId: (id: string | null) => void;
  scenarioId: string | null;
  getFlag: (key: string) => boolean;
  isLoading: boolean;
}

const SeedDataContext = createContext<SeedDataContextValue | null>(null);

const STORAGE_KEY = "dev_scenario_id";

interface SeedDataProviderProps {
  children: ReactNode;
  scenarios: Scenario[];
}

export function SeedDataProvider({
  children,
  scenarios,
}: SeedDataProviderProps) {
  const [scenarioId, setScenarioIdState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setScenarioIdState(stored);
      }
      setIsLoading(false);
    }
  }, []);

  const setScenarioId = (id: string | null) => {
    setScenarioIdState(id);
    if (typeof window !== "undefined") {
      if (id) {
        localStorage.setItem(STORAGE_KEY, id);
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  };

  const scenario = scenarios.find((s) => s.id === scenarioId) || null;

  const getFlag = (key: string): boolean => {
    return scenario?.flags[key] ?? false;
  };

  return (
    <SeedDataContext.Provider
      value={{
        scenario,
        setScenarioId,
        scenarioId,
        getFlag,
        isLoading,
      }}
    >
      {children}
    </SeedDataContext.Provider>
  );
}

export function useSeedData(): SeedDataContextValue {
  const ctx = useContext(SeedDataContext);
  if (!ctx) {
    throw new Error("useSeedData must be used within SeedDataProvider");
  }
  return ctx;
}

// Convenience hooks
export function useMockUser(): MockUser | null {
  const { scenario } = useSeedData();
  return scenario?.user_data[0] ?? null;
}

export function useMockOrders(): MockOrder[] {
  const { scenario } = useSeedData();
  return scenario?.orders_data ?? [];
}

export function useMockNotifications(): MockNotification[] {
  const { scenario } = useSeedData();
  return scenario?.notifications_data ?? [];
}

export function useMockFlag(key: string): boolean {
  const { getFlag } = useSeedData();
  return getFlag(key);
}
