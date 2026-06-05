"use client";

import { useEffect, useRef } from "react";
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
import { MotionHint } from "./theme";
import { prefersReducedMotion } from "./motion";

/**
 * Global chrome shared across every route: smooth scroll, 3D background,
 * grain, custom cursor, nav, footer. The intro preloader runs on home only.
 * The footer uses a "curtain reveal": it's fixed behind the page and the
 * opaque last section scrolls up over a spacer to uncover it (desktop only;
 * static normal-flow footer on mobile / reduced-motion).
 */
export default function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const spacerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.__lenis?.scrollTo(0, { immediate: true });
    // Tag the route so sub-pages (legal, case studies) can calm the 3D
    // background and read as clean documents instead of text over a starfield.
    document.body.dataset.route = pathname === "/" ? "home" : "sub";
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 200);
    return () => window.clearTimeout(id);
  }, [pathname]);

  // Footer curtain reveal
  useEffect(() => {
    const footer = document.querySelector<HTMLElement>(".footer");
    const spacer = spacerRef.current;
    if (!footer || !spacer) return;

    // The curtain-reveal footer is a home-page flourish. On every other route
    // (legal pages, case studies) use a normal static footer — otherwise the
    // fixed footer overlaps short pages' content.
    if (!isHome) {
      footer.classList.add("footer--static");
      spacer.style.height = "0px";
      return;
    }

    const reduce = prefersReducedMotion();
    const isDesktop = () => window.matchMedia("(min-width: 769px)").matches;
    let H = 0;

    const measure = () => {
      if (reduce || !isDesktop()) {
        spacer.style.height = "0px";
        footer.classList.add("footer--static");
        return;
      }
      footer.classList.remove("footer--static");
      H = footer.offsetHeight;
      spacer.style.height = `${H}px`;
    };
    const onScroll = () => {
      if (reduce || !isDesktop()) return;
      const reveal =
        window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - H - 2;
      footer.classList.toggle("footer--shown", reveal);
    };
    const onResize = () => {
      measure();
      onScroll();
    };

    const ro = new ResizeObserver(onResize);
    ro.observe(footer);
    measure();
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
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
        <MotionHint />
        <Nav />
        <main id="main" className="page-main" tabIndex={-1}>
          {children}
        </main>
        <div className="footer-spacer" ref={spacerRef} aria-hidden />
        <Footer />
      </StingerProvider>
    </SmoothScroll>
  );
}
