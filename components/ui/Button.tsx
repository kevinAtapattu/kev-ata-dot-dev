import { ButtonHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost";
}

export default function Button({ variant = "primary", className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "rounded-full px-6 py-3 text-sm font-semibold transition",
        variant === "primary"
          ? "bg-white text-black hover:bg-slate-200"
          : "border border-white/30 text-white hover:bg-white/10",
        className
      )}
      {...props}
    />
  );
}
