"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GRAIN_DATA_URI } from "./svg";

/**
 * Intro preloader.
 * - Crown on the LEFT (fades in, 3D swivels, then a quick sparkle).
 * - A huge Monument-Extended odometer counter on the RIGHT (000 → 100),
 *   each digit column rolling at its own speed with an expo in/out feel.
 * - A progress bar along the bottom, over a faint noise field.
 */
export default function Preloader() {
  const [done, setDone] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const crownRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const uColRef = useRef<HTMLDivElement>(null);
  const uStripRef = useRef<HTMLDivElement>(null);
  const tStripRef = useRef<HTMLDivElement>(null);
  const hStripRef = useRef<HTMLDivElement>(null);

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

    document.documentElement.style.overflow = "hidden";
    const stopId = window.setTimeout(() => window.__lenis?.stop(), 0);

    const revealInstant = () => {
      gsap.set(".hero-headline .line-inner", { yPercent: 0 });
      gsap.set([".hero-eyebrow", ".hero-foot"], { autoAlpha: 1, y: 0 });
    };

    const safetyId = window.setTimeout(finish, reduce ? 400 : 7000);

    const ctx = gsap.context(() => {
      if (reduce) {
        revealInstant();
        gsap.to(overlayRef.current, { autoAlpha: 0, duration: 0.3, onComplete: finish });
        return;
      }

      gsap.set(crownRef.current, { transformPerspective: 700 });
      // Measure a real cell's *fractional* height (getBoundingClientRect, not
      // the integer clientHeight) — otherwise rounding error × 100 cells leaves
      // the ones digit stranded between 9 and 0 at the end.
      const cellEl = uStripRef.current?.querySelector(".pl-cell") as HTMLElement | null;
      const colH = cellEl
        ? cellEl.getBoundingClientRect().height
        : uColRef.current?.clientHeight ?? 0;
      const setU = gsap.quickSetter(uStripRef.current as Element, "y", "px");
      const setT = gsap.quickSetter(tStripRef.current as Element, "y", "px");
      const setH = gsap.quickSetter(hStripRef.current as Element, "y", "px");

      const counter = { v: 0 };
      const tl = gsap.timeline({ onComplete: finish });

      // pre-hide hero (under the curtain → no flash)
      tl.set(".hero-headline .line-inner", { yPercent: 110 }, 0);
      tl.set([".hero-eyebrow", ".hero-foot"], { autoAlpha: 0, y: 28 }, 0);

      // crown — fade/scale in, then a slow 3D swivel
      tl.fromTo(
        crownRef.current,
        { autoAlpha: 0, scale: 0.8, rotationY: -90 },
        { autoAlpha: 1, scale: 1, rotationY: 0, duration: 0.9, ease: "power3.out" },
        0.1
      );
      tl.to(crownRef.current, { rotationY: 360, duration: 1.6, ease: "power1.inOut" }, 1.0);

      // counter odometer — expo in/out
      tl.to(
        counter,
        {
          v: 100,
          duration: 2.2,
          ease: "expo.inOut",
          onUpdate: () => {
            const v = counter.v;
            setU(-v * colH);
            setT(-(v / 10) * colH);
            setH(-(v / 100) * colH);
          },
        },
        0
      );

      // progress bar — expo in/out
      tl.fromTo(barRef.current, { scaleX: 0 }, { scaleX: 1, duration: 2.2, ease: "expo.inOut" }, 0);

      // outro — lift the curtain, reveal the hero
      tl.to(crownRef.current, { autoAlpha: 0, y: -24, duration: 0.5, ease: "power2.in" }, 2.85)
        .to(".preloader-counter", { autoAlpha: 0, y: -24, duration: 0.5, ease: "power2.in" }, "<")
        .to(overlayRef.current, { yPercent: -100, duration: 1.05, ease: "expo.inOut" }, "<0.05")
        .to(
          ".hero-headline .line-inner",
          { yPercent: 0, duration: 1.15, ease: "power4.out", stagger: 0.09 },
          "<0.32"
        )
        .to(
          [".hero-eyebrow", ".hero-foot"],
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
      <div
        className="preloader-noise"
        aria-hidden
        style={{ backgroundImage: `url("${GRAIN_DATA_URI}")` }}
      />

      <div className="preloader-crown" ref={crownRef}>
        <img className="crown-white" src="/crown-white.svg" alt="" />
        <img className="crown-black" src="/crown-black.svg" alt="" />
      </div>

      <div className="preloader-counter">
        <div className="pl-col">
          <div className="pl-strip" ref={hStripRef}>
            {[0, 1].map((k) => (
              <span className="pl-cell" key={k}>
                {k}
              </span>
            ))}
          </div>
        </div>
        <div className="pl-col">
          <div className="pl-strip" ref={tStripRef}>
            {Array.from({ length: 11 }, (_, j) => (
              <span className="pl-cell" key={j}>
                {j % 10}
              </span>
            ))}
          </div>
        </div>
        <div className="pl-col" ref={uColRef}>
          <div className="pl-strip" ref={uStripRef}>
            {Array.from({ length: 101 }, (_, i) => (
              <span className="pl-cell" key={i}>
                {i % 10}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="preloader-bar" ref={barRef} />
    </div>
  );
}
