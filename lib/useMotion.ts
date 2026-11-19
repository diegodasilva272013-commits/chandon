"use client";
import { useEffect, useState } from "react";

/** true si el usuario pidio reducir movimiento. null hasta montar (SSR). */
export function useReducedMotionPref(): boolean | null {
  const [v, setV] = useState<boolean | null>(null);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setV(mq.matches);
    const on = () => setV(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return v;
}
