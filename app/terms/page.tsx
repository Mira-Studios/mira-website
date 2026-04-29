import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms of use for Mira Browser and the Mira Website.",
  alternates: {
    canonical: `${getSiteUrl()}/terms`,
  },
};

export default function TermsPage() {
  return (
    <main className="section page-enter">
      <div className="container narrow">
        <h1 className="animate-fade-up" style={{ animationDelay: "80ms" }}>Terms of Use</h1>

        <div className="privacy-card-stack">
          <article className="notice animate-fade-up" style={{ animationDelay: "220ms" }}>
            <p>
              By using Mira Browser or the Mira Website, you agree to these terms of use.
            </p>
          </article>

          <div className="terms-section animate-fade-up" style={{ animationDelay: "300ms" }}>
            <div className="terms-section-header">
              <h2>Mira Browser</h2>
            </div>
            <div className="privacy-columns">
              <section className="privacy-column">
                <h3>Software License</h3>
                <p>
                  Mira Browser is licensed under the MIT License. You are free to use, modify, distribute, and sublicense this software under the terms of this license.
                </p>
              </section>
              <section className="privacy-column">
                <h3>Use at Your Own Risk</h3>
                <p>
                  Mira is provided "as-is", without warranty of any kind. The authors are not liable for any damages arising from its use.
                </p>
              </section>
            </div>
          </div>

          <div className="terms-section animate-fade-up" style={{ animationDelay: "380ms" }}>
            <div className="terms-section-header">
              <h2>Mira Website</h2>
            </div>
            <div className="privacy-columns">
              <section className="privacy-column">
                <h3>Accounts</h3>
                <p>
                  You may create an account to upload and download browser themes. You are responsible for maintaining the security of your account and all activity that occurs under it.
                </p>
              </section>
              <section className="privacy-column">
                <h3>User Content</h3>
                <p>
                  By uploading themes, you grant us a license to host and distribute your content to other users. You retain ownership of your themes. Do not upload content that violates copyright or applicable laws.
                </p>
              </section>
            </div>
          </div>

          <article className="feature-card animate-fade-up" style={{ animationDelay: "460ms" }}>
            <h2>Third-Party Content</h2>
            <p>
              Mira displays web content from third parties. You are responsible for your interactions with external websites and their respective terms of service and privacy policies.
            </p>
          </article>

          <article className="feature-card animate-fade-up" style={{ animationDelay: "540ms" }}>
            <h2>Modifications</h2>
            <p>
              We may update these terms occasionally. Continued use of Mira constitutes acceptance of any changes. The latest version will always be available at this URL.
            </p>
          </article>
        </div>
      </div>
    </main>
  );
}
