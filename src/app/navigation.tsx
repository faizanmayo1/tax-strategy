import { createContext, useContext, useState, type ReactNode } from "react";

export type PageId =
  | "dashboard"
  | "clients"
  | "client-detail"
  | "tax-strategies"
  | "simulator"
  | "bookkeeping"
  | "cfo"
  | "compliance"
  | "documents"
  | "reports"
  | "copilot"
  | "settings";

interface NavigationState {
  page: PageId;
  setPage: (p: PageId) => void;
  selectedClientId: string | null;
  setSelectedClientId: (id: string | null) => void;
  openClient: (id: string, page?: PageId) => void;
}

const NavigationContext = createContext<NavigationState | null>(null);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [page, setPageState] = useState<PageId>("dashboard");
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  const setPage = (p: PageId) => {
    setPageState(p);
  };

  const openClient = (id: string, p: PageId = "client-detail") => {
    setSelectedClientId(id);
    setPageState(p);
  };

  return (
    <NavigationContext.Provider value={{ page, setPage, selectedClientId, setSelectedClientId, openClient }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const ctx = useContext(NavigationContext);
  if (!ctx) throw new Error("useNavigation must be used within NavigationProvider");
  return ctx;
}
