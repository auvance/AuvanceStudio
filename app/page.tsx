"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import {
  useReveal,
  useLineReveal,
  useCountUp,
  useScrollHighlight,
  useTilt,
  useHorizontalScroll,
} from "./animations";
import { works } from "./works";
import { useStinger } from "./Stinger";
import { Plus, Asterisk, Globe, ArrowUpRight, Dot, gradientPreview } from "./svg";

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
      <Services />
      <Process />
      <WorkRail />
      <FAQ />
      <Contact />
    </>
  );
}

/* --- HERO --- */
function Hero() {
  return (
    <section id="top" className="hero">
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
          <span className="line-inner">that work as hard</span>
        </span>
        <span className="line">
          <span className="line-inner">
            as you do<span className="accent">.</span>
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

      <div className="hero-strip" aria-hidden>
        <div className="hs" style={{ backgroundImage: `url('${works[0].image}')` }} />
        <div className="hs" style={{ backgroundImage: `url('${gradientPreview(1, "Design")}')` }} />
        <div className="hs" style={{ backgroundImage: `url('${works[1].image}')` }} />
        <div className="hs" style={{ backgroundImage: `url('${gradientPreview(3, "Strategy")}')` }} />
      </div>
    </section>
  );
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
        <Stat value={100} suffix="%" label="You own everything" />
        <Stat value={1} suffix="×" label="Flat build fee" />
        <Stat value={14} suffix="d" label="Typical timeline" />
        <StaticStat symbol="∞" label="Support after launch" />
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
      <div className="stack">
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
    <div className="stack-card" style={{ top: `${12 + i * 2.2}vh` }}>
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

/* --- SERVICES (hover image reveal) --- id=services --- */
function Services() {
  const head = useReveal<HTMLHeadingElement>();
  const services: [string, string, string][] = [
    ["01", "Conversion-First Design", "Every page designed around the customer you want to reach — never a generic template."],
    ["02", "Lead-Getting Forms", "Clear calls to action and forms that make it effortless to book, call, or enquire."],
    ["03", "Standout Local Presence", "Built to look more credible than your competitors, so customers choose you first."],
    ["04", "Fast, Owned & Yours", "Lightning-fast, SEO-ready, and 100% yours after launch — code, hosting, domain."],
  ];
  return (
    <section id="services" className="section" style={{ background: "var(--surface)" }}>
      <div className="spine-label">02 — What We Do</div>
      <h2 ref={head} className="h2" style={{ maxWidth: "820px", marginBottom: "3rem" }}>
        Every decision made around one goal — results.
      </h2>
      <ServiceList services={services} />
    </section>
  );
}

function ServiceList({ services }: { services: [string, string, string][] }) {
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    gsap.set(img, { autoAlpha: 0, scale: 0.92 });
    const xTo = gsap.quickTo(img, "x", { duration: 0.5, ease: "power3" });
    const yTo = gsap.quickTo(img, "y", { duration: 0.5, ease: "power3" });
    const move = (e: MouseEvent) => {
      xTo(e.clientX - img.offsetWidth / 2);
      yTo(e.clientY - img.offsetHeight / 2);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  const enter = (src: string) => {
    const img = imgRef.current;
    if (!img) return;
    img.src = src;
    gsap.to(img, { autoAlpha: 1, scale: 1, duration: 0.4, ease: "power3.out" });
  };
  const leave = () => {
    if (imgRef.current) gsap.to(imgRef.current, { autoAlpha: 0, scale: 0.92, duration: 0.4, ease: "power3.out" });
  };

  return (
    <div className="svc-list" onMouseLeave={leave}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img ref={imgRef} className="svc-preview" alt="" />
      {services.map((s, i) => (
        <div key={s[0]} className="svc-row" data-hover onMouseEnter={() => enter(gradientPreview(i, s[1]))}>
          <span className="svc-row-title">
            <span className="svc-row-no">{s[0]}</span>
            {s[1]}
          </span>
          <span className="body-lg" style={{ maxWidth: "360px", textAlign: "right" }}>
            {s[2]}
          </span>
        </div>
      ))}
    </div>
  );
}

/* --- PROCESS --- id=process --- */
function Process() {
  const steps: [string, string, string][] = [
    ["01", "Discovery", "We meet — at your place or on a call. A real conversation about your business and your customers. Free, no pitch."],
    ["02", "Design", "You see and approve every stage before a single line of code. We lock the scope so there are no surprises."],
    ["03", "Build", "We handle the domain, hosting, and launch. You get a walkthrough so you know exactly how to manage it."],
    ["04", "Yours", "Live, owned, and supported. You own the site outright — and we're one text away whenever you need us."],
  ];
  return (
    <section id="process" className="section">
      <EditorialHead left="/ The Process" right="Four steps — 03">
        Simple process. No surprises.{" "}
        <span className="ed-dim">
          You see and approve every stage before a single line of code — then it&apos;s live, owned, and supported.
        </span>
      </EditorialHead>
      <div>
        {steps.map(([num, title, desc]) => (
          <Row key={num} num={num} title={title} desc={desc} />
        ))}
      </div>
    </section>
  );
}

function Row({ num, title, desc }: { num: string; title: string; desc: string }) {
  const ref = useReveal<HTMLDivElement>({ y: 24 });
  return (
    <div ref={ref} className="row">
      <span className="row-num">{num}</span>
      <span className="row-title">
        {title}
        <span className="row-arrow">
          <ArrowUpRight size={20} />
        </span>
      </span>
      <span className="row-desc body-lg">{desc}</span>
    </div>
  );
}

/* --- WORK RAIL (horizontal) --- id=work --- */
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
  return (
    <Link
      href={href}
      onClick={(e) => {
        e.preventDefault();
        go(href);
      }}
      className="work-slide"
      data-cursor="View ↗"
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
        <div className="ws-stat">
          <b>{w.stat.value}</b>
          <span className="label">{w.stat.label}</span>
        </div>
        <div className="label" style={{ marginTop: "1.5rem" }}>
          {w.services.join(" · ")} — {w.year}
        </div>
      </div>
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
  const head = useLineReveal<HTMLHeadingElement>();
  return (
    <section id="contact" className="section contact">
      <div className="ghost-text" style={{ bottom: 0, left: "50%", transform: "translateX(-50%)" }}>
        HELLO
      </div>
      <div className="spine-label" style={{ justifyContent: "center" }}>
        06 — Let&apos;s Work Together
      </div>
      <h2 ref={head} className="h1" style={{ maxWidth: "1000px", margin: "0 auto 1.5rem" }}>
        <span className="line">
          <span className="line-inner">Ready to build</span>
        </span>
        <span className="line">
          <span className="line-inner">
            something that works<span className="accent">?</span>
          </span>
        </span>
      </h2>
      <p className="body-lg" style={{ maxWidth: "560px", margin: "0 auto" }}>
        Pick your path — book a quick call, or get a tailored quote. No pressure either way.
      </p>
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
  window.location.href = `mailto:therealauvance@gmail.com?subject=${encodeURIComponent(
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
  if (status === "ok")
    return <p className="cform-ok" role="status">Thanks — we&apos;ll be in touch shortly.</p>;
  if (status === "rate")
    return <p className="cform-ok" role="alert">Too many attempts — try again in a minute.</p>;
  if (status === "err")
    return <p className="cform-ok" role="alert">Please check your details and try again.</p>;
  return null;
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
  return (
    <form className="cform" onSubmit={onSubmit} aria-label="Book a call">
      <div className="cform-head">
        <h3>Book a Call</h3>
        <span className="cform-no">A</span>
      </div>
      <p className="sub">A free 20-minute discovery call. Tell us when suits you.</p>
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
          <option>Under $2k</option>
          <option>$2k – $5k</option>
          <option>$5k – $10k</option>
          <option>$10k+</option>
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
