"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import {
  useReveal,
  useParallax,
  useCountUp,
  useScrollHighlight,
  useTilt,
  useHorizontalScroll,
} from "./animations";
import { works } from "./works";
import { useStinger } from "./Stinger";
import { prefersReducedMotion } from "./motion";
import { CalButton } from "./Cal";
import {
  Plus,
  Asterisk,
  Globe,
  ArrowUpRight,
  Dot,
  Search,
  PenNib,
  Code,
  Key,
  Check,
  gradientPreview,
} from "./svg";

/* ============================================
   AUVANCE STUDIO — Home
   (Nav, Footer, Cursor, Grain, 3D bg & Preloader
   are provided globally by Shell.tsx)
   ============================================ */

export default function Page() {
  return (
    <>
      <Hero />
      <Marquee />
      <Stats />
      <Manifesto />
      <Approach />
      <About />
      <Services />
      <Offer />
      <Process />
      <WorkRail />
      <Testimonials />
      <FAQ />
      <Contact />
    </>
  );
}

/* --- HERO --- */
function Hero() {
  return (
    <section id="top" className="hero">
      <HeroImageTrail />
      <Plus className="hero-mark" style={{ top: "16vh", right: "4%" }} size={20} />
      <Plus className="hero-mark" style={{ bottom: "22vh", left: "3%" }} size={20} />
      <Plus className="hero-mark" style={{ bottom: "10vh", right: "6%" }} size={16} />

      <div className="hero-top hero-eyebrow">
        <div className="hero-aside">
          Websites <span className="slash">/</span>
          <br />
          Redesigns — UI/UX <span className="slash">/</span>
          <br />
          Local SEO — Strategy <span className="slash">/</span>
        </div>
        <div className="hero-aside" style={{ textAlign: "right" }}>
          <span style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>
            <Globe size={14} /> Based in Vancouver
          </span>
          <br />
          On the Pacific coast — Est. 2023
        </div>
      </div>

      <h1 className="display bleed-right hero-headline" style={{ margin: "2.5rem 0" }}>
        <span className="line">
          <span className="line-inner">We build sites</span>
        </span>
        <span className="line">
          <span className="line-inner">that work as</span>
        </span>
        <span className="line">
          <span className="line-inner">
            hard as you do<span className="accent">.</span>
          </span>
        </span>
      </h1>

      <div className="hero-foot">
        <p className="body-lg" style={{ maxWidth: "460px" }}>
          Custom websites for local businesses — designed to turn visitors into
          paying customers. You own everything. Fixed price. No lock-in.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem", alignItems: "flex-start" }}>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <a href="#contact" className="btn btn-primary" data-hover>
              <span>Book a free call →</span>
            </a>
            <a href="#work" className="btn btn-ghost" data-hover>
              <span>See the work</span>
            </a>
          </div>
          <div className="scroll-cue">
            <span className="dot" /> Scroll to explore
          </div>
        </div>
      </div>
    </section>
  );
}

/* --- HERO IMAGE TRAIL (desktop only) --- */
function HeroImageTrail() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const layer = ref.current;
    const hero = layer?.closest(".hero") as HTMLElement | null;
    if (!layer || !hero) return;
    const ok = window.matchMedia(
      "(hover: hover) and (pointer: fine) and (min-width: 1024px)"
    ).matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!ok || reduce) return;

    const pool = [
      works[0].image,
      works[1].image,
      gradientPreview(0, "Web"),
      gradientPreview(1, "Design"),
      gradientPreview(2, "SEO"),
      gradientPreview(3, "Brand"),
    ];
    let i = 0;
    let lastT = 0;
    let lastX = 0;
    let lastY = 0;

    const onMove = (e: MouseEvent) => {
      // Don't spawn images over the CTAs / scroll cue.
      const t = e.target as HTMLElement | null;
      if (t && t.closest(".hero-foot, a, button")) return;
      const now = performance.now();
      const dist = Math.hypot(e.clientX - lastX, e.clientY - lastY);
      // Less frequent than before (bigger time + distance gates).
      if (now - lastT < 170 || dist < 120) return;
      lastT = now;
      lastX = e.clientX;
      lastY = e.clientY;

      const rect = hero.getBoundingClientRect();
      const img = document.createElement("img");
      img.src = pool[i % pool.length];
      img.alt = "";
      img.className = "hero-trail-img";
      img.style.left = `${e.clientX - rect.left}px`;
      img.style.top = `${e.clientY - rect.top}px`;
      layer.appendChild(img);
      i++;

      gsap.fromTo(
        img,
        { autoAlpha: 0, scale: 0.6, rotate: Math.random() * 18 - 9 },
        { autoAlpha: 1, scale: 1, duration: 0.4, ease: "power3.out" }
      );
      gsap.to(img, {
        autoAlpha: 0,
        scale: 0.92,
        duration: 0.5,
        delay: 0.45,
        ease: "power2.in",
        onComplete: () => img.remove(),
      });
    };

    // Scroll-direction drift: down → the spray slides up/left, up → down/right.
    const driftX = gsap.quickTo(layer, "x", { duration: 0.6, ease: "power2.out" });
    const driftY = gsap.quickTo(layer, "y", { duration: 0.6, ease: "power2.out" });
    let lastScroll = window.scrollY;
    let resetT: number | undefined;
    const onScroll = () => {
      const y = window.scrollY;
      const down = y > lastScroll;
      lastScroll = y;
      driftX(down ? -55 : 55);
      driftY(down ? -40 : 40);
      window.clearTimeout(resetT);
      resetT = window.setTimeout(() => {
        driftX(0);
        driftY(0);
      }, 220);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    hero.addEventListener("mousemove", onMove);
    return () => {
      hero.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(resetT);
      layer.querySelectorAll(".hero-trail-img").forEach((n) => n.remove());
    };
  }, []);
  return <div ref={ref} className="hero-trail" aria-hidden />;
}

