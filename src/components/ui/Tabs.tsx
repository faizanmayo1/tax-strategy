import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

export const Tabs = TabsPrimitive.Root;

interface TabListProps {
  children: ReactNode;
  className?: string;
}

export function TabList({ children, className }: TabListProps) {
  return (
    <TabsPrimitive.List
      className={cn("inline-flex items-center gap-1 border-b border-ink-150 w-full", className)}
    >
      {children}
    </TabsPrimitive.List>
  );
}

interface TabProps {
  value: string;
  children: ReactNode;
  badge?: number;
}

export function Tab({ value, children, badge }: TabProps) {
  return (
    <TabsPrimitive.Trigger
      value={value}
      className={cn(
        "inline-flex items-center gap-2 h-10 px-3 text-[13.5px] font-medium text-ink-500",
        "border-b-2 border-transparent -mb-px transition-colors",
        "hover:text-ink-700",
        "data-[state=active]:text-brand-700 data-[state=active]:border-brand-500",
      )}
    >
      {children}
      {badge !== undefined && badge > 0 && (
        <span className="inline-flex items-center justify-center h-[18px] min-w-[18px] px-1 rounded-full bg-ink-100 text-ink-700 text-[10px] font-semibold">
          {badge}
        </span>
      )}
    </TabsPrimitive.Trigger>
  );
}

export const TabPanel = TabsPrimitive.Content;
