import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for Mira Browser and the Mira Website.",
  alternates: {
    canonical: `${getSiteUrl()}/privacy`,
  },
};

export default function PrivacyPage() {
  return (
    <main className="section page-enter">
      <div className="container narrow">
        <h1 className="animate-fade-up" style={{ animationDelay: "80ms" }}>Privacy</h1>

        <div className="privacy-card-stack">
          <article className="notice animate-fade-up" style={{ animationDelay: "220ms" }}>
            <p>
              Your privacy matters. This policy explains what data we collect across Mira Browser and the Mira Website.
            </p>
          </article>

          <div className="terms-section animate-fade-up" style={{ animationDelay: "300ms" }}>
            <div className="terms-section-header">
              <h2>Mira Browser</h2>
            </div>
            <div className="privacy-columns">
              <section className="privacy-column">
                <h3>What We Don&apos;t Collect</h3>
                <ul className="privacy-list">
                  <li>- Personal information</li>
                  <li>- Browsing history</li>
                  <li>- Advertising identifiers</li>
                  <li>- Analytics or behavior tracking</li>
                  <li>- Everything else</li>
                </ul>
              </section>
              <section className="privacy-column">
                <h3>What We Do Collect</h3>
                <ul className="privacy-list">
                  <li>- Nothing</li>
                </ul>
              </section>
            </div>
          </div>

          <div className="terms-section animate-fade-up" style={{ animationDelay: "380ms" }}>
            <div className="terms-section-header">
              <h2>Mira Website</h2>
            </div>
            <div className="privacy-columns">
              <section className="privacy-column">
                <h3>Account Data</h3>
                <p>
                  When you create an account, we store your email address and authentication credentials. This data is used solely for account management and is not shared with third parties.
                </p>
              </section>
              <section className="privacy-column">
                <h3>Themes</h3>
                <p>
                  Themes you upload are stored and made available to other users for download. Theme files may include metadata such as the theme name and author.
                </p>
              </section>
            </div>
          </div>

          <article className="feature-card animate-fade-up" style={{ animationDelay: "460ms" }}>
            <h2>Contact</h2>
            <p>
              If you have questions about this privacy policy, please contact us.
            </p>
          </article>
        </div>
      </div>
    </main>
  );
}
