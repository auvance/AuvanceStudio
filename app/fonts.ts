import localFont from "next/font/local";
import { JetBrains_Mono } from "next/font/google";

/* ============================================
   AUVANCE STUDIO — Type system
   Self-hosted via next/font/local (zero layout shift).
   Files live in /Fonts at the project root.
   ============================================ */

// Monument Extended — the wide brutalist display face. Hero + big titles.
export const monument = localFont({
  src: [
    { path: "../Fonts/PPMonumentExtended-Light.otf", weight: "300", style: "normal" },
    { path: "../Fonts/PPMonumentExtended-Regular.otf", weight: "400", style: "normal" },
    { path: "../Fonts/PPMonumentExtended-Black.otf", weight: "900", style: "normal" },
  ],
  variable: "--font-display",
  display: "swap",
  fallback: ["Arial Black", "system-ui", "sans-serif"],
});

// Neue Montreal — clean grotesk for body copy and sub-heads.
export const neueMontreal = localFont({
  src: [{ path: "../Fonts/PPNeueMontreal-Book.otf", weight: "400", style: "normal" }],
  variable: "--font-body",
  display: "swap",
  fallback: ["system-ui", "Helvetica Neue", "Arial", "sans-serif"],
});

// Overused Grotesk — tighter, punchy face for stats and section heads.
export const overusedGrotesk = localFont({
  src: [
    { path: "../Fonts/OverusedGrotesk-ExtraBold.otf", weight: "800", style: "normal" },
    { path: "../Fonts/OverusedGrotesk-Black.otf", weight: "900", style: "normal" },
  ],
  variable: "--font-grotesk",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

// JetBrains Mono — labels, tags, nav. Free from Google.
export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

// Dirtyline (36 Days of Type 2022) — the decorative footer wordmark.
export const dirtyline = localFont({
  src: [{ path: "../Fonts/Dirtyline 36daysoftype 2022.otf", weight: "400", style: "normal" }],
  variable: "--font-dirty",
  display: "swap",
  fallback: ["Arial Black", "system-ui", "sans-serif"],
});
