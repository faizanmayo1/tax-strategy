import { createContext, useContext, useState, type ReactNode } from "react";

export interface CurrentUser {
  name: string;
  role: string;
  email: string;
  firm: string;
  initials: string;
}

interface AuthContextValue {
  user: CurrentUser | null;
  signIn: (email: string) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const DEFAULT_USER: CurrentUser = {
  name: "Adnan Karim",
  role: "Managing Partner",
  email: "adnan@aragonadvisors.com",
  firm: "Aragon Advisors",
  initials: "AK",
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(null);

  const signIn = (email: string) => {
    setUser({ ...DEFAULT_USER, email });
  };

  const signOut = () => setUser(null);

  return <AuthContext.Provider value={{ user, signIn, signOut }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
