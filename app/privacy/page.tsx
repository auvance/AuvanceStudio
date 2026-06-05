import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Auvance collects, uses, stores, and protects the personal information you share through this site.",
  alternates: { canonical: "/privacy" },
};

// Red marker for details only the founder can supply — shows on the live page.
function Todo({ children }: { children: React.ReactNode }) {
  return (
    <span className="todo" role="note">
      ⚠ {children}
    </span>
  );
}

const UPDATED = "March 2026";

export default function PrivacyPolicy() {
  return (
    <main className="legal">
      <h1>Privacy Policy</h1>
      <p className="legal-meta">
        Last updated: <Todo>Confirm/replace effective date — currently {UPDATED}</Todo>
      </p>

      <p>
        This policy explains what personal information Auvance (&ldquo;Auvance&rdquo;,
        &ldquo;we&rdquo;, &ldquo;us&rdquo;) collects when you use this website, why we collect it,
        and the choices you have. Auvance is a web-design studio operated as a sole proprietorship
        by <Todo>Add your full legal name</Todo> in Vancouver, British Columbia, Canada. We handle
        personal information in accordance with Canada&rsquo;s Personal Information Protection and
        Electronic Documents Act (PIPEDA) and British Columbia&rsquo;s Personal Information
        Protection Act (PIPA).
      </p>

      <h2>What we collect</h2>
      <p>We only collect what you choose to send us. Specifically:</p>
      <ul>
        <li>
          <strong>Contact-form details</strong> — your name, email address, and anything you type
          into the project / message fields when you book a call or request a quote.
        </li>
        <li>
          <strong>Technical data</strong> — your IP address is briefly processed to rate-limit the
          contact form and block spam. We do not use cookies, analytics, advertising trackers, or
          any third-party tracking on this site.
        </li>
      </ul>

      <h2>Why we use it</h2>
      <p>
        We use your information solely to read and respond to your enquiry, prepare a quote, and
        discuss a potential project. We do not sell, rent, or trade your personal information, and
        we will not add you to a marketing list or send you promotional email without your express
        consent.
      </p>

      <h2>How it&rsquo;s handled and where it goes</h2>
      <p>
        When you submit the contact form, your message is delivered to us by{" "}
        <a href="https://resend.com/legal/privacy-policy" target="_blank" rel="noreferrer">
          Resend, Inc.
        </a>{" "}
        (our email-delivery provider) and lands in our email inbox. Resend processes and stores this
        data on servers in the <strong>United States</strong>, which means your information may be
        accessible to U.S. authorities under U.S. law. By submitting the form you consent to this
        cross-border processing. We take reasonable safeguards to protect your information, but no
        method of transmission over the internet is completely secure.
      </p>

      <h2>How long we keep it</h2>
      <p>
        We keep enquiry messages only as long as needed to respond to you and, if we work together,
        for the duration of the project plus a reasonable period for our records. If you&rsquo;d like
        your information deleted sooner, just ask.
      </p>

      <h2>Your rights</h2>
      <p>
        Under PIPEDA and BC PIPA you have the right to access the personal information we hold about
        you, ask us to correct it, or ask us to delete it. To make any of these requests, contact us
        at the address below and we&rsquo;ll respond within a reasonable time.
      </p>

      <h2>Contact &amp; complaints</h2>
      <p>
        Questions or requests about your privacy? Email{" "}
        <a href="mailto:aakif@auvancestudio.ca">aakif@auvancestudio.ca</a> or call{" "}
        <a href="tel:+12369780637">+1 (236) 978 0637</a>.
      </p>
      <p>
        If you&rsquo;re not satisfied with our response, you may contact the Office of the Privacy
        Commissioner of Canada (
        <a href="https://www.priv.gc.ca" target="_blank" rel="noreferrer">
          priv.gc.ca
        </a>
        ) or the Office of the Information and Privacy Commissioner for British Columbia (
        <a href="https://www.oipc.bc.ca" target="_blank" rel="noreferrer">
          oipc.bc.ca
        </a>
        ).
      </p>

      <h2>Changes</h2>
      <p>
        We may update this policy from time to time. The &ldquo;last updated&rdquo; date at the top
        reflects the current version.
      </p>
    </main>
  );
}
