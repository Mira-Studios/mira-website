import Link from "next/link";
import { ThemeHeroImage } from ".././mobile-theme-hero-image";

const highlights = [
  {
    title: "Custom Themes",
    text: "Style Mira to match your setup with customizable theming.",
  },
  {
    title: "Custom Layouts",
    text: "Choose layouts that fit how you like to browse.",
  },
  {
    title: "Efficiency",
    text: "Mira is designed to use memory efficiently during everyday browsing.",
  },
  {
    title: "Built to Evolve",
    text: "Open source development keeps Mira highly customizable over time.",
  },
  {
    title: "Avoid Tracking",
    text: "Mira comes with a built-in tracker blocker so you can browse the internet safely."
  },
  {
    title: "Free",
    text: "Mira is and will always be completely free!"
  },
  {
    title: "Privacy By Default",
    text: "Mira does not collect your personal data or usage analytics.",
    href: "/privacy",
    linkLabel: "Read privacy policy",
  },
];

export default function Home() {
  return (
    <main className="page-enter">
      <section className="hero">
        <div className="container">
          <div className="hero-stack">
            <div className="hero-copy">
              <h1 className="animate-fade-up" style={{ animationDelay: "80ms", lineHeight: "1.4" }}>
                <span className="font-solitreo" style={{ fontSize: "55px", lineHeight: "1", display: "inline-block", position: "relative", top: "-8px" }}>
                  mira
                </span>{" "}
                <span style={{ position: "relative", top: "-8px" }}>
                  is an open source mobile browser that helps you get everything done
                </span>
              </h1>
              <p className="muted-note animate-fade-up" style={{ animationDelay: "180ms", marginTop: "-0.7rem", marginBottom: "0.6rem" }}>
                Mira is inspired by the Japanese word 未来 (mirai), meaning &quot;future.&quot;
              </p>
              <div className="cta-row animate-fade-up" style={{ animationDelay: "280ms" }}>
                <Link href="/downloads?platform=mobile" className="btn btn-primary">
                  Download Mira
                </Link>
                <a
                  href="https://github.com/Mira-Studios/mira"
                  className="btn btn-ghost"
                  target="_blank"
                  rel="noreferrer"
                >
                  View Source
                </a>  
              </div>
              <p className="muted-note animate-fade-up" style={{ animationDelay: "320ms", marginTop: "0.75rem", fontSize: "0.85rem" }}>
                Looking for the{" "}
                <Link href="/" className="feature-card-link">
                  desktop app
                </Link>
                ?
              </p>
            </div>
            <div
              className="hero-card hero-card--mobile animate-fade-in-scale"
              style={{ animationDelay: "210ms" }}
            >
              <ThemeHeroImage />
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="feature-grid">
            {highlights.map((item, idx) => (
              <article
                key={item.title}
                className="feature-card animate-fade-up"
                style={{ animationDelay: `${220 + idx * 120}ms` }}
              >
                <h2>{item.title}</h2>
                <p>{item.text}</p>
                {"href" in item && item.href ? (
                  <p>
                    <Link href={item.href} className="feature-card-link">
                      {item.linkLabel}
                    </Link>
                  </p>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
