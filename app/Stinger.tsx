"use client";

import { createContext, useContext, useRef } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";

/**
 * Branded "stinger" page transition. Calling go(href) swipes a full-screen
 * panel across (logo + tagline), navigates while covered, then swipes off to
 * reveal the new page — all under ~1s. Falls back to an instant push when
 * reduced-motion is requested.
 */
const StingerCtx = createContext<(href: string) => void>(() => {});
export const useStinger = () => useContext(StingerCtx);

export function StingerProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const overlay = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const busy = useRef(false);

  const go = (href: string) => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !overlay.current) {
      router.push(href);
      return;
    }
    if (busy.current) return;
    busy.current = true;

    const ov = overlay.current;
    const in_ = inner.current;

    // Navigation is timer-driven (not tied to the rAF timeline) so it always
    // fires even if the tab throttles requestAnimationFrame.
    window.setTimeout(() => router.push(href), 340);

    const tl = gsap.timeline({
      onComplete: () => {
        busy.current = false;
      },
    });
    tl.set(ov, { visibility: "visible", xPercent: 100 })
      .set(in_, { autoAlpha: 0, scale: 0.92 })
      .to(ov, { xPercent: 0, duration: 0.36, ease: "power3.inOut" })
      .to(in_, { autoAlpha: 1, scale: 1, duration: 0.22, ease: "power2.out" }, "-=0.18")
      .to(in_, { autoAlpha: 0, duration: 0.14, ease: "power2.in" }, "+=0.1")
      .to(ov, { xPercent: -100, duration: 0.38, ease: "power3.inOut" }, "-=0.02")
      .set(ov, { visibility: "hidden" });
  };

  return (
    <StingerCtx.Provider value={go}>
      {children}
      <div ref={overlay} className="stinger" aria-hidden style={{ visibility: "hidden" }}>
        <div ref={inner} className="stinger-inner">
          <img src="/crown-white.svg" alt="" className="stinger-crown" width="68" height="54" />
          <div className="stinger-word">AUVANCE</div>
          <div className="stinger-tag">Built to Convert</div>
        </div>
      </div>
    </StingerCtx.Provider>
  );
}
