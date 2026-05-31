"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SmoothScroll from "./SmoothScroll";
import ThreeBackground from "./ThreeBackground";
import Grain from "./Grain";
import Cursor from "./Cursor";
import Nav from "./Nav";
import Footer from "./Footer";
import Preloader from "./Preloader";
import { StingerProvider } from "./Stinger";

/**
 * Global chrome shared across every route: smooth scroll, 3D background,
 * grain, custom cursor, nav, footer. The intro preloader runs on the home
 * route only. On route change we jump to top and refresh ScrollTrigger.
 */
export default function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    window.__lenis?.scrollTo(0, { immediate: true });
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 200);
    return () => window.clearTimeout(id);
  }, [pathname]);

  return (
    <SmoothScroll>
      <StingerProvider>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <ThreeBackground />
        <Grain />
        <Cursor />
        {isHome && <Preloader />}
        <Nav />
        <main id="main" className="page-main" tabIndex={-1}>
          {children}
        </main>
        <Footer />
      </StingerProvider>
    </SmoothScroll>
  );
}
