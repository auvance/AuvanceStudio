import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { works, getWork } from "../../works";
import CaseStudy from "./CaseStudy";

export function generateStaticParams() {
  return works.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const w = getWork(slug);
  if (!w) return { title: "Work" };
  return {
    title: w.name, // title template adds "— Auvance"
    description: w.summary,
    alternates: { canonical: `/work/${w.slug}` },
    openGraph: {
      url: `/work/${w.slug}`,
      title: `${w.name} — Auvance`,
      description: w.summary,
    },
    twitter: { title: `${w.name} — Auvance`, description: w.summary },
  };
}

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://auvance.ca";

export default async function WorkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const work = getWork(slug);
  if (!work) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: work.name,
    headline: work.name,
    description: work.summary,
    url: `${SITE}/work/${work.slug}`,
    dateCreated: work.year,
    creator: { "@type": "Organization", "@id": `${SITE}/#org`, name: "Auvance" },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CaseStudy work={work} />
    </>
  );
}
