"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { ThemeHeroImage } from "../theme-hero-image";

const highlights = [
  { title: "Privacy By Default", text: "Mira does not collect your data.", href: "/privacy", linkLabel: "Read privacy policy" },
  { title: "Free", text: "Mira is and will always be completely free!" },
  { title: "Avoid Tracking", text: "Mira comes with a built-in tracker blocker so you can browse the internet safely." },
  { title: "Open Source", text: "Mira growing and improving." },
  { title: "Custom Themes", text: "Style Mira to match your setup with customizable theming." },
  { title: "Custom Layouts", text: "Choose layouts that fit how you like to browse." },
];

export default function Home() {
  const [hasScrolled, setHasScrolled] = useState(false);
  const rawProgress = useMotionValue(0);
  const progress = useSpring(rawProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (window.scrollY < 1) {
        const current = rawProgress.get();
        if ((e.deltaY > 0 && current < 1) || (e.deltaY < 0 && current > 0)) {
          e.preventDefault();
          if (!hasScrolled) setHasScrolled(true);
          rawProgress.set(Math.min(Math.max(current + e.deltaY * 0.0012, 0), 1));
        }
      }
    };
    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [rawProgress, hasScrolled]);

  // Transform Mappings
  const textY = useTransform(progress, [0, 1], ["0%", "-140%"]);
  const cardsOpacity = useTransform(progress, [0, 0.3], [1, 0]);
  const cardsY = useTransform(progress, [0, 0.3], [0, -60]);

  // Image Mappings
  const imageScale = useTransform(progress, [0, 1], [1, 1.6]);
  const imageX = useTransform(progress, [0, 1], ["0%", "-25%"]);
  const imageY = useTransform(progress, [0, 1], ["-290px", "-130px"]);

  return (
    <main className="page-enter" style={{ overflowX: "hidden" }}>
      <div style={{ position: "relative", height: "100vh", width: "100%" }}>
        
        <section className="hero">
          <div className="container">
            <div className="hero-stack">
              
              {/* Text Layer */}
              <motion.div 
                style={{ 
                  y: hasScrolled ? textY : "0%", 
                  zIndex: 10,           // High z-index to stay on top
                  position: "relative",  // Required for z-index to work
                  pointerEvents: "none"  // Prevents the container from blocking clicks to the image
                }}
              >
                <div className="hero-copy" style={{ pointerEvents: "auto" }}>
                  <h1 className="animate-fade-up" style={{ animationDelay: "80ms", lineHeight: "1.4" }}>
                    <span className="font-solitreo" style={{ fontSize: "55px", lineHeight: "1", display: "inline-block", position: "relative", top: "-8px" }}>
                      mira
                    </span>{" "}
                    <span style={{ position: "relative", top: "-8px" }}>
                      is an open source desktop browser that helps you get everything done
                    </span>
                  </h1>
                  <div className="cta-row animate-fade-up" style={{ animationDelay: "280ms" }}>
                    <Link href="/downloads" className="btn btn-primary">Download Mira</Link>
                    <a href="https://github.com/Mira-Studios/mira" className="btn btn-ghost" target="_blank" rel="noreferrer">View Source</a>
                  </div>
                </div>
              </motion.div>

              {/* Image Layer */}
              <motion.div 
                style={{ 
                  scale: hasScrolled ? imageScale : 1, 
                  x: hasScrolled ? imageX : "0%", 
                  y: hasScrolled ? imageY : "-290px",
                  zIndex: 1,            // Lower z-index so it stays behind
                  position: "relative",  // Required for z-index to work
                  transformOrigin: "center center"
                }}
                transformTemplate={({ scale, x, y }) => `translate3d(${x}, ${y}, 0) scale(${scale})`}
              >
                <div className="hero-card hero-card--app animate-fade-in-scale" style={{ animationDelay: "210ms" }}>
                  <ThemeHeroImage />
                </div>
              </motion.div>

            </div>
          </div>
        </section>

        <section className="section" style={{ position: "absolute", bottom: "8%", width: "100%", pointerEvents: "none" }}>
          <div className="container" style={{ pointerEvents: "auto" }}>
            <motion.div style={{ opacity: hasScrolled ? cardsOpacity : 1, y: hasScrolled ? cardsY : 0 }}>
              <div className="feature-grid">
                {highlights.map((item, idx) => (
                  <article key={item.title} className="feature-card animate-fade-up" style={{ animationDelay: `${220 + idx * 100}ms` }}>
                    <h2>{item.title}</h2>
                    <p>{item.text}</p>
                  </article>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

      </div>
    </main>
  );
}