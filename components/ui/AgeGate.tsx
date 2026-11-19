"use client";
import { useEffect, useState } from "react";
import { ageGate } from "@/content/chandon";
import { Logo, Star } from "./brand";

type State = "pending" | "ask" | "no" | "leaving" | "ok";
const COOKIE = "edad_ok";

export default function AgeGate() {
  const [state, setState] = useState<State>("pending");

  useEffect(() => {
    const has = document.cookie.split("; ").some((c) => c.startsWith(`${COOKIE}=1`));
    setState(has ? "leaving" : "ask");
  }, []);

  useEffect(() => {
    if (state === "leaving") {
      const t = setTimeout(() => setState("ok"), 900);
      return () => clearTimeout(t);
    }
  }, [state]);

  useEffect(() => {
    document.documentElement.classList.toggle("lenis-stopped", state !== "ok" && state !== "leaving");
    return () => document.documentElement.classList.remove("lenis-stopped");
  }, [state]);

  const accept = () => {
    const d = new Date(Date.now() + 30 * 864e5).toUTCString();
    document.cookie = `${COOKIE}=1; expires=${d}; path=/; SameSite=Lax`;
    setState("leaving");
  };

  if (state === "ok") return null;
  const leaving = state === "leaving";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={ageGate.question}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink px-6 text-center text-bone transition-opacity duration-[900ms] [transition-timing-function:cubic-bezier(0.77,0,0.175,1)]"
      style={{ opacity: leaving ? 0 : 1, pointerEvents: leaving ? "none" : "auto" }}
    >
      <Logo height={30} />
      <Star size={20} className="mt-8 text-gold" />

      {state === "pending" && <div className="mt-10 h-12" aria-hidden="true" />}

      {state === "ask" && (
        <div className="fadeup mt-10 flex flex-col items-center gap-8">
          <h1 className="text-[clamp(28px,5vw,52px)] font-semibold leading-tight tracking-tight">{ageGate.question}</h1>
          <div className="flex gap-3">
            <button type="button" autoFocus onClick={accept} className="btn btn-gold min-w-32 justify-center">
              {ageGate.yes}
            </button>
            <button type="button" onClick={() => setState("no")} className="btn btn-ghost min-w-32 justify-center">
              {ageGate.no}
            </button>
          </div>
          <p className="text-sm text-[var(--mute)]">{ageGate.note}</p>
        </div>
      )}

      {state === "no" && (
        <div className="fadeup mt-10 max-w-md">
          <p className="text-[clamp(20px,3vw,28px)] font-light leading-snug">{ageGate.bye}</p>
        </div>
      )}
    </div>
  );
}
