import { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export default function Card({ children, className }: CardProps) {
  return <div className={cn("rounded-3xl border border-white/5 bg-white/5 p-6 backdrop-blur", className)}>{children}</div>;
}
