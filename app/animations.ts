"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const prefersReduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * useReveal — fades + slides an element up as it enters the viewport.
 */
export function useReveal<T extends HTMLElement>(options?: {
  y?: number;
  delay?: number;
  duration?: number;
}) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReduced()) {
      gsap.set(el, { autoAlpha: 1, y: 0 });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { y: options?.y ?? 56, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: options?.duration ?? 1,
          delay: options?.delay ?? 0,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%" },
        }
      );
    }, el);
    return () => ctx.revert();
  }, [options?.y, options?.delay, options?.duration]);
  return ref;
}

/**
 * useLineReveal — reveals pre-wrapped lines one by one on scroll.
 * Markup: <span class="line"><span class="line-inner">…</span></span>
 */
export function useLineReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const lines = el.querySelectorAll(".line-inner");
    if (prefersReduced()) {
      gsap.set(lines, { yPercent: 0 });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(
        lines,
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 1.1,
          ease: "power4.out",
          stagger: 0.1,
          scrollTrigger: { trigger: el, start: "top 82%" },
        }
      );
    }, el);
    return () => ctx.revert();
  }, []);
  return ref;
}

/**
 * useParallax — depth movement on scroll.
 * speed > 0 drifts down (background), speed < 0 drifts up (foreground).
 */
export function useParallax<T extends HTMLElement>(speed = 0.3) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReduced()) return;
    // Skip parallax on touch / small screens (jank + accessibility).
    if (window.matchMedia("(max-width: 768px)").matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { yPercent: -speed * 100 },
        {
          yPercent: speed * 100,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    }, el);
    return () => ctx.revert();
  }, [speed]);
  return ref;
}

/**
 * useMagnetic — element gently follows the cursor on hover.
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.35) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReduced()) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      xTo(x * strength);
      yTo(y * strength);
    };
    const onLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.4)" });
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [strength]);
  return ref;
}

/**
 * useCountUp — animates a number from 0 → value when scrolled into view.
 */
export function useCountUp<T extends HTMLElement>(
  value: number,
  opts?: { suffix?: string; prefix?: string; duration?: number }
) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const prefix = opts?.prefix ?? "";
    const suffix = opts?.suffix ?? "";
    const render = (n: number) => {
      el.textContent = `${prefix}${Math.round(n)}${suffix}`;
    };
    if (prefersReduced()) {
      render(value);
      return;
    }
    const obj = { v: 0 };
    render(0);
    const ctx = gsap.context(() => {
      gsap.to(obj, {
        v: value,
        duration: opts?.duration ?? 1.8,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 90%" },
        onUpdate: () => render(obj.v),
      });
    }, el);
    return () => ctx.revert();
  }, [value, opts?.prefix, opts?.suffix, opts?.duration]);
  return ref;
}

/**
 * useScrolled — true once the page has scrolled past `threshold` px.
 */
export function useScrolled(threshold = 40) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);
  return scrolled;
}

/**
 * useScrollHighlight — word-by-word colour fill tied to scroll.
 * Wrap each word in <span class="hl-word">word</span>.
 */
export function useScrollHighlight<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const words = el.querySelectorAll<HTMLElement>(".hl-word");
    if (!words.length) return;
    if (prefersReduced()) {
      gsap.set(words, { opacity: 1 });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.set(words, { opacity: 0.16 });
      gsap.to(words, {
        opacity: 1,
        ease: "none",
        stagger: 0.5,
        scrollTrigger: {
          trigger: el,
          start: "top 78%",
          end: "bottom 58%",
          scrub: true,
        },
      });
    }, el);
    return () => ctx.revert();
  }, []);
  return ref;
}

/**
 * useTilt — 3D tilt toward the cursor (rotationX / rotationY).
 */
export function useTilt<T extends HTMLElement>(max = 9) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReduced()) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    gsap.set(el, { transformPerspective: 900, transformStyle: "preserve-3d" });
    const rotX = gsap.quickTo(el, "rotationX", { duration: 0.5, ease: "power3" });
    const rotY = gsap.quickTo(el, "rotationY", { duration: 0.5, ease: "power3" });

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      rotY(px * max * 2);
      rotX(-py * max * 2);
    };
    const onLeave = () => {
      gsap.to(el, { rotationX: 0, rotationY: 0, duration: 0.7, ease: "power3.out" });
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [max]);
  return ref;
}

/**
 * useHorizontalScroll — pins a section and scrubs its `.h-track` sideways.
 * Falls back to a normal vertical stack on small screens / reduced motion.
 */
export function useHorizontalScroll<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const section = ref.current;
    if (!section) return;
    const track = section.querySelector<HTMLElement>(".h-track");
    if (!track) return;

    // gsap.matchMedia → sets up on desktop, tears down on mobile, and
    // re-initialises automatically across the breakpoint / on resize. This
    // fixes the rail "not responding" when the component mounted at a narrow
    // width. Sticky-based (NOT pin) so GSAP never reparents the DOM (pinning
    // wraps the node in a pin-spacer → React removeChild crash on nav).
    const mm = gsap.matchMedia();
    mm.add("(min-width: 901px) and (prefers-reduced-motion: no-preference)", () => {
      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
      const setHeight = () => {
        section.style.height = window.innerHeight + distance() + "px";
      };
      setHeight();
      // scroll down → track moves left (advance right); scroll up → reverse.
      gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => "+=" + distance(),
          scrub: 1,
          invalidateOnRefresh: true,
          onRefresh: setHeight,
        },
      });
      return () => {
        section.style.height = "";
        gsap.set(track, { x: 0 });
      };
    });

    return () => mm.revert();
  }, []);
  return ref;
}
