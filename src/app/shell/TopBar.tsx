import { Search, Bell, Sparkles, Command } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/app/providers/ToastProvider";
import { useNavigation } from "@/app/navigation";

export function TopBar() {
  const { toast } = useToast();
  const { setPage } = useNavigation();

  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 h-14 px-6 bg-paper/95 backdrop-blur border-b border-ink-150">
      <div className="flex items-center gap-2 flex-1 max-w-[480px]">
        <div className="flex items-center gap-2 w-full h-9 px-3 rounded-md bg-ink-50 border border-ink-150 text-ink-400 text-[13px]">
          <Search className="h-4 w-4" />
          <span className="flex-1 truncate">Search clients, strategies, deadlines…</span>
          <span className="inline-flex items-center gap-1 text-[10.5px] font-medium text-ink-400 bg-paper border border-ink-150 rounded h-5 px-1.5">
            <Command className="h-2.5 w-2.5" /> K
          </span>
        </div>
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-2">
        <Button
          variant="ai"
          size="sm"
          leftIcon={<Sparkles className="h-3.5 w-3.5" />}
          onClick={() => setPage("copilot")}
        >
          Open Copilot
        </Button>
        <button
          onClick={() => toast({ kind: "info", title: "3 unread alerts", description: "Most recent: nexus risk for Fairhaven Logistics" })}
          className="relative h-9 w-9 inline-flex items-center justify-center rounded-md hover:bg-ink-100 text-ink-500 transition-colors"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-danger" />
        </button>
        <div className="w-px h-6 bg-ink-150" />
        <span className="hidden md:inline-flex items-center gap-1.5 h-7 px-2.5 rounded-full bg-success-bg text-success-ink text-[11px] font-medium">
          <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse-dot" /> Live · 2024 tax year
        </span>
      </div>
    </header>
  );
}
