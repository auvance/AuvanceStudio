"use client";

import Link from "next/link";
import { works, type Work } from "../../works";
import { useReveal, useParallax } from "../../animations";
import { useStinger } from "../../Stinger";
import { ArrowUpRight, Plus, Asterisk } from "../../svg";

export default function CaseStudy({ work }: { work: Work }) {
  const idx = works.findIndex((w) => w.slug === work.slug);
  const next = works[(idx + 1) % works.length];
  const go = useStinger();

  const title = useReveal<HTMLHeadingElement>({ y: 40 });
  const media = useParallax<HTMLDivElement>(0.08);
  const challenge = useReveal<HTMLDivElement>();
  const approach = useReveal<HTMLDivElement>();

  return (
    <article className="cs">
      <section className="cs-hero">
        <Plus className="hero-mark" style={{ top: "22vh", right: "5%" }} size={20} />
        <Link href="/#work" className="cs-back" data-hover>
          ← All work
        </Link>
        <div className="label">
          {work.tag} — {work.year}
        </div>
        <h1 ref={title} className="cs-title">
          {work.name}
        </h1>
        <p className="body-lg" style={{ maxWidth: "660px" }}>
          {work.summary}
        </p>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="cs-meta">
          <div>
            <div className="label">Client</div>
            {work.client}
          </div>
          <div>
            <div className="label">Services</div>
            {work.services.join(", ")}
          </div>
          <div>
            <div className="label">Year</div>
            {work.year}
          </div>
          {work.liveUrl && (
            <div>
              <div className="label">Live</div>
              <a href={work.liveUrl} target="_blank" rel="noreferrer" data-hover style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                Visit site <ArrowUpRight size={14} />
              </a>
              {work.liveUrl.includes("webflow.io") && (
                <div className="todo" role="note" style={{ marginTop: 6 }}>
                  ⚠ Rehost on a real domain — free webflow.io subdomain
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="cs-big-media">
          <div ref={media} className="cs-big-media-inner" style={{ backgroundImage: `url('${work.image}')` }} />
        </div>
      </section>

      <section className="section">
        <div className="cs-cols">
          <div ref={challenge} className="cs-block">
            <h3>The Challenge</h3>
            <p>{work.challenge}</p>
          </div>
          <div ref={approach} className="cs-block">
            <h3>Our Approach</h3>
            <p>{work.approach}</p>
            <h3>The Outcome</h3>
            <p style={{ marginBottom: 0 }}>{work.outcome}</p>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="cs-cols" style={{ alignItems: "center", marginBottom: "clamp(3rem,7vw,6rem)" }}>
          <div>
            <span className="todo" role="note">
              ⚠ Add a real headline metric for this project (replace the placeholder)
            </span>
            <div className="stat-label" style={{ maxWidth: 280, marginTop: 8 }}>
              {work.stat.label}
            </div>
          </div>
          <p className="body-lg" style={{ fontSize: "clamp(1.1rem,2vw,1.5rem)" }}>
            <Asterisk size={16} style={{ verticalAlign: "middle", color: "var(--accent)", marginRight: 8 }} />
            A site the team is finally proud to send — and that quietly does its job every day.
          </p>
        </div>
      </section>

      <CloserLook work={work} />

      <section className="section curtain-end">
        <div className="cs-next">
          <div>
            <div className="label" style={{ marginBottom: "0.75rem" }}>
              Next project
            </div>
            <Link
              href={`/work/${next.slug}`}
              onClick={(e) => {
                e.preventDefault();
                go(`/work/${next.slug}`);
              }}
              data-cursor="View ↗"
              data-hover
            >
              {next.name} <ArrowUpRight size={28} />
            </Link>
          </div>
          <Link href="/#contact" className="btn btn-primary" data-hover>
            <span>Start your project →</span>
          </Link>
        </div>
      </section>
    </article>
  );
}

/* "A closer look" — a bento image wall of the project's shots, shown at the
   very bottom of the case study. Real images come from work.gallery; the
   remaining tiles are red placeholders to drop more screenshots into. */
function CloserLook({ work }: { work: Work }) {
  const head = useReveal<HTMLHeadingElement>({ y: 30 });
  // bento layout — fill from work.gallery, pad the rest with "add image" tiles.
  const spans = ["bento-big", "bento-tall", "bento-wide", "bento-sm", "bento-sm", "bento-wide"];
  const labels = ["Full site", "Mobile view", "Key section", "Detail", "Detail", "Brand close-up"];
  const tiles = spans.map((span, i) => ({
    span,
    label: labels[i],
    img: work.gallery[i] || "",
  }));
  return (
    <section className="section cs-closer" style={{ paddingTop: 0 }}>
      <div className="spine-label">A closer look</div>
      <h2 ref={head} className="bento-h">
        A closer look.
      </h2>
      <div className="bento">
        {tiles.map((t, i) =>
          t.img ? (
            <div key={i} className={`bento-tile ${t.span}`} style={{ backgroundImage: `url('${t.img}')` }}>
              <span className="bento-label">{t.label}</span>
            </div>
          ) : (
            <div key={i} className={`bento-tile bento-tile--empty ${t.span}`}>
              <Plus size={22} />
              <span className="todo" role="note">
                ⚠ Add image — {t.label}
              </span>
            </div>
          )
        )}
      </div>
    </section>
  );
}
