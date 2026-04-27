import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeClass = {
  sm: "max-w-md",
  md: "max-w-xl",
  lg: "max-w-3xl",
  xl: "max-w-5xl",
};

export function Dialog({ open, onOpenChange, title, description, children, footer, size = "md" }: DialogProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-ink-900/50 backdrop-blur-sm animate-overlay-show" />
        <DialogPrimitive.Content
          className={cn(
            "fixed left-1/2 top-1/2 z-50 w-[calc(100%-32px)] -translate-x-1/2 -translate-y-1/2",
            "bg-paper rounded-xl shadow-lg border border-ink-150 animate-content-show overflow-hidden",
            sizeClass[size],
          )}
        >
          <div className="flex items-start justify-between gap-4 px-6 pt-5 pb-4 border-b border-ink-100">
            <div className="min-w-0">
              <DialogPrimitive.Title className="text-h2 text-ink-900">{title}</DialogPrimitive.Title>
              {description && (
                <DialogPrimitive.Description className="text-small text-ink-500 mt-1">
                  {description}
                </DialogPrimitive.Description>
              )}
            </div>
            <DialogPrimitive.Close className="shrink-0 h-8 w-8 inline-flex items-center justify-center rounded-md text-ink-400 hover:text-ink-700 hover:bg-ink-100 transition-colors">
              <X className="h-4 w-4" />
            </DialogPrimitive.Close>
          </div>
          <div className="px-6 py-5 max-h-[70vh] overflow-y-auto">{children}</div>
          {footer && (
            <div className="flex items-center justify-end gap-2 px-6 py-4 bg-ink-50 border-t border-ink-100">
              {footer}
            </div>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
