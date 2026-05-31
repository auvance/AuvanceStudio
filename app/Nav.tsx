"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CrownToggle } from "./theme";
import { useScrolled, useMagnetic } from "./animations";
import { works } from "./works";
import { Globe, ArrowUpRight } from "./svg";

function NavLink({ id, children }: { id: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const onHome = pathname === "/";
  if (onHome) {
    return (
      <a href={`#${id}`} className="nav-link" data-hover>
        {children}
      </a>
    );
  }
  return (
    <Link href={`/#${id}`} className="nav-link" data-hover>
      {children}
    </Link>
  );
}

export default function Nav() {
  const scrolled = useScrolled(60);
  const cta = useMagnetic<HTMLAnchorElement>(0.3);
  const [open, setOpen] = useState(false);
  const count = String(works.length).padStart(2, "0");
  const pathname = usePathname();
  const contactHref = pathname === "/" ? "#contact" : "/#contact";

  // Lock scroll while the mobile menu is open
  useEffect(() => {
    if (open) window.__lenis?.stop();
    else window.__lenis?.start();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <nav className={`nav${scrolled ? " scrolled" : ""}`}>
        <div className="nav-left">
          <CrownToggle />
          <Link href="/" className="wordmark" data-hover>
            AUVANCE<sup>©</sup>
          </Link>
          <span className="nav-addr">
            Vancouver, BC
            <br />
            49.28°N 123.12°W
          </span>
        </div>

        <div className="nav-right">
          <div className="nav-links">
            <NavLink id="studio">
              <span className="idx">01</span> Studio
            </NavLink>
            <NavLink id="work">
              <span className="idx">02</span> Work <span className="count">({count})</span>
            </NavLink>
            <NavLink id="process">
              <span className="idx">03</span> Process
            </NavLink>
            <a ref={cta} href={contactHref} className="btn btn-ghost nav-cta" data-hover>
              <span>
                Start a project <ArrowUpRight size={14} style={{ marginLeft: 2 }} />
              </span>
            </a>
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
            <span />
          </button>
        </div>
      </nav>

      <div className={`menu-overlay${open ? " open" : ""}`}>
        <nav onClick={() => setOpen(false)}>
          <MenuLink id="studio" idx="01">
            Studio
          </MenuLink>
          <MenuLink id="work" idx="02">
            Work
          </MenuLink>
          <MenuLink id="process" idx="03">
            Process
          </MenuLink>
          <MenuLink id="faq" idx="04">
            FAQ
          </MenuLink>
          <MenuLink id="contact" idx="05">
            Contact
          </MenuLink>
        </nav>
        <div className="menu-foot label">
          <span style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>
            <Globe size={14} /> Based in Vancouver, BC
          </span>
          <a href="mailto:therealauvance@gmail.com" data-hover>
            therealauvance@gmail.com
          </a>
        </div>
      </div>
    </>
  );
}

function MenuLink({ id, idx, children }: { id: string; idx: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const href = pathname === "/" ? `#${id}` : `/#${id}`;
  return (
    <a href={href} data-hover>
      <span className="midx">{idx}</span>
      {children}
    </a>
  );
}
