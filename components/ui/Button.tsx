import { ButtonHTMLAttributes, AnchorHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

type ButtonAsButton = ButtonHTMLAttributes<HTMLButtonElement> & {
  as?: "button";
};

type ButtonAsLink = AnchorHTMLAttributes<HTMLAnchorElement> & {
  as: "a";
};

type ButtonProps = (ButtonAsButton | ButtonAsLink) & {
  variant?: "primary" | "ghost";
};

export default function Button({ variant = "primary", className, ...props }: ButtonProps) {
  const baseClassName = cn(
    "rounded-full px-6 py-3 text-sm font-semibold transition inline-block text-center",
    variant === "primary"
      ? "bg-white text-black hover:bg-slate-200"
      : "border border-white/30 text-white hover:bg-white/10",
    className
  );

  if (props.as === "a") {
    const { as, ...anchorProps } = props;
    return <a className={baseClassName} {...anchorProps} />;
  }

  const { as, ...buttonProps } = props as ButtonAsButton;
  return <button className={baseClassName} {...buttonProps} />;
}
