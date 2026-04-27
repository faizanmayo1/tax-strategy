import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastKind = "success" | "info" | "warn" | "danger";

interface ToastInput {
  kind?: ToastKind;
  title: string;
  description?: string;
  durationMs?: number;
}

interface Toast extends Required<Omit<ToastInput, "description">> {
  id: number;
  description?: string;
}

interface ToastContextValue {
  toast: (t: ToastInput) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

let nextId = 1;

const kindStyles: Record<ToastKind, { icon: ReactNode; bar: string }> = {
  success: { icon: <CheckCircle2 className="h-4 w-4 text-success" />, bar: "bg-success" },
  info: { icon: <Info className="h-4 w-4 text-info" />, bar: "bg-info" },
  warn: { icon: <AlertCircle className="h-4 w-4 text-warn" />, bar: "bg-warn" },
  danger: { icon: <AlertCircle className="h-4 w-4 text-danger" />, bar: "bg-danger" },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (input: ToastInput) => {
      const id = nextId++;
      const t: Toast = {
        id,
        kind: input.kind ?? "info",
        title: input.title,
        description: input.description,
        durationMs: input.durationMs ?? 4000,
      };
      setToasts((prev) => [...prev, t]);
      window.setTimeout(() => remove(id), t.durationMs);
    },
    [remove],
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "pointer-events-auto bg-paper border border-ink-150 shadow-lg rounded-lg overflow-hidden",
              "min-w-[320px] max-w-[400px] animate-fade-in",
            )}
          >
            <div className="flex items-stretch">
              <div className={cn("w-1", kindStyles[t.kind].bar)} />
              <div className="flex items-start gap-3 p-3.5 flex-1 min-w-0">
                <div className="mt-0.5 shrink-0">{kindStyles[t.kind].icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13.5px] font-semibold text-ink-900">{t.title}</div>
                  {t.description && (
                    <div className="text-[12.5px] text-ink-500 mt-0.5 leading-snug">{t.description}</div>
                  )}
                </div>
                <button
                  onClick={() => remove(t.id)}
                  className="shrink-0 h-6 w-6 inline-flex items-center justify-center rounded text-ink-400 hover:text-ink-700 hover:bg-ink-100 transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
