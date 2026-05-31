"use client";

/* ============================================
   Crown theme toggle.
   The crown IS the switch — click it to flip dark ⇄ light.
   The correct crown art (white on dark, black on light) is chosen
   by CSS from the [data-theme] attribute, so there is no flash and
   no hydration mismatch. We only read/write the attribute here.
   ============================================ */

const STORAGE_KEY = "auvance-theme";

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
  return (
    <button
      type="button"
      className="crown-toggle"
      aria-label="Toggle light or dark theme"
      data-hover
      onClick={toggleTheme}
    >
      <img className="crown-white" src="/crown-white.svg" alt="Auvance crown" />
      <img className="crown-black" src="/crown-black.svg" alt="Auvance crown" />
      <span className="crown-hint">◐ Theme</span>
    </button>
  );
}

/**
 * Inline, render-blocking script that sets the theme before first paint
 * (no flash of the wrong theme). Injected in <head> via layout.tsx.
 */
export const themeScript = `(function(){try{var t=localStorage.getItem('${STORAGE_KEY}');if(t!=='light'&&t!=='dark'){t='dark';}document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();`;
