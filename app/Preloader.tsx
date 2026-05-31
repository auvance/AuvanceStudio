"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Full-screen intro. Counts 0→100, then lifts away to reveal the hero,
 * whose headline lines and meta animate in as the curtain rises.
 *
 * Uses the standard gsap.context + revert pattern so it behaves correctly
 * under React StrictMode (the throwaway first mount is reverted; the real
 * mount recreates and plays). A safety timeout guarantees the page is never
 * left locked behind the overlay if anything goes wrong.
 */
export default function Preloader() {
  const [done, setDone] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const crownRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      window.__lenis?.start();
      document.documentElement.style.overflow = "";
      ScrollTrigger.refresh();
      setDone(true);
    };

    // Lock scroll for the duration of the intro. Lenis may not be created yet
    // (its effect runs after ours), so retry the stop on the next tick.
    document.documentElement.style.overflow = "hidden";
    const stopId = window.setTimeout(() => window.__lenis?.stop(), 0);

    const revealInstant = () => {
      gsap.set(".hero-headline .line-inner", { yPercent: 0 });
      gsap.set([".hero-eyebrow", ".hero-foot", ".hero-strip"], { autoAlpha: 1, y: 0 });
    };

    // Bulletproof: never leave the page locked behind the curtain.
    const safetyId = window.setTimeout(finish, reduce ? 400 : 6000);

    const ctx = gsap.context(() => {
      if (reduce) {
        revealInstant();
        gsap.to(overlayRef.current, { autoAlpha: 0, duration: 0.3, onComplete: finish });
        return;
      }

      const counter = { v: 0 };
      const tl = gsap.timeline({ onComplete: finish });

      tl
        // Pre-hide hero (under the overlay → no flash)
        .set(".hero-headline .line-inner", { yPercent: 110 }, 0)
        .set([".hero-eyebrow", ".hero-foot", ".hero-strip"], { autoAlpha: 0, y: 28 }, 0)
        // Intro
        .fromTo(
          crownRef.current,
          { autoAlpha: 0, scale: 0.82, y: 12 },
          { autoAlpha: 1, scale: 1, y: 0, duration: 0.9, ease: "power3.out" },
          0.1
        )
        .to(
          counter,
          {
            v: 100,
            duration: 1.35,
            ease: "power2.inOut",
            onUpdate: () => {
              if (countRef.current)
                countRef.current.textContent = String(Math.round(counter.v)).padStart(3, "0");
            },
          },
          0
        )
        .fromTo(barRef.current, { scaleX: 0 }, { scaleX: 1, duration: 1.35, ease: "power2.inOut" }, 0)
        // Outro — curtain up + hero reveal
        .to(crownRef.current, { autoAlpha: 0, y: -24, duration: 0.5, ease: "power2.in" }, "+=0.15")
        .to(overlayRef.current, { yPercent: -100, duration: 1.05, ease: "expo.inOut" }, "<0.05")
        .to(
          ".hero-headline .line-inner",
          { yPercent: 0, duration: 1.15, ease: "power4.out", stagger: 0.09 },
          "<0.32"
        )
        .to(
          [".hero-eyebrow", ".hero-foot", ".hero-strip"],
          { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.12 },
          "<0.15"
        );
    });

    return () => {
      window.clearTimeout(stopId);
      window.clearTimeout(safetyId);
      ctx.revert();
    };
  }, []);

  if (done) return null;

  return (
    <div className="preloader" ref={overlayRef}>
      <div className="preloader-crown" ref={crownRef}>
        <img className="crown-white" src="/crown-white.svg" alt="" />
        <img className="crown-black" src="/crown-black.svg" alt="" />
      </div>
      <div className="preloader-count" ref={countRef}>
        000
      </div>
      <div className="preloader-bar" ref={barRef} />
    </div>
  );
}
