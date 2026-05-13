"use client";

import { useReveal } from "../lib/hooks/useReveal";

export default function RevealWrapper({ children }: { children: React.ReactNode }) {
  useReveal();
  return <>{children}</>;
}
