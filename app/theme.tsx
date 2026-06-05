"use client";

/* ============================================
   Crown theme toggle.
   The crown IS the switch — click it to flip dark ⇄ light.
   The correct crown art (white on dark, black on light) is chosen
   by CSS from the [data-theme] attribute, so there is no flash and
   no hydration mismatch. We only read/write the attribute here.
   ============================================ */

import { useEffect, useState } from "react";
import { prefersReducedMotion, setMotionPreference, MOTION_KEY } from "./motion";

const STORAGE_KEY = "auvance-theme";
const HINT_KEY = "auvance:crown-hint-seen";

export function toggleTheme() {
  const html = document.documentElement;
  const next = html.getAttribute("data-theme") === "light" ? "dark" : "light";
  html.classList.add("theme-anim");
  html.setAttribute("data-theme", next);
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch {
    /* ignore */
  }
  window.setTimeout(() => html.classList.remove("theme-anim"), 700);
}

export function CrownToggle() {
  // First-visit hint: a small bubble under the crown telling the user it
  // toggles the theme. Shown once, then remembered in localStorage.
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    let seen = false;
    try {
      seen = localStorage.getItem(HINT_KEY) === "1";
    } catch {
      /* ignore */
    }
    if (seen) return;
    const t = window.setTimeout(() => setShowHint(true), 1400);
    return () => window.clearTimeout(t);
  }, []);

  const dismissHint = () => {
    if (!showHint) return;
    setShowHint(false);
    try {
      localStorage.setItem(HINT_KEY, "1");
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="crown-wrap">
      <button
        type="button"
        className="crown-toggle"
        aria-label="Toggle light or dark theme"
        data-hover
        onClick={() => {
          dismissHint();
          toggleTheme();
        }}
      >
        <img className="crown-white" src="/crown-white.svg" alt="Auvance crown" />
        <img className="crown-black" src="/crown-black.svg" alt="Auvance crown" />
        <span className="crown-hint">◐ Theme</span>
      </button>

      {showHint && (
        <button
          type="button"
          className="crown-tip"
          onClick={dismissHint}
          aria-label="Got it"
        >
          <span className="crown-tip-arrow" aria-hidden />
          Psst — the crown is the switch. Tap it any time to flip between light and dark mode.
          <span className="crown-tip-x" aria-hidden>
            ✕
          </span>
        </button>
      )}
    </div>
  );
}

/**
 * "Reduce motion" toggle. The founder likes the GSAP-heavy feel, so this is
 * opt-in rather than forced: it lets a visitor calm the animations if they
 * want. Persists the choice and reloads so every effect re-inits cleanly.
 */
export function MotionToggle() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(prefersReducedMotion());
  }, []);

  return (
    <button
      type="button"
      className="motion-toggle"
      data-hover
      aria-pressed={reduced}
      onClick={() => setMotionPreference(!reduced)}
      title={reduced ? "Turn animations back on" : "Calm the animations"}
    >
      <span className={`motion-dot${reduced ? " off" : ""}`} aria-hidden />
      {reduced ? "Motion: reduced" : "Motion: on"}
    </button>
  );
}

const MOTION_HINT_KEY = "auvance:motion-hint-seen";

/**
 * First-visit toast (mirrors the crown hint) telling the visitor they can calm
 * the animations, with a one-tap action. Shown once, and never if they've
 * already set a motion preference.
 */
export function MotionHint() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(MOTION_HINT_KEY) === "1") return;
      if (localStorage.getItem(MOTION_KEY)) return; // already chose — don't nag
    } catch {
      /* ignore */
    }
    const t = window.setTimeout(() => setShow(true), 4200);
    return () => window.clearTimeout(t);
  }, []);

  const dismiss = () => {
    setShow(false);
    try {
      localStorage.setItem(MOTION_HINT_KEY, "1");
    } catch {
      /* ignore */
    }
  };

  if (!show) return null;
  return (
    <div className="motion-hint" role="status">
      <span className="motion-hint-dot" aria-hidden />
      <span className="motion-hint-text">
        Animations a bit much? You can <strong>reduce motion</strong> anytime — there&apos;s a toggle
        in the footer.
      </span>
      <button
        type="button"
        className="motion-hint-act"
        data-hover
        onClick={() => {
          dismiss();
          setMotionPreference(true);
        }}
      >
        Reduce now
      </button>
      <button type="button" className="motion-hint-x" aria-label="Dismiss" data-hover onClick={dismiss}>
        ✕
      </button>
    </div>
  );
}

/**
 * Inline, render-blocking script that sets the theme before first paint
 * (no flash of the wrong theme). Injected in <head> via layout.tsx.
 */
export const themeScript = `(function(){try{var t=localStorage.getItem('${STORAGE_KEY}');if(t!=='light'&&t!=='dark'){t='dark';}document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();`;
