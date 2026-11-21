import Link from "next/link";
import { ThemeHeroImage } from "./theme-hero-image";
import { HomeScrollScene } from "@/components/home-scroll-scene";
import { MoreFeaturesGallery } from "@/components/more-features-gallery";

const highlights = [
  { title: "Privacy", text: "Mira does not collect your data.", href: "/privacy", linkLabel: "Read privacy policy" },
  { title: "Free", text: "Free to download and use." },
  { title: "Ad blocking", text: "Block ads and trackers, including YouTube ads." },
  { title: "Open source", text: "Read the code and contribute on GitHub." },
  { title: "Custom colors", text: "Change any browser color." },
  { title: "Layouts", text: "Choose your browser layout." },
];

const features = [
  { title: "Private and open source.", label: "Privacy & open source",
    text: "Mira does not collect your data. Its source code is public on GitHub.", href: "https://github.com/Mira-Studios/mira", link: "View source" },
  { title: "Ad blocking, built in.", label: "Ad blocking",
    text: "Block ads and trackers across the web, including video ads on YouTube." },
  { title: "Change any color.", label: "Customization",
    text: "Set every browser color, choose a layout, or start with a theme.", href: "/themes", link: "Browse themes" },
];

export default function Home() {
  return (
    <HomeScrollScene>
      <section className="hero">
        <div className="container">
          <div className="hero-stack">
            <div className="hero-copy">
              <h1 className="animate-fade-up" style={{ animationDelay: "80ms", lineHeight: "1.4" }}>
                <span className="font-solitreo" style={{ fontSize: "55px", lineHeight: "1", display: "inline-block", position: "relative", top: "-8px" }}>
                  mira
                </span>{" "}
                <span style={{ position: "relative", top: "-8px" }}>
                  is an open source desktop browser that helps you get everything done
                </span>
              </h1>
              <p className="muted-note animate-fade-up" style={{ animationDelay: "180ms", marginTop: "-0.7rem", marginBottom: "0.6rem" }}>
                Mira is inspired by the Japanese word 未来 (mirai), meaning &quot;future.&quot;
              </p>
              <div className="cta-row animate-fade-up" style={{ animationDelay: "280ms" }}>
                <Link href="/downloads" className="btn btn-primary">
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
              <p className="muted-note animate-fade-up" style={{ animationDelay: "320ms", marginTop: "0.75rem", fontSize: "0.85rem", marginBottom: "1.25rem" }}>
                Looking for the{" "}
                <Link href="/mobile" className="feature-card-link">
                  mobile app
                </Link>
                ?
              </p>
            </div>
            <div
              className="hero-card hero-card--app"
            >
              <ThemeHeroImage featureScreenshots />
            </div>
          </div>
        </div>
      </section>

      <section className="section home-features" aria-label="Mira highlights">
        <div className="container">
          <div className="home-highlight-grid">
            {highlights.map((item, index) => (
              <article key={item.title} className="home-highlight animate-fade-up" style={{ animationDelay: `${220 + index * 60}ms` }}>
                <h2>{item.title}</h2>
                <p>{item.text}</p>
                {item.href ? <Link href={item.href} className="home-highlight-link">Privacy policy</Link> : null}
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="home-feature-story" aria-label="Explore Mira">
        {features.map((feature, index) => (
          <div className="home-feature-step" key={feature.label} data-side={index % 2 === 0 ? "left" : "right"}>
            <article className="home-story-card">
              <h2>{feature.title}</h2>
              <p className="home-story-description">{feature.text}</p>
              {feature.href ? <Link href={feature.href} className="home-story-link">{feature.link}</Link> : null}
              {index === 0 ? <Link href="/privacy" className="home-story-link">Privacy policy</Link> : null}
            </article>
          </div>
        ))}
      </section>
      <MoreFeaturesGallery />
    </HomeScrollScene>
  );
}
