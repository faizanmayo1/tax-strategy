import { useState, useRef, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  Sparkles,
  Calculator,
  BookOpenCheck,
  LineChart,
  CalendarClock,
  FolderInput,
  FileText,
  Settings,
  ChevronsUpDown,
  LifeBuoy,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigation, type PageId } from "@/app/navigation";
import { useToast } from "@/app/providers/ToastProvider";
import { useAuth } from "@/app/providers/AuthProvider";

interface NavItem {
  label: string;
  icon: LucideIcon;
  pageId: PageId;
  badge?: { text: string; tone: "new" | "count" | "ai" };
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const groups: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { label: "Firm Dashboard", icon: LayoutDashboard, pageId: "dashboard" },
      { label: "Clients", icon: Users, pageId: "clients" },
    ],
  },
  {
    label: "Advisory",
    items: [
      { label: "Tax Strategies", icon: Sparkles, pageId: "tax-strategies", badge: { text: "AI", tone: "ai" } },
      { label: "Tax Simulator", icon: Calculator, pageId: "simulator" },
      { label: "Bookkeeping Review", icon: BookOpenCheck, pageId: "bookkeeping", badge: { text: "12", tone: "count" } },
      { label: "CFO Forecasting", icon: LineChart, pageId: "cfo" },
    ],
  },
  {
    label: "Firm",
    items: [
      { label: "Compliance & Entity", icon: CalendarClock, pageId: "compliance", badge: { text: "7", tone: "count" } },
      { label: "Documents", icon: FolderInput, pageId: "documents" },
      { label: "Reports & Copilot", icon: FileText, pageId: "reports", badge: { text: "New", tone: "new" } },
    ],
  },
  {
    label: "Admin",
    items: [{ label: "Settings", icon: Settings, pageId: "settings" }],
  },
];

const workspaces = [
  { id: "ws-1", name: "Aragon Advisors", clients: 150, plan: "Enterprise", initial: "A", color: ["#3B5BFE", "#7C3AED"] },
  { id: "ws-2", name: "Cascade Tax Group", clients: 84, plan: "Professional", initial: "C", color: ["#0EA5E9", "#0369A1"] },
  { id: "ws-3", name: "Northbridge CPAs", clients: 212, plan: "Enterprise", initial: "N", color: ["#059669", "#047857"] },
  { id: "ws-4", name: "Heritage Wealth", clients: 56, plan: "Professional", initial: "H", color: ["#D97706", "#B45309"] },
];

