"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

/**
 * Custom cursor: a small dot that tracks fast, with a ring that lags behind.
 * - Over links/buttons ([data-hover], a, button): the ring grows.
 * - Over project cards ([data-cursor="VIEW ↗"]): the ring grows further and
 *   shows the label (counter-scaled so it stays readable).
 * Only runs on fine pointers and when motion is allowed.
 */
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Desktop only: real mouse (hover + fine pointer) AND a desktop-width
    // viewport. Tablets / phones never get the custom cursor.
    const desktop = window.matchMedia(
      "(hover: hover) and (pointer: fine) and (min-width: 1024px)"
    ).matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!desktop || reduce || !dot || !ring || !label) return;

    document.body.classList.add("cursor-ready");

    const DOT = 3.5; // half size
    const RING = 19; // half size

    gsap.set([dot, ring], { xPercent: 0, yPercent: 0, x: -100, y: -100 });
    gsap.set(label, { scale: 1, autoAlpha: 0 });

    const dotX = gsap.quickTo(dot, "x", { duration: 0.1, ease: "power3" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.1, ease: "power3" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.4, ease: "power3" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.4, ease: "power3" });

    const onMove = (e: MouseEvent) => {
      dotX(e.clientX - DOT);
      dotY(e.clientY - DOT);
      ringX(e.clientX - RING);
      ringY(e.clientY - RING);
    };

    const setState = (scale: number, showLabel: boolean, text?: string) => {
      gsap.to(ring, { scale, duration: 0.4, ease: "power3.out" });
      gsap.to(dot, { scale: scale > 1.15 ? 0 : 1, duration: 0.3, ease: "power3.out" });
      if (text) label.textContent = text;
      gsap.to(label, {
        scale: showLabel ? 1 / scale : 1,
        autoAlpha: showLabel ? 1 : 0,
        duration: 0.35,
        ease: "power3.out",
      });
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      const viewEl = t?.closest<HTMLElement>("[data-cursor]");
      if (viewEl) {
        setState(2.6, true, viewEl.dataset.cursor || "VIEW");
        return;
      }
      if (t?.closest("a, button, [data-hover]")) {
        setState(1.8, false);
        return;
      }
      setState(1, false);
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);

    return () => {
      document.body.classList.remove("cursor-ready");
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden />
      <div ref={ringRef} className="cursor-ring" aria-hidden>
        <span ref={labelRef} className="cursor-label" />
      </div>
    </>
  );
}
