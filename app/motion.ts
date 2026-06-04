"use client";

/**
 * Motion preference, shared by every animated module.
 *
 * Resolution order:
 *  1. An explicit user choice saved via the on-site "Reduce motion" toggle
 *     ("reduced" → force off, "full" → force on).
 *  2. Otherwise the OS-level prefers-reduced-motion setting.
 *
 * Animations read this at init, so flipping the toggle reloads the page once
 * to re-initialise GSAP / Lenis / Three cleanly in the chosen mode.
 */
export const MOTION_KEY = "auvance:motion";

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const p = localStorage.getItem(MOTION_KEY);
    if (p === "reduced") return true;
    if (p === "full") return false;
  } catch {
    /* ignore */
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Persist the user's choice and reload so every effect re-inits in the new mode. */
export function setMotionPreference(reduced: boolean) {
  try {
    localStorage.setItem(MOTION_KEY, reduced ? "reduced" : "full");
  } catch {
    /* ignore */
  }
  window.location.reload();
}
