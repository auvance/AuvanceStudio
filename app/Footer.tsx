import { ArrowUpRight } from "./svg";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="footer-crown" aria-hidden>
        <img className="crown-white" src="/crown-white.svg" alt="" style={{ width: "100%" }} />
        <img className="crown-black" src="/crown-black.svg" alt="" style={{ width: "100%" }} />
      </div>

      <div className="footer-meta">
        <span>© {year} — All Rights Reserved</span>
        <a href="#top" data-hover>
          Back to top <ArrowUpRight size={13} />
        </a>
        <span>EST © 2023 — Auvance Studio</span>
      </div>

      <div className="footer-contacts">
        <div className="fc">
          <h5>Phone Number</h5>
          <a href="tel:+12369780637" data-hover>
            +1 (236) 978 0637
          </a>
        </div>
        <div className="fc">
          <h5>Location</h5>
          <span>Based in Vancouver, BC</span>
        </div>
        <div className="fc">
          <h5>Address</h5>
          <span>2628 Duke St, Kingsway</span>
        </div>
        <div className="fc">
          <h5>Email</h5>
          <a href="mailto:therealauvance@gmail.com" data-hover>
            therealauvance@gmail.com
          </a>
        </div>
      </div>

      <div className="footer-divider" />
      <div className="footer-brand">auvANcE</div>
    </footer>
  );
}
