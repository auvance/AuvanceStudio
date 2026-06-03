import Link from "next/link";
import { ArrowUpRight } from "./svg";

// Scattered crown positions (top/left %, size px, rotation deg)
const CROWNS: { top: string; left: string; size: number; rot: number }[] = [
  { top: "4%", left: "8%", size: 96, rot: -14 },
  { top: "10%", left: "60%", size: 130, rot: 10 },
  { top: "8%", left: "85%", size: 84, rot: -6 },
  { top: "26%", left: "22%", size: 110, rot: 16 },
  { top: "30%", left: "78%", size: 100, rot: -10 },
  { top: "44%", left: "4%", size: 120, rot: 8 },
  { top: "48%", left: "44%", size: 78, rot: -18 },
  { top: "52%", left: "90%", size: 104, rot: 12 },
  { top: "66%", left: "16%", size: 92, rot: -8 },
  { top: "70%", left: "68%", size: 124, rot: 14 },
  { top: "82%", left: "34%", size: 108, rot: -12 },
  { top: "84%", left: "82%", size: 88, rot: 6 },
  { top: "88%", left: "6%", size: 80, rot: 18 },
  { top: "60%", left: "54%", size: 70, rot: -4 },
];

export default function NotFound() {
  return (
    <section className="notfound">
      <div className="nf-crowns" aria-hidden>
        {CROWNS.map((c, i) => (
          <span
            key={i}
            className="nf-crown"
            style={{ top: c.top, left: c.left, width: c.size, transform: `rotate(${c.rot}deg)` }}
          >
            <img className="crown-white" src="/crown-white.svg" alt="" />
            <img className="crown-black" src="/crown-black.svg" alt="" />
          </span>
        ))}
      </div>

      <div className="nf-content">
        <div className="nf-404">404</div>
        <p className="nf-msg">
          Sorry, this page
          <br />
          doesn&apos;t exist.
        </p>
        <Link href="/" className="btn btn-primary" data-hover>
          <span>
            Go home <ArrowUpRight size={14} />
          </span>
        </Link>
      </div>
    </section>
  );
}
