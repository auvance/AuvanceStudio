"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { CrownToggle } from "./theme";
import { useScrolled } from "./animations";
import { prefersReducedMotion } from "./motion";
import { ArrowUpRight } from "./svg";

/* Menu rows — STUDIO 01 … PROCESS 04 (numbers right-aligned, outlined). */
const MENU_ITEMS = [
  { id: "studio", label: "Studio", idx: "01" },
  { id: "work", label: "Works", idx: "02" },
  { id: "offer", label: "Pricing", idx: "03" },
  { id: "process", label: "Process", idx: "04" },
];

export default function Nav() {
  const scrolled = useScrolled(60);
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const pathname = usePathname();
  const onHome = pathname === "/";
  const hrefFor = (id: string) => (onHome ? `#${id}` : `/#${id}`);

  const scrimRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLElement>(null);

  // Hide on scroll-down, show on scroll-up (never while the menu is open).
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const goingDown = y > lastY;
      lastY = y;
      setHidden(goingDown && y > 220 && !open);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  // Lock scroll + Escape-to-close while open.
  useEffect(() => {
    if (open) window.__lenis?.stop();
    else window.__lenis?.start();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // The overlay card "grows" from its top-right corner; the scrim darkens +
  // blurs the page behind it. Reduced-motion just toggles instantly.
  useEffect(() => {
    const card = cardRef.current;
    const scrim = scrimRef.current;
    if (!card || !scrim) return;
    gsap.killTweensOf([card, scrim]);
    const rows = card.querySelectorAll<HTMLElement>(".menu-row, .menu-card-ctas");

    if (prefersReducedMotion()) {
      gsap.set(scrim, { autoAlpha: open ? 1 : 0, display: open ? "block" : "none" });
      gsap.set(card, { autoAlpha: open ? 1 : 0, scale: 1, display: open ? "flex" : "none" });
      gsap.set(rows, { autoAlpha: open ? 1 : 0, y: 0 });
      return;
    }

    if (open) {
      gsap.set([scrim, card], { display: "block" });
      gsap.set(card, { display: "flex" });
      gsap.fromTo(scrim, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, ease: "power2.out" });
      gsap.fromTo(
        card,
        { autoAlpha: 0, scale: 0.55, transformOrigin: "100% 0%" },
        { autoAlpha: 1, scale: 1, duration: 0.6, ease: "power3.out" }
      );
      gsap.fromTo(
        rows,
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.06, delay: 0.14, ease: "power3.out" }
      );
    } else {
      gsap.to(card, {
        autoAlpha: 0,
        scale: 0.55,
        duration: 0.32,
        ease: "power3.in",
        transformOrigin: "100% 0%",
        onComplete: () => gsap.set(card, { display: "none" }),
      });
      gsap.to(scrim, {
        autoAlpha: 0,
        duration: 0.3,
        onComplete: () => gsap.set(scrim, { display: "none" }),
      });
    }
  }, [open]);

  return (
    <>
      <nav className={`nav${scrolled ? " scrolled" : ""}${hidden ? " nav--hidden" : ""}`}>
        <div className="nav-left">
          <CrownToggle />
          <Link href="/" className="wordmark" data-hover>
            auvANcE
          </Link>
        </div>

        <button
          className={`menu-btn${open ? " open" : ""}`}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          data-hover
        >
          <span />
          <span />
        </button>
      </nav>

      {/* darken + minimal blur behind the menu */}
      <div ref={scrimRef} className="menu-scrim" onClick={() => setOpen(false)} aria-hidden />

      {/* the growing menu card (top-right) */}
      <aside className="menu-card" ref={cardRef} aria-hidden={!open}>
        <nav className="menu-card-nav" onClick={() => setOpen(false)}>
          {MENU_ITEMS.map((m) => (
            <a key={m.id} href={hrefFor(m.id)} className="menu-row" data-hover>
              <span className="menu-row-name">{m.label}</span>
              <span className="menu-row-no">{m.idx}</span>
            </a>
          ))}
        </nav>
        <div className="menu-card-ctas">
          <a href={hrefFor("contact")} className="mc-btn mc-btn--solid" data-hover onClick={() => setOpen(false)}>
            Book a free call
          </a>
          <a href={hrefFor("work")} className="mc-btn mc-btn--outline" data-hover onClick={() => setOpen(false)}>
            See the work <ArrowUpRight size={14} />
          </a>
        </div>
      </aside>
    </>
  );
}