/* --- MARQUEE --- */
function Marquee() {
  const items = ["Custom Websites", "Redesigns", "Landing Pages", "Local SEO", "Conversion-First", "Brand & Identity"];
  const Track = ({ reverse }: { reverse?: boolean }) => (
    <div className={`marquee-track${reverse ? " reverse" : ""}`} aria-hidden={reverse}>
      {items.map((item, i) => (
        <span key={i}>
          {item}
          <span className="star">✦</span>
        </span>
      ))}
    </div>
  );
  return (
    <div className="marquee" style={{ borderBottom: "none" }}>
      <Track />
      <Track />
    </div>
  );
}

/* --- STATS --- */
function Stats() {
  return (
    <div className="section" style={{ paddingTop: 0, paddingBottom: 0 }}>
      <div className="stats">
        <StaticStat symbol="$1.5k" label="Founding-client rate" />
        <Stat value={21} suffix="d" label="From kickoff to live" />
        <Stat value={100} suffix="%" label="You own everything" />
        <StaticStat symbol="1:1" label="A real person, always" />
      </div>
    </div>
  );
}

function Stat({ value, suffix, label }: { value: number; suffix?: string; label: string }) {
  const num = useCountUp<HTMLDivElement>(value, { suffix });
  const wrap = useReveal<HTMLDivElement>({ y: 30 });
  return (
    <div ref={wrap} className="stat">
      <div ref={num} className="stat-num accent">
        0{suffix}
      </div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

function StaticStat({ symbol, label }: { symbol: string; label: string }) {
  const wrap = useReveal<HTMLDivElement>({ y: 30 });
  return (
    <div ref={wrap} className="stat">
      <div className="stat-num accent">{symbol}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

/* --- TODO marker — renders red on the site for anything the founder
   still needs to supply (photo, real domain email, testimonials, metrics) --- */
function Todo({ children, block }: { children: React.ReactNode; block?: boolean }) {
  if (block)
    return (
      <div className="todo" role="note">
        ⚠ {children}
      </div>
    );
  return (
    <span className="todo" role="note">
      ⚠ {children}
    </span>
  );
}

/* --- ABOUT / founder (id=about) --- */
function About() {
  const ref = useReveal<HTMLDivElement>({ y: 30 });
  const [photoOk, setPhotoOk] = useState(true);
  return (
    <section id="about" className="section">
      <div className="spine-label">Who you work with</div>
      <div ref={ref} className="about-grid">
        <div className="about-photo">
          {photoOk ? (
            <img
              className="about-photo-img"
              src="/PortraitOne.jpeg"
              alt="Aakif — founder of Auvance"
              onError={() => setPhotoOk(false)}
            />
          ) : (
            <Todo block>Add your portrait — save it as public/portrait.jpg</Todo>
          )}
        </div>
        <div>
          <h2 className="h2" style={{ marginBottom: "1.2rem" }}>
            A real person — not an agency.
          </h2>
          <p className="body-lg" style={{ marginBottom: "1rem" }}>
            I&apos;m a Vancouver-based web designer running Auvance solo. You work directly with me —
            no account managers, no ticket queue. Text me and I answer.
          </p>
          <p className="body-lg">
            I&apos;m early in my studio&apos;s journey, so you get my full attention at a
            founding-client rate — and a site I&apos;ll stand behind.
          </p>
        </div>
      </div>
    </section>
  );
}

/* --- OFFER / pricing (id=offer) --- */
function Offer() {
  const head = useReveal<HTMLHeadingElement>();
  return (
    <section id="offer" className="section">
      <div className="spine-label">The Offer</div>
      <h2 ref={head} className="h2" style={{ maxWidth: 820, marginBottom: "2.5rem" }}>
        One simple package. Flat price. You own everything.
      </h2>
      <div className="offer-card">
        <div>
          <div className="offer-name">The Launch Site</div>
          <div className="offer-price">
            <span className="offer-list">$2,000</span>
            <span className="offer-found">$1,500 founding rate</span>
          </div>
          <p className="offer-note">
            Founding rate for my first three Vancouver clients — locked in before the price goes up
            as the case studies roll in. Flat price agreed upfront, no surprises.
          </p>
          <a href="#contact" className="btn btn-primary" data-hover>
            <span>Start your project →</span>
          </a>
        </div>
        <ul className="offer-list-items">
          <li>Custom, hand-built site — live in ~3 weeks</li>
          <li>Mobile-first and fast</li>
          <li>Google Business Profile + local SEO basics</li>
          <li>You own the domain, hosting &amp; code — no lock-in</li>
          <li>50% deposit to start · up to 2 revision rounds</li>
          <li>You text a real person — not a ticket queue</li>
        </ul>
      </div>

      <div className="offer-addons">
        <div className="offer-addons-head">Need more? Add it on — same flat, upfront pricing.</div>
        <div className="addon-grid">
          {(
            [
              ["Copywriting", "I write your site content", "+$300"],
              ["Extra pages", "beyond the core set", "+$150 / page"],
              ["Online store / booking", "sell products or take bookings", "+$600"],
              ["Care plan", "hosting, updates & edits", "+$75 / mo"],
            ] as const
          ).map(([name, note, price]) => (
            <div className="addon-item" key={name}>
              <span className="addon-name">
                {name} <span className="addon-note" style={{ color: "var(--muted)" }}>— {note}</span>
              </span>
              <span className="addon-price">{price}</span>
            </div>
          ))}
        </div>
        <p className="offer-found-note">
          No confusing tiers — one core build, plus only what you actually need.
        </p>
      </div>
    </section>
  );
}

/* --- TESTIMONIALS (id=testimonials) --- */
function Testimonials() {
  const head = useReveal<HTMLHeadingElement>();
  const slots: [string, string][] = [
    ["Abu Bakr Siddiq Mosque", "Add a 1–2 line testimonial + a real outcome (sign-ups, calls, etc.)"],
    ["Student Software Association", "Add a 1–2 line testimonial + a real outcome"],
    ["Abwab Ventures", "Add a testimonial once the project is finished"],
  ];
  return (
    <section id="testimonials" className="section">
      <div className="spine-label">What clients say</div>
      <h2 ref={head} className="h2" style={{ maxWidth: 700, marginBottom: "2.5rem" }}>
        Proof, in their words.
      </h2>
      <div className="testi-grid">
        {slots.map(([who, todo]) => (
          <div key={who} className="testi-card">
            <Todo block>{todo}</Todo>
            <div className="testi-who">— {who}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* --- MANIFESTO (scroll-highlight) --- */
function Manifesto() {
  return (
    <section className="section manifesto">
      <div className="spine-label">Why it matters</div>
      <HighlightText text="Most local businesses don't lose customers because of a weak business — they lose them to a weak website. We build sites that make you the obvious choice: fast, clear, and impossible to scroll past." />
    </section>
  );
}

function HighlightText({ text }: { text: string }) {
  const ref = useScrollHighlight<HTMLParagraphElement>();
  return (
    <p ref={ref} className="highlight-text">
      {text.split(" ").map((w, i) => (
        <span key={i} className="hl-word">
          {w}{" "}
        </span>
      ))}
    </p>
  );
}

/* --- Editorial head (asymmetric, indented lead) --- */
function EditorialHead({ left, right, children }: { left: string; right: string; children: React.ReactNode }) {
  const ref = useReveal<HTMLParagraphElement>({ y: 28 });
  return (
    <div className="ed-head">
      <div className="ed-labels">
        <span>{left}</span>
        <span>{right}</span>
      </div>
      <p ref={ref} className="ed-lead">
        {children}
      </p>
    </div>
  );
}

/* --- APPROACH (stacking cards + tilt) --- id=studio --- */
function Approach() {
  const cards: [string, string, string, string, string][] = [
    ["01", "Local & Reachable", "Based in Vancouver. Text a real person — not a ticket queue. Coffee meetings welcome.", "Vancouver, BC", "Local"],
    ["02", "Fixed, Transparent Pricing", "One flat build fee, agreed upfront. No hourly billing, no surprise invoices, ever.", "One flat fee", "Pricing"],
    ["03", "You Own Everything", "Domain, hosting, code. After launch it's 100% yours — no platform lock-in.", "100% ownership", "Ownership"],
    ["04", "One Text Away", "We don't disappear at launch. Need a change next year? Message us — we pick up.", "Ongoing support", "Support"],
  ];
  const stackRef = useRef<HTMLDivElement>(null);

  // Desktop / tablet: an intro fanned-deck deal-in, then a SPOTLIGHT cycle —
  // the cards stay in the fan; one card at a time lifts forward at full
  // brightness while the others dim, auto-advancing every ~4.5s. Clicking any
  // card jumps the spotlight straight to it (and restarts the timer). Mobile
  // keeps a simple fade-up. Skipped when motion is reduced (static fan).
  useEffect(() => {
    const el = stackRef.current;
    if (!el) return;
    const cardEls = gsap.utils.toArray<HTMLElement>(el.querySelectorAll(".stack-card"));
    if (cardEls.length < 4) return;
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      if (prefersReducedMotion()) return; // CSS keeps a static fan
      const N = cardEls.length;
      let active = 0;
      let started = false;
      let ready = false;
      let timer: number | undefined;

      // Light the active card, dim + recede the rest.
      const apply = () => {
        cardEls.forEach((c, i) => {
          const on = i === active;
          c.classList.toggle("is-active", on);
          c.style.zIndex = on ? "30" : String(i + 1);
          gsap.to(c, {
            opacity: on ? 1 : 0.32,
            scale: on ? 1.07 : 0.94,
            y: on ? -26 : 0,
            duration: 0.55,
            ease: "power3.out",
            overwrite: "auto",
          });
        });
      };

      const advance = () => {
        active = (active + 1) % N;
        apply();
      };
      const start = () => {
        if (ready && timer == null) timer = window.setInterval(advance, 4500);
      };
      const stop = () => {
        if (timer != null) {
          window.clearInterval(timer);
          timer = undefined;
        }
      };

      const begin = () => {
        if (started) return;
        started = true;
        const tl = gsap.timeline();
        // 1) fanned-deck deal-in
        tl.from(cardEls, {
          xPercent: 64,
          autoAlpha: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.16,
        });
        // 2) begin the spotlight cycle
        tl.add(() => {
          active = 0;
          ready = true;
          apply();
          start();
        }, "+=0.3");
      };

      // Click any card → spotlight it immediately, restart the timer.
      const handlers = cardEls.map((c, i) => {
        const h = () => {
          active = i;
          apply();
          stop();
          start();
        };
        c.addEventListener("click", h);
        return h;
      });

      const io = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            begin();
            start();
          } else {
            stop();
          }
        },
        { threshold: 0.3 }
      );
      io.observe(el);

      return () => {
        stop();
        io.disconnect();
        cardEls.forEach((c, i) => {
          c.removeEventListener("click", handlers[i]);
          c.classList.remove("is-active");
        });
        gsap.killTweensOf(cardEls);
        gsap.set(cardEls, { clearProps: "all" });
      };
    });

    mm.add("(max-width: 767px)", () => {
      const ctx = gsap.context(() => {
        gsap.from(cardEls, {
          y: 48,
          autoAlpha: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: { trigger: el, start: "top 80%" },
        });
      }, el);
      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  return (
    <section id="studio" className="section">
      <div className="ghost-text" style={{ top: "2%", right: "-2%" }}>
        STUDIO
      </div>
      <EditorialHead left="/ The Studio" right="Vancouver — 01">
        Not an agency. Not a freelancer.{" "}
        <span className="ed-dim">
          A Vancouver studio that picks up the phone, prices it flat, and hands you everything you own.
        </span>
      </EditorialHead>
      <div className="stack stack--show" ref={stackRef}>
        {cards.map((c, i) => (
          <StackCard key={c[0]} i={i} num={c[0]} title={c[1]} desc={c[2]} meta={c[3]} chip={c[4]} />
        ))}
      </div>
    </section>
  );
}

function StackCard({
  i,
  num,
  title,
  desc,
  meta,
  chip,
}: {
  i: number;
  num: string;
  title: string;
  desc: string;
  meta: string;
  chip: string;
}) {
  const inner = useTilt<HTMLDivElement>(6);
  return (
    <div className="stack-card" data-i={i} data-hover>
      <div
        className="stack-card-rot"
        style={{ "--rot": i % 2 ? "-1.5deg" : "1.5deg" } as React.CSSProperties}
      >
        <div className="stack-card-inner" ref={inner}>
          <span className="ghost-num">{num}</span>
          <div className="sc-top">
            <span className="sc-chip">{chip}</span>
            <Asterisk className="sc-aster" size={30} />
          </div>
          <div className="stack-card-num">{num}</div>
          <h3>{title}</h3>
          <p className="body-lg">{desc}</p>
          <div className="sc-meta label">
            <Dot size={7} style={{ color: "var(--accent)" }} /> {meta}
          </div>
        </div>
      </div>
    </div>
  );
}

/* --- SERVICES (centered · hover image + hover dropdown detail) --- id=services --- */
type Service = { name: string; blurbs: string[]; images: string[] };

function Services() {
  const services: Service[] = [
    {
      name: "Conversion-First Design",
      blurbs: [
        "We design every page around the customer you want to reach — never a generic template.",
        "Clear hierarchy, fast loads, and one obvious next step on every screen.",
      ],
      images: [works[0].image, gradientPreview(0, "Design")],
    },
    {
      name: "Web Development",
      blurbs: [
        "Hand-built, lightning-fast sites — no bloated page builders.",
        "SEO-ready markup and clean code you actually own after launch.",
      ],
      images: [gradientPreview(1, "Build"), works[1].image],
    },
    {
      name: "Landing Pages",
      blurbs: [
        "Focused, single-goal pages that turn a campaign click into a booking.",
        "Wired with the forms and tracking that tell you what's working.",
      ],
      images: [gradientPreview(2, "Launch"), gradientPreview(0, "Page")],
    },
    {
      name: "Local SEO",
      blurbs: [
        "Get found by the people already searching for you nearby.",
        "Maps, metadata, and speed — the things that move local rankings.",
      ],
      images: [works[0].image, gradientPreview(3, "Rank")],
    },
    {
      name: "Brand & Identity",
      blurbs: [
        "A look that makes a small business read as the obvious, credible choice.",
        "Logo, type, and colour that stay consistent everywhere.",
      ],
      images: [gradientPreview(3, "Brand"), works[1].image],
    },
  ];

  return (
    <section id="services" className="section svc2" style={{ background: "var(--surface)" }}>
      <div className="spine-label" style={{ justifyContent: "center" }}>
        02 — What We Do
      </div>
      <div className="svc2-list">
        {services.map((s, i) => (
          <Svc2Item key={s.name} i={i} s={s} />
        ))}
      </div>
    </section>
  );
}

function Svc2Item({ i, s }: { i: number; s: Service }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    gsap.to(el, { height: open ? "auto" : 0, duration: 0.55, ease: "power3.inOut" });
  }, [open]);
  const id = `svc-${i}`;
  return (
    <div
      className="svc2-item"
      data-open={open}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className="svc2-name-row"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        data-hover
      >
        <span className="svc2-no">0{i + 1}</span>
        <span className="svc2-name">{s.name}</span>
        <Plus className="svc2-toggle" size={26} aria-hidden />
      </button>
      <div className="svc2-detail" id={id} ref={ref}>
        <div className="svc2-detail-inner">
          <div className="svc2-copy">
            {s.blurbs.map((b, j) => (
              <p key={j}>{b}</p>
            ))}
          </div>
          <div className="svc2-media">
            {s.images.map((im, j) => (
              <div key={j} className="svc2-img" style={{ backgroundImage: `url('${im}')` }} aria-hidden />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* --- PROCESS (staggered parallax cards) --- id=process --- */
function Process() {
  const steps: [string, string][] = [
    ["Discovery", "We meet — at your place or on a call. A real conversation about your business. Free, no pitch."],
    ["Design", "You see and approve every stage before a single line of code. We lock the scope — no surprises."],
    ["Build", "We handle the domain, hosting, and launch, with a walkthrough so you know how to manage it."],
    ["Yours", "Live, owned, and supported. You own the site outright — and we're one text away."],
  ];
  const speeds = [-0.12, 0.07, -0.05, 0.11];
  const offsets = ["0vh", "6vh", "2.5vh", "8vh"];
  return (
    <section id="process" className="section">
      <EditorialHead left="/ The Process" right="Four steps — 03">
        Simple process. No surprises.{" "}
        <span className="ed-dim">
          You see and approve every stage before a single line of code — then it&apos;s live, owned, and supported.
        </span>
      </EditorialHead>
      <div className="proc-cards">
        {steps.map((s, i) => (
          <ProcCard key={s[0]} i={i} title={s[0]} desc={s[1]} speed={speeds[i]} offset={offsets[i]} />
        ))}
      </div>
    </section>
  );
}

function ProcCard({
  i,
  title,
  desc,
  speed,
  offset,
}: {
  i: number;
  title: string;
  desc: string;
  speed: number;
  offset: string;
}) {
  const ref = useParallax<HTMLDivElement>(speed);
  const Icon = [Search, PenNib, Code, Key][i] ?? Asterisk;
  return (
    <div className="proc-card" style={{ marginTop: offset }}>
      <div ref={ref} className="proc-card-inner">
        <span className="num">0{i + 1}</span>
        <h3>{title}</h3>
        <span className="proc-aster proc-icon">
          <Icon size={30} />
        </span>
        <p>{desc}</p>
      </div>
    </div>
  );
}

/* --- WORK RAIL (horizontal scroll) --- id=work --- */
function WorkRail() {
  const rail = useHorizontalScroll<HTMLElement>();
  return (
    <section id="work" className="work-rail" ref={rail}>
      <div className="work-rail-sticky">
        <div className="work-rail-head">
          <div className="spine-label">04 — Selected Work</div>
          <div className="label" style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
            Scroll to explore <ArrowUpRight size={14} />
          </div>
        </div>
        <div className="h-track">
          {works.map((w, i) => (
            <WorkSlide key={w.slug} w={w} i={i} total={works.length} />
          ))}
          <a href="#contact" className="work-end" data-hover>
            <div className="spine-label">Next</div>
            <h3 className="h1">Have a project in mind?</h3>
            <p className="body-lg" style={{ maxWidth: 420 }}>
              Let&apos;s build something locals can&apos;t scroll past.
            </p>
            <span className="btn btn-primary" style={{ alignSelf: "flex-start" }}>
              <span>Start a project →</span>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}

function WorkSlide({ w, i, total }: { w: (typeof works)[number]; i: number; total: number }) {
  const go = useStinger();
  const href = `/work/${w.slug}`;
  const cardRef = useRef<HTMLAnchorElement>(null);
  const stickerRef = useRef<HTMLSpanElement>(null);

  // "View project" sticker that pops in and follows the cursor (desktop only).
  useEffect(() => {
    const card = cardRef.current;
    const sticker = stickerRef.current;
    if (!card || !sticker) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 901px)").matches)
      return;
    gsap.set(sticker, { xPercent: -50, yPercent: -50, scale: 0.5, rotation: -5, autoAlpha: 0 });
    const xTo = gsap.quickTo(sticker, "x", { duration: 0.3, ease: "power3" });
    const yTo = gsap.quickTo(sticker, "y", { duration: 0.3, ease: "power3" });
    const move = (e: MouseEvent) => {
      const r = card.getBoundingClientRect();
      xTo(e.clientX - r.left);
      yTo(e.clientY - r.top);
    };
    const enter = () => gsap.to(sticker, { autoAlpha: 1, scale: 1, duration: 0.35, ease: "back.out(2.2)" });
    const leave = () => gsap.to(sticker, { autoAlpha: 0, scale: 0.5, duration: 0.25, ease: "power2.in" });
    card.addEventListener("mousemove", move);
    card.addEventListener("mouseenter", enter);
    card.addEventListener("mouseleave", leave);
    return () => {
      card.removeEventListener("mousemove", move);
      card.removeEventListener("mouseenter", enter);
      card.removeEventListener("mouseleave", leave);
    };
  }, []);

  return (
    <Link
      ref={cardRef}
      href={href}
      onClick={(e) => {
        e.preventDefault();
        go(href);
      }}
      className="work-slide"
      data-hover
    >
      <div className="ws-media">
        <div className="ws-media-inner" style={{ backgroundImage: `url('${w.image}')` }} />
      </div>
      <div>
        <div className="ws-counter">
          <Asterisk size={12} /> {String(i + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </div>
        <div className="ws-name">
          {w.name} <ArrowUpRight size={24} />
        </div>
        <p className="body-lg">{w.summary}</p>
        <div className="ws-stat" style={{ display: "flex", flexDirection: "column", gap: "0.6rem", alignItems: "flex-start" }}>
          <Todo>Add a real result metric (e.g. ↑ enquiries, calls)</Todo>
          {w.slug === "abu-bakr-siddiq" && (
            <Todo>Rehost on a real domain — currently a free webflow.io subdomain</Todo>
          )}
        </div>
        <div className="label" style={{ marginTop: "1.5rem" }}>
          {w.services.join(" · ")} — {w.year}
        </div>
      </div>
      <span ref={stickerRef} className="work-sticker" aria-hidden>
        View project <ArrowUpRight size={13} />
      </span>
    </Link>
  );
}

/* --- FAQ (broken layout) --- id=faq --- */
function FAQ() {
  const head = useReveal<HTMLHeadingElement>();
  const items = [
    ["01", "How much does a website cost?", "Every project is a fixed, flat fee agreed before we start — no hourly billing and no surprise invoices. Most small-business sites land in a clear, predictable range we'll confirm on our first call."],
    ["02", "How long does it take?", "A typical build is around two weeks once we have your content. You approve every stage before we move on, so the timeline stays predictable."],
    ["03", "Do I actually own the site?", "Completely. Domain, hosting, and code are all in your name. There's no platform lock-in and nothing held hostage — if you ever leave, you take everything."],
    ["04", "Can I update it myself?", "Yes. We hand over a simple setup and walk you through it, so a non-technical person can edit text, swap images, and post updates without calling a developer."],
    ["05", "What happens after launch?", "We don't vanish. Need a tweak next year? Message us and we pick up. Ongoing support is part of how we work, not an upsell."],
  ];
  return (
    <section id="faq" className="section faq">
      <div className="faq-grid">
        <aside className="faq-aside">
          <div
            className="faq-aside-img"
            style={{ backgroundImage: `url('${works[0].image}')` }}
            aria-hidden
          />
          <p className="faq-aside-text">
            Still got unanswered questions? Or still wondering if a custom site is right for you?
          </p>
          <a href="#contact" className="faq-chat" data-hover>
            <span className="faq-chat-av">
              <Asterisk size={15} />
            </span>
            <span className="t">Chat with us</span>
          </a>
        </aside>
        <div className="faq-main">
          <h2 ref={head} className="faq-title">
            Frequently
            <br />
            Asked Questions
          </h2>
          <div className="faq-list">
            {items.map(([no, q, a]) => (
              <FaqItem key={no} no={no} q={q} a={a} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FaqItem({ no, q, a }: { no: string; q: string; a: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    gsap.to(el, { height: open ? "auto" : 0, duration: 0.6, ease: "power3.inOut" });
  }, [open]);
  const qid = `faq-q-${no}`;
  const aid = `faq-a-${no}`;
  return (
    <div className="faq-item" data-open={open}>
      <button
        type="button"
        className="faq-q-btn"
        id={qid}
        aria-expanded={open}
        aria-controls={aid}
        onClick={() => setOpen((o) => !o)}
        data-hover
      >
        <span className="faq-q">{q}</span>
        <span className="faq-toggle" aria-hidden>
          {open && <span className="faq-close-pill">Close</span>}
          <span className="faq-pm" />
        </span>
      </button>
      <div className="faq-a" id={aid} role="region" aria-labelledby={qid} ref={ref}>
        <div className="faq-a-inner">{a}</div>
      </div>
    </div>
  );
}

/* --- CONTACT --- id=contact --- */
function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const reduce = prefersReducedMotion();
    if (reduce) {
      gsap.set(section.querySelector(".contact-head"), { scale: 1, autoAlpha: 1, filter: "none" });
      gsap.set(section.querySelectorAll(".cw"), { yPercent: 0 });
      gsap.set(section.querySelector(".contact-forms"), { autoAlpha: 1, y: 0 });
      return;
    }
    const ctx = gsap.context(() => {
      // Scrubbed to scroll → the heading zooms in from "another dimension",
      // the lines rise in order (Ready → …), then the two forms arrive.
      const tl = gsap.timeline({
        scrollTrigger: { trigger: section, start: "top bottom", end: "top 16%", scrub: 0.8 },
      });
      tl.fromTo(
        ".contact-head",
        { scale: 0.32, autoAlpha: 0, filter: "blur(16px)" },
        { scale: 1, autoAlpha: 1, filter: "blur(0px)", ease: "power2.out" }
      )
        .fromTo(
          ".contact-head .cw",
          { yPercent: 115 },
          { yPercent: 0, stagger: 0.18, ease: "power3.out" },
          0.08
        )
        .fromTo(
          ".contact-forms",
          { autoAlpha: 0, y: 90 },
          { autoAlpha: 1, y: 0, ease: "power2.out" },
          0.55
        );
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section id="contact" ref={sectionRef} className="section contact">
      <div className="contact-zoom">
        <div className="spine-label" style={{ justifyContent: "center" }}>
          06 — Let&apos;s Work Together
        </div>
        <h2 className="contact-head">
          <span className="cw-line">
            <span className="cw">Ready</span>
          </span>
          <span className="cw-line">
            <span className="cw">to build something</span>
          </span>
          <span className="cw-line">
            <span className="cw">
              that works<span className="accent">?</span>
            </span>
          </span>
        </h2>
      </div>
      <div className="contact-forms">
        <BookCallForm />
        <QuoteForm />
      </div>
    </section>
  );
}

type CStatus = "" | "sending" | "ok" | "rate" | "err";

function mailtoFallback(p: Record<string, string>) {
  const subject =
    p.type === "quote"
      ? `Quote request — ${p.business || p.name || ""}`
      : `Book a call — ${p.name || ""}`;
  const body = Object.entries(p)
    .filter(([k]) => k !== "type" && k !== "company")
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");
  window.location.href = `mailto:aakif@auvancestudio.ca?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;
}

async function submitContact(
  payload: Record<string, string>,
  form: HTMLFormElement,
  setStatus: (s: CStatus) => void
) {
  setStatus("sending");
  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.status === 429) {
      setStatus("rate");
      return;
    }
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setStatus("err");
      return;
    }
    // delivered:false means no email provider is configured → open mailto.
    if (!data.delivered) mailtoFallback(payload);
    form.reset();
    setStatus("ok");
  } catch {
    mailtoFallback(payload);
    form.reset();
    setStatus("ok");
  }
}

function CStatusMsg({ status }: { status: CStatus }) {
  if (status === "sending") return <p className="cform-ok" role="status">Sending…</p>;
  if (status === "rate")
    return <p className="cform-ok" role="alert">Too many attempts — try again in a minute.</p>;
  if (status === "err")
    return <p className="cform-ok" role="alert">Please check your details and try again.</p>;
  return null;
}

function FormSuccess({
  no,
  heading,
  body,
  onReset,
}: {
  no: string;
  heading: string;
  body: string;
  onReset: () => void;
}) {
  return (
    <div className="cform" aria-label="Submitted">
      <div className="cform-head">
        <h3>Sent</h3>
        <span className="cform-no">{no}</span>
      </div>
      <div className="cform-success" role="status">
        <span className="tick">
          <Check size={22} />
        </span>
        <h4>{heading}</h4>
        <p>{body}</p>
        <button type="button" onClick={onReset} data-hover>
          Send another →
        </button>
      </div>
    </div>
  );
}

function BookCallForm() {
  const [status, setStatus] = useState<CStatus>("");
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    submitContact(
      {
        type: "call",
        name: String(f.get("name") || ""),
        email: String(f.get("email") || ""),
        phone: String(f.get("phone") || ""),
        time: String(f.get("time") || ""),
        msg: String(f.get("msg") || ""),
        company: String(f.get("company") || ""),
      },
      form,
      setStatus
    );
  };
  if (status === "ok")
    return (
      <FormSuccess
        no="A"
        heading="Your call request is in."
        body="I'll personally get back to you within one business day to lock in a time. Talk soon."
        onReset={() => setStatus("")}
      />
    );
  return (
    <form className="cform" onSubmit={onSubmit} aria-label="Book a call">
      <div className="cform-head">
        <h3>Book a Call</h3>
        <span className="cform-no">A</span>
      </div>
      <p className="sub">
        Grab a free 15-minute intro call — pick a time instantly, or send your details below.
      </p>
      <CalButton className="btn btn-primary cal-cta">
        <span>Pick a time — 15-min call →</span>
      </CalButton>
      <div className="label" style={{ textAlign: "center", margin: "0.4rem 0 1rem", opacity: 0.6 }}>
        or send your details
      </div>
      <div className="field">
        <label htmlFor="bc-name">Name</label>
        <input id="bc-name" name="name" required autoComplete="name" />
      </div>
      <div className="field">
        <label htmlFor="bc-email">Email</label>
        <input id="bc-email" name="email" type="email" required autoComplete="email" />
      </div>
      <div className="field-row">
        <div className="field">
          <label htmlFor="bc-phone">Phone</label>
          <input id="bc-phone" name="phone" type="tel" autoComplete="tel" />
        </div>
        <div className="field">
          <label htmlFor="bc-time">Preferred time</label>
          <input id="bc-time" name="time" placeholder="Weekday AM" />
        </div>
      </div>
      <div className="field">
        <label htmlFor="bc-msg">Anything else?</label>
        <textarea id="bc-msg" name="msg" rows={3} />
      </div>
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
      />
      <button type="submit" className="btn btn-primary" data-hover disabled={status === "sending"}>
        <span>{status === "sending" ? "Sending…" : "Request call →"}</span>
      </button>
      <CStatusMsg status={status} />
    </form>
  );
}

function QuoteForm() {
  const [status, setStatus] = useState<CStatus>("");
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    submitContact(
      {
        type: "quote",
        name: String(f.get("name") || ""),
        email: String(f.get("email") || ""),
        business: String(f.get("business") || ""),
        budget: String(f.get("budget") || ""),
        details: String(f.get("details") || ""),
        company: String(f.get("company") || ""),
      },
      form,
      setStatus
    );
  };
  if (status === "ok")
    return (
      <FormSuccess
        no="B"
        heading="Your quote request is in."
        body="I'll send you a clear, fixed-price estimate within one business day — no obligation."
        onReset={() => setStatus("")}
      />
    );
  return (
    <form className="cform" onSubmit={onSubmit} aria-label="Get a quote">
      <div className="cform-head">
        <h3>Get a Quote</h3>
        <span className="cform-no">B</span>
      </div>
      <p className="sub">Share a few details and we&apos;ll send a fixed-price estimate.</p>
      <div className="field">
        <label htmlFor="q-name">Name</label>
        <input id="q-name" name="name" required autoComplete="name" />
      </div>
      <div className="field-row">
        <div className="field">
          <label htmlFor="q-email">Email</label>
          <input id="q-email" name="email" type="email" required autoComplete="email" />
        </div>
        <div className="field">
          <label htmlFor="q-business">Business</label>
          <input id="q-business" name="business" autoComplete="organization" />
        </div>
      </div>
      <div className="field">
        <label htmlFor="q-budget">Budget</label>
        <select id="q-budget" name="budget" defaultValue="">
          <option value="" disabled>
            Select a range
          </option>
          <option>Founding rate — ~$1,500</option>
          <option>$2,000 – $2,500</option>
          <option>$3,000+</option>
          <option>Not sure yet</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="q-details">Project details</label>
        <textarea id="q-details" name="details" rows={3} required />
      </div>
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
      />
      <button type="submit" className="btn btn-ghost" data-hover disabled={status === "sending"}>
        <span>{status === "sending" ? "Sending…" : "Request quote →"}</span>
      </button>
      <CStatusMsg status={status} />
    </form>
  );
}