export function Sidebar() {
  const { page, setPage, openClient } = useNavigation();
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const [wsOpen, setWsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const wsRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (wsRef.current && !wsRef.current.contains(e.target as Node)) setWsOpen(false);
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserMenuOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function isActive(pageId: PageId) {
    // Map client-detail-related pages to Tax Strategies highlight
    if (page === "client-detail" && pageId === "clients") return false;
    if (page === pageId) return true;
    // Clients group: highlight clients when on client-detail and pageId is clients
    return false;
  }

  return (
    <aside className="flex flex-col w-[260px] shrink-0 bg-brand-950 text-white border-r border-black/30">
      <button
        onClick={() => setPage("dashboard")}
        className="flex items-center gap-2.5 h-14 px-4 border-b border-white/5 hover:bg-white/[0.04] transition-colors text-left"
      >
        <div className="flex items-center justify-center h-8 w-8 rounded-md bg-gradient-to-br from-brand-500 to-accent-violet shadow-glow">
          <span className="text-white font-bold text-[14px]">A</span>
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-[15px] font-semibold tracking-tight">Aragon</span>
          <span className="text-[10px] text-white/50 tracking-[0.06em] uppercase">Tax Strategy & CFO</span>
        </div>
      </button>

      <div className="relative mx-3 mt-3" ref={wsRef}>
        <button
          onClick={() => setWsOpen((o) => !o)}
          className="flex items-center justify-between w-full px-3 h-10 rounded-md bg-white/[0.04] hover:bg-white/[0.08] transition-colors text-left"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className="h-6 w-6 rounded flex items-center justify-center text-white text-[10px] font-semibold"
              style={{ background: `linear-gradient(135deg, ${workspaces[0].color[0]}, ${workspaces[0].color[1]})` }}
            >
              {workspaces[0].initial}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[12.5px] font-medium truncate">{workspaces[0].name}</span>
              <span className="text-[10px] text-white/50 truncate">
                {workspaces[0].clients} clients · {workspaces[0].plan}
              </span>
            </div>
          </div>
          <ChevronsUpDown className="h-3.5 w-3.5 text-white/50" />
        </button>

        {wsOpen && (
          <div className="absolute top-full left-0 right-0 mt-1.5 bg-brand-900 border border-white/10 rounded-md shadow-lg z-50 overflow-hidden animate-fade-in">
            <div className="px-3 py-2 text-[10px] uppercase tracking-wider text-white/40 font-medium border-b border-white/5">
              Switch firm · {workspaces.length}
            </div>
            <ul className="py-1">
              {workspaces.map((w) => (
                <li key={w.id}>
                  <button
                    onClick={() => {
                      setWsOpen(false);
                      toast({
                        kind: "success",
                        title: `Switched to ${w.name}`,
                        description: `${w.clients} clients · ${w.plan} plan`,
                      });
                    }}
                    className="flex items-center gap-2.5 w-full px-3 py-2 hover:bg-white/[0.06] transition-colors text-left"
                  >
                    <div
                      className="h-6 w-6 shrink-0 rounded flex items-center justify-center text-white text-[10px] font-semibold"
                      style={{ background: `linear-gradient(135deg, ${w.color[0]}, ${w.color[1]})` }}
                    >
                      {w.initial}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[12.5px] font-medium text-white truncate">{w.name}</div>
                      <div className="text-[10px] text-white/50 truncate">
                        {w.clients} clients · {w.plan}
                      </div>
                    </div>
                    {w.id === "ws-1" && <span className="text-[10px] text-brand-300 font-medium">Current</span>}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {groups.map((group) => (
          <div key={group.label}>
            <div className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-[0.10em] text-white/40">
              {group.label}
            </div>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(item.pageId);
                return (
                  <li key={item.label}>
                    <button
                      onClick={() => {
                        if (item.pageId === "tax-strategies" || item.pageId === "simulator" || item.pageId === "bookkeeping" || item.pageId === "cfo") {
                          // jump into a default client when sidebar entry is hit
                          openClient("c-001", item.pageId);
                        } else {
                          setPage(item.pageId);
                        }
                      }}
                      className={cn(
                        "w-full group flex items-center justify-between h-9 px-3 rounded-md text-[13px] transition-all text-left cursor-pointer",
                        active
                          ? "bg-white/[0.10] text-white relative before:absolute before:left-0 before:top-1.5 before:bottom-1.5 before:w-[3px] before:rounded-r-full before:bg-brand-300"
                          : "text-white/70 hover:bg-white/[0.06] hover:text-white",
                      )}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <item.icon
                          className={cn("h-[18px] w-[18px] shrink-0", active ? "text-brand-300" : "text-white/55")}
                          strokeWidth={1.75}
                        />
                        <span className={cn("truncate", active ? "font-medium" : "font-normal")}>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full h-[18px] px-1.5 text-[10px] font-semibold tracking-wide shrink-0",
                            item.badge.tone === "new" && "bg-brand-300/15 text-brand-300",
                            item.badge.tone === "count" && "bg-warn/20 text-[#FCD34D]",
                            item.badge.tone === "ai" && "bg-accent-violet/20 text-[#C4B5FD]",
                          )}
                        >
                          {item.badge.text}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/5 p-3 space-y-2">
        <button
          onClick={() => toast({ kind: "info", title: "Help & Changelog", description: "v1.0.4 · Pilot release" })}
          className="flex items-center gap-2 w-full h-8 px-2 rounded-md text-[12px] text-white/55 hover:text-white hover:bg-white/[0.06] transition-colors"
        >
          <LifeBuoy className="h-4 w-4" strokeWidth={1.75} />
          Help · Changelog
        </button>
        <div className="relative" ref={userRef}>
          <button
            onClick={() => setUserMenuOpen((o) => !o)}
            className="flex items-center gap-2.5 w-full px-2 py-1.5 rounded-md hover:bg-white/[0.04] transition-colors text-left"
          >
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-brand-300 to-accent-violet flex items-center justify-center text-[12px] font-semibold">
              {user?.initials ?? "AK"}
            </div>
            <div className="flex flex-col min-w-0 leading-tight flex-1">
              <span className="text-[12px] font-medium text-white truncate">{user?.name}</span>
              <span className="text-[10px] text-white/50 truncate">{user?.role}</span>
            </div>
            <ChevronsUpDown className="h-3.5 w-3.5 text-white/40" />
          </button>
          {userMenuOpen && (
            <div className="absolute bottom-full left-0 right-0 mb-1.5 bg-brand-900 border border-white/10 rounded-md shadow-lg z-50 overflow-hidden animate-fade-in py-1">
              <button
                onClick={() => {
                  setUserMenuOpen(false);
                  toast({ kind: "info", title: "Profile", description: user?.email });
                }}
                className="w-full px-3 py-2 text-left text-[12.5px] text-white/80 hover:bg-white/[0.06]"
              >
                Profile settings
              </button>
              <button
                onClick={() => {
                  setUserMenuOpen(false);
                  setPage("settings");
                }}
                className="w-full px-3 py-2 text-left text-[12.5px] text-white/80 hover:bg-white/[0.06]"
              >
                Workspace settings
              </button>
              <div className="h-px bg-white/5 my-1" />
              <button
                onClick={signOut}
                className="w-full px-3 py-2 text-left text-[12.5px] text-[#FCA5A5] hover:bg-white/[0.06]"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
