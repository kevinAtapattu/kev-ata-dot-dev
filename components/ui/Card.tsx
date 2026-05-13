import { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface CardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
}

export default function Card({ children, className, hoverable = true }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-white/5 bg-white/5 p-6 backdrop-blur transition-transform duration-300 ease-out",
        hoverable && "hover:scale-105",
        className
      )}
    >
      {children}
    </div>
  );
}
