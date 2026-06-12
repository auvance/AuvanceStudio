"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { prefersReducedMotion } from "./motion";
import { MotionToggle } from "./theme";

const TITLE = "auvANcE.";

/** On the home page, render a bare #hash anchor so the global SmoothScroll
 *  handler catches it and eases to the section; elsewhere, route home first. */
function FooterLink({ id, children }: { id: string; children: React.ReactNode }) {
  const onHome = usePathname() === "/";
  if (onHome) {
    return (
      <a href={`#${id}`} data-hover>
        {children}
      </a>
    );
  }
  return (
    <Link href={`/#${id}`} data-hover>
      {children}
    </Link>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();
  const titleRef = useRef<HTMLHeadingElement>(null);

  // Split-text reveal — the title characters rise in as the footer is uncovered.
  useEffect(() => {
    const title = titleRef.current;
    if (!title) return;
    const chars = title.querySelectorAll<HTMLElement>(".ft-char");
    if (!chars.length) return;
    if (prefersReducedMotion()) {
      gsap.set(chars, { yPercent: 0 });
      return;
    }
    // Trigger off the in-flow spacer (the reveal zone) on desktop, else the title.
    const spacer = document.querySelector<HTMLElement>(".footer-spacer");
    const trigger = spacer && spacer.offsetHeight > 0 ? spacer : title;
    const ctx = gsap.context(() => {
      gsap.from(chars, {
        yPercent: 120,
        stagger: 0.045,
        duration: 0.85,
        ease: "power4.out",
        scrollTrigger: { trigger, start: "top 78%" },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <footer className="footer">
      <div className="footer-head">
        <div className="footer-mark" aria-hidden>
          <img className="crown-white" src="/crown-white.svg" alt="" width="68" height="54" />
          <img className="crown-black" src="/crown-black.svg" alt="" width="68" height="54" />
        </div>
        <div>
          <h2 className="footer-title" ref={titleRef} aria-label={TITLE}>
            {TITLE.split("").map((ch, i) => (
              <span className="ft-char" key={i} aria-hidden>
                {ch}
              </span>
            ))}
          </h2>
          <p className="footer-sub">
            Thanks for exploring. Now let&apos;s build something locals can&apos;t scroll past.
          </p>
        </div>
      </div>

      <div className="footer-cols">
        <div className="fcol">
          <h5>Menu</h5>
          <FooterLink id="work">Work</FooterLink>
          <FooterLink id="studio">Studio</FooterLink>
          <FooterLink id="process">Process</FooterLink>
          <FooterLink id="faq">FAQ</FooterLink>
          <FooterLink id="contact">Contact</FooterLink>
        </div>
        <div className="fcol">
          <h5>Contact</h5>
          <a href="mailto:aakif@auvancestudio.ca" data-hover>aakif@auvancestudio.ca</a>
          <a href="tel:+12369780637" data-hover>+1 (236) 978 0637</a>
          <span>2628 Duke St, Kingsway</span>
          <span>Vancouver, BC</span>
        </div>
        <div className="fcol">
          <h5>Studio</h5>
          <span>Site by Auvance</span>
          <span>Est. © 2023</span>
          <span>Vancouver web studio</span>
          <Link href="/privacy" data-hover>Privacy Policy</Link>
          <Link href="/terms" data-hover>Terms of Use</Link>
        </div>
        <div className="fcol fcol--media">
          <div
            className="fcol-img"
            aria-hidden
            style={{ backgroundImage: "url('/PortrairTwo.jpeg')", backgroundPosition: "center 22%" }}
          />
        </div>
      </div>

      <div className="footer-bottom">
        <a href="#top" className="footer-backtop" data-hover>
          Back to top (↑)
        </a>
        <MotionToggle />
        <span>© {year} Auvance. All rights reserved.</span>
      </div>
    </footer>
  );
}
