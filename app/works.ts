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
    gallery: ["/work/abubakr-siddiq.png"],
    liveUrl: "https://asicbrentwood.ca",
  },
  {
    slug: "tendycutz",
    name: "TendyCutz",
    client: "TendyCutz Lawn & Yard Care",
    tag: "Website · More Booked Jobs",
    year: "2025",
    services: ["Web Design", "Development", "Local SEO"],
    image: "/work/tendycutz.png",
    summary:
      "A trustworthy home base for a solo lawn-care operator — built to turn neighbours into booked jobs and recurring Care Club clients.",
    challenge:
      "A one-person yard-care business in Port Coquitlam running entirely on word of mouth. No website meant no easy way for neighbours to see the services, the proof, or how to book — and recurring work was left on the table.",
    approach:
      "We built the site around the two things that win local jobs: proof and a frictionless next step. Real before-and-after work and neighbour reviews up front, the personal 'just me — no random crews' angle, clear services, and a quote/booking path that nudges one-off jobs into the Weekly Care Club.",
    outcome:
      "A credible site he can send every lead to — easier to book, easier to trust, and engineered to convert one-time cleanups into recurring monthly clients.",
    stat: { value: "↑", label: "More booked jobs & recurring clients" },
    gallery: ["/work/tendycutz.png"],
    liveUrl: "https://tendycutz.ca",
  },
  {
    slug: "student-software-association",
    name: "Student Software Association",
    client: "Student Software Association",
    tag: "Website · Student Community",
    year: "2025",
    services: ["Web Design", "Development", "Events"],
    image: "/work/ssa.png",
    summary:
      "A modern home base for a campus software community — events, membership, and resources in one fast, easy-to-update place.",
    challenge:
      "The association lived across group chats, a patchwork of docs, and a dated page nobody updated. New students couldn't find meeting times or how to join, and the exec team had no simple way to keep things current.",
    approach:
      "We built a clean, fast site centred on the two things that matter: what's happening next, and how to get involved. Events and sign-ups sit front-and-centre, the visual language feels current to a technical student audience, and the whole thing is simple enough for next year's exec to maintain without touching code.",
    outcome:
      "A credible, central hub the club is proud to share at every fair and orientation — easier to discover, easier to join, and finally consistent with how active the community actually is.",
    stat: { value: "↑", label: "Easier to discover and join" },
    gallery: ["/work/ssa.png"],
  },
];

export const getWork = (slug: string) => works.find((w) => w.slug === slug);
