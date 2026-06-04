import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "The terms that govern your use of the Auvance website. A short, plain-language agreement.",
  alternates: { canonical: "/terms" },
};

function Todo({ children }: { children: React.ReactNode }) {
  return (
    <span className="todo" role="note">
      ⚠ {children}
    </span>
  );
}

const UPDATED = "March 2026";

export default function Terms() {
  return (
    <main className="legal">
      <h1>Terms of Use</h1>
      <p className="legal-meta">
        Last updated: <Todo>Confirm/replace effective date — currently {UPDATED}</Todo>
      </p>

      <p>
        These terms govern your use of this website, operated by Auvance, a web-design studio based
        in Vancouver, British Columbia, Canada. By using the site you agree to them. If you
        don&rsquo;t agree, please don&rsquo;t use the site.
      </p>

      <h2>Our content</h2>
      <p>
        All design, code, text, graphics, the Auvance name, and the crown mark on this site are
        owned by Auvance (or used with permission) and are protected by copyright and trademark law.
        You may view and share links to the site, but you may not copy, reproduce, or reuse its
        design or content without our written permission.
      </p>

      <h2>No warranty</h2>
      <p>
        The site and everything on it — including any case studies, examples, or statements about
        past results — are provided &ldquo;as is&rdquo; for general information. We make no
        guarantees that the information is complete, current, or error-free, and nothing on the site
        is a promise of any specific outcome for your project.
      </p>

      <h2>Contacting us isn&rsquo;t a contract</h2>
      <p>
        Sending us a message, booking a call, or requesting a quote does not create a client
        relationship or any binding agreement. Any project we take on is governed by a separate
        written proposal or agreement that we both sign, which sets out scope, price, timeline, and
        ownership of the work.
      </p>

      <h2>Acceptable use</h2>
      <p>
        Please don&rsquo;t misuse the site — that includes attempting to break or overload it,
        scraping it, abusing the contact form, or using it for anything unlawful.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, Auvance is not liable for any loss or damage arising
        from your use of, or inability to use, this website.
      </p>

      <h2>Governing law</h2>
      <p>
        These terms are governed by the laws of British Columbia and the applicable laws of Canada.
        Any dispute relating to the site will be handled in the courts of British Columbia.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about these terms? Email{" "}
        <a href="mailto:therealauvance@gmail.com">therealauvance@gmail.com</a>.
      </p>
    </main>
  );
}
