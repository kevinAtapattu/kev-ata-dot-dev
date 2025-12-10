import { ReactNode } from "react";
import { cn } from "../../lib/utils";

export default function Badge({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn("rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-widest", className)}>{children}</span>;
}
