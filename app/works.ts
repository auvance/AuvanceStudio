/* ============================================
   Shared work / case-study data.
   Drives the home work-rail AND the reusable
   /work/[slug] case-study template.
   ============================================ */

export type Work = {
  slug: string;
  name: string;
  client: string;
  tag: string;
  year: string;
  services: string[];
  image: string;
  summary: string;
  challenge: string;
  approach: string;
  outcome: string;
  stat: { value: string; label: string };
  gallery: string[];
  liveUrl?: string;
};

export const works: Work[] = [
  {
    slug: "abu-bakr-siddiq",
    name: "Abu Bakr Siddiq Mosque",
    client: "Abu Bakr Siddiq Mosque",
    tag: "Website · Community Presence",
    year: "2026",
    services: ["Web Design", "Development", "Local SEO"],
    image: "/work/abubakr-siddiq.png",
    summary:
      "A warm, trustworthy digital home for a growing Vancouver community — prayer times, events, and donations, all in one calm place.",
    challenge:
      "The mosque relied on word of mouth and scattered social posts. Newcomers struggled to find prayer times, directions, or how to get involved — and the community had no central, dignified place online.",
    approach:
      "We designed around the two people who matter most: the newcomer looking for prayer times tonight, and the regular wanting to give or volunteer. Clear hierarchy, large legible type, and a single source of truth for events — built to be updated by a non-technical volunteer in minutes.",
    outcome:
      "A presence the community is proud to share. Prayer times and events are now front-and-centre, donations are one tap away, and the mosque finally looks as established online as it is in person.",
    stat: { value: "1", label: "Calm home for the whole community" },
    gallery: ["/work/abubakr-siddiq.png", "/work/abwab-ventures.png"],
    liveUrl: "https://abubakrsiddiq.webflow.io",
  },
  {
    slug: "abwab-ventures",
    name: "Abwab Ventures",
    client: "Abwab Ventures",
    tag: "Lead Forms · More Sign-ups",
    year: "2025",
    services: ["Web Design", "Conversion", "Lead Forms"],
    image: "/work/abwab-ventures.png",
    summary:
      "A sharper, more credible site for a ventures firm — engineered around one job: turning visitors into qualified conversations.",
    challenge:
      "Abwab had momentum but a site that undersold it. The messaging buried what they actually do, and the contact path was an afterthought — so good-fit leads slipped away.",
    approach:
      "We rebuilt the narrative top-down: a confident hero, proof early, and a frictionless enquiry form placed exactly where intent peaks. Every section ends with a clear next step, and the whole thing loads fast on the phones most visitors use.",
    outcome:
      "A site that finally matches the ambition of the team behind it — more enquiries, better-qualified, and a brand that reads as serious from the first scroll.",
    stat: { value: "↑", label: "More qualified sign-ups" },
    gallery: ["/work/abwab-ventures.png", "/work/abubakr-siddiq.png"],
    liveUrl: "https://abwab.ca",
  },
];

export const getWork = (slug: string) => works.find((w) => w.slug === slug);
