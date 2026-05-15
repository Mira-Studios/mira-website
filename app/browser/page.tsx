"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
} from "framer-motion";
import { ThemeHeroImage } from "../theme-hero-image";

const highlights = [
  {
    title: "Privacy By Default",
    text: "Mira does not collect your data.",
    href: "/privacy",
    linkLabel: "Read privacy policy",
  },
  {
    title: "Free",
    text: "Mira is and will always be completely free!",
  },
  {
    title: "Avoid Tracking",
    text: "Mira comes with a built-in tracker blocker so you can browse the internet safely.",
  },
  {
    title: "Open Source",
    text: "Mira growing and improving.",
  },
  {
    title: "Custom Themes",
    text: "Style Mira to match your setup with customizable theming.",
  },
  {
    title: "Custom Layouts",
    text: "Choose layouts that fit how you like to browse.",
  },
];

const VIDEO_START = 0.45;
const VIDEO_END = 0.82;
const TOTAL_FRAMES = 120;

export default function Home() {
  const [hasScrolled, setHasScrolled] = useState(false);
  const [framesReady, setFramesReady] = useState(false);
  const [extractPct, setExtractPct] = useState(0);
  const [introComplete, setIntroComplete] = useState(false);

  const rawProgress = useMotionValue(0);

  const progress = useSpring(rawProgress, {
    stiffness: 90,
    damping: 30,
    restDelta: 0.001,
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const frames = useRef<ImageBitmap[]>([]);
  const targetIdx = useRef(0);
  const displayIdx = useRef(0);
// This allows the initial value to be null
const rafRef = useRef<number | null>(null);
  // ─────────────────────────────────────────────────────────────
  // Hard lock page scroll until the intro animation fully finishes
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    const prev = {
      htmlOverflow: html.style.overflow,
      bodyOverflow: body.style.overflow,
      htmlOverscrollBehavior: html.style.overscrollBehavior,
      bodyOverscrollBehavior: body.style.overscrollBehavior,
      htmlTouchAction: html.style.touchAction,
      bodyTouchAction: body.style.touchAction,
    };

    if (!introComplete) {
      html.style.overflow = "hidden";
      body.style.overflow = "hidden";
      html.style.overscrollBehavior = "none";
      body.style.overscrollBehavior = "none";
      html.style.touchAction = "none";
      body.style.touchAction = "none";
    } else {
      html.style.overflow = prev.htmlOverflow;
      body.style.overflow = prev.bodyOverflow;
      html.style.overscrollBehavior = prev.htmlOverscrollBehavior;
      body.style.overscrollBehavior = prev.bodyOverscrollBehavior;
      html.style.touchAction = prev.htmlTouchAction;
      body.style.touchAction = prev.bodyTouchAction;
    }

    return () => {
      html.style.overflow = prev.htmlOverflow;
      body.style.overflow = prev.bodyOverflow;
      html.style.overscrollBehavior = prev.htmlOverscrollBehavior;
      body.style.overscrollBehavior = prev.bodyOverscrollBehavior;
      html.style.touchAction = prev.htmlTouchAction;
      body.style.touchAction = prev.bodyTouchAction;
    };
  }, [introComplete]);

  // ─────────────────────────────────────────────────────────────
  // Extract video frames
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const extract = async () => {
      await new Promise<void>((res) => {
        if (video.readyState >= 2) return res();

        video.addEventListener("loadeddata", () => res(), {
          once: true,
        });
      });

      const offscreen = document.createElement("canvas");
      offscreen.width = video.videoWidth;
      offscreen.height = video.videoHeight;

      const ctx = offscreen.getContext("2d");
      if (!ctx) return;

      const canvas = canvasRef.current;

      if (canvas) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      }

      const captured: ImageBitmap[] = [];

      for (let i = 0; i < TOTAL_FRAMES; i++) {
        video.currentTime =
          (i / (TOTAL_FRAMES - 1)) * video.duration;

        await new Promise<void>((res) =>
          video.addEventListener("seeked", () => res(), {
            once: true,
          })
        );

        ctx.drawImage(
          video,
          0,
          0,
          offscreen.width,
          offscreen.height
        );

        captured.push(await createImageBitmap(offscreen));

        setExtractPct(
          Math.round(((i + 1) / TOTAL_FRAMES) * 100)
        );
      }

      frames.current = captured;
      setFramesReady(true);

      if (canvas) {
        const displayCtx = canvas.getContext("2d");
        if (displayCtx && captured[0]) {
          displayCtx.drawImage(captured[0], 0, 0);
        }
      }
    };

    extract();
  }, []);

  // ─────────────────────────────────────────────────────────────
  // Render loop
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!framesReady) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) return;

    let lastTime = 0;

    const FPS = 30;
    const FRAME_TIME = 1000 / FPS;

    const step = (time: number) => {
      if (time - lastTime >= FRAME_TIME) {
        lastTime = time;

        const target = targetIdx.current;
        const current = displayIdx.current;

        if (current !== target) {
          const next = current + Math.sign(target - current);

          ctx.drawImage(frames.current[next], 0, 0);
          displayIdx.current = next;

          if (
            next === frames.current.length - 1 &&
            target === frames.current.length - 1
          ) {
            setIntroComplete(true);
          }
        } else if (
          current === frames.current.length - 1 &&
          target === frames.current.length - 1
        ) {
          setIntroComplete(true);
        }
      }

      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [framesReady]);

  // ─────────────────────────────────────────────────────────────
  // Scroll progress -> target frame
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    return rawProgress.on("change", (latest) => {
      if (!framesReady) return;
      if (frames.current.length === 0) return;

      if (latest < VIDEO_START) {
        targetIdx.current = 0;
        return;
      }

      let framePct = 0;

      if (latest <= VIDEO_END) {
        const movePct =
          (latest - VIDEO_START) /
          (VIDEO_END - VIDEO_START);

        framePct = movePct * 0.75;
      } else {
        const finishPct =
          (latest - VIDEO_END) / (1 - VIDEO_END);

        framePct = 0.75 + finishPct * 0.25;
      }

      targetIdx.current = Math.min(
        Math.floor(
          framePct * (frames.current.length - 1)
        ),
        frames.current.length - 1
      );
    });
  }, [rawProgress, framesReady]);

  // ─────────────────────────────────────────────────────────────
// Wheel handling
// ─────────────────────────────────────────────────────────────
useEffect(() => {
  const handleWheel = (e: WheelEvent) => {
    const current = rawProgress.get();

    // If intro finished:
    // - allow normal scrolling UNTIL user reaches top
    // - only then start reversing animation
    if (introComplete) {
      const atTop = window.scrollY <= 0;

      // scrolling down normally
      if (e.deltaY > 0) {
        return;
      }

      // scrolling up but not at top yet
      if (!atTop) {
        return;
      }

      // now reverse intro
      e.preventDefault();

      setIntroComplete(false);

      const next = Math.max(
        current + e.deltaY * 0.0012,
        0
      );

      rawProgress.set(next);

      return;
    }

    // Intro active
    e.preventDefault();

    if (!hasScrolled) {
      setHasScrolled(true);
    }

    const next = Math.min(
      Math.max(current + e.deltaY * 0.0012, 0),
      1
    );

    rawProgress.set(next);
  };

  window.addEventListener("wheel", handleWheel, {
    passive: false,
  });

  return () => {
    window.removeEventListener("wheel", handleWheel);
  };
}, [rawProgress, hasScrolled, introComplete]);

  // ─────────────────────────────────────────────────────────────
  // Motion transforms
  // ─────────────────────────────────────────────────────────────
  const textY = useTransform(
    progress,
    [0, VIDEO_END],
    ["0%", "-140%"]
  );

  const cardsOpacity = useTransform(
    progress,
    [0, 0.3],
    [1, 0]
  );

  const cardsY = useTransform(
    progress,
    [0, 0.3],
    [0, -60]
  );

  const imageScale = useTransform(
    progress,
    [0, 1],
    [1, 1.6]
  );

  const imageX = useTransform(
    progress,
    [0, 1],
    ["0%", "-25%"]
  );

  const imageY = useTransform(
    progress,
    [0, 1],
    ["-290px", "-130px"]
  );

  const videoOpacity = useTransform(
    progress,
    [VIDEO_START, VIDEO_START + 0.1],
    [0, 1]
  );

  return (
    <main
      className="page-enter"
      style={{
        overflowX: "hidden",
      }}
    >
      <div
        style={{
          position: "relative",
          height: "100vh",
          width: "100%",
        }}
      >
        <section className="hero">
          <div className="container">
            <div className="hero-stack">
              {/* Text */}
              <motion.div
                style={{
                  y: hasScrolled ? textY : "0%",
                  zIndex: 10,
                  position: "relative",
                  pointerEvents: "none",
                }}
              >
                <div
                  className="hero-copy"
                  style={{
                    pointerEvents: "auto",
                  }}
                >
                  <h1
                    className="animate-fade-up"
                    style={{
                      animationDelay: "80ms",
                      lineHeight: "1.4",
                    }}
                  >
                    <span
                      className="font-solitreo"
                      style={{
                        fontSize: "55px",
                        lineHeight: "1",
                        display: "inline-block",
                        position: "relative",
                        top: "-8px",
                      }}
                    >
                      mira
                    </span>{" "}
                    <span
                      style={{
                        position: "relative",
                        top: "-8px",
                      }}
                    >
                      is an open source desktop browser
                      that helps you get everything done
                    </span>
                  </h1>

                  <div
                    className="cta-row animate-fade-up"
                    style={{
                      animationDelay: "280ms",
                    }}
                  >
                    <Link
                      href="/downloads"
                      className="btn btn-primary"
                    >
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
                </div>
              </motion.div>

              {/* Hero image */}
              <motion.div
                style={{
                  scale: hasScrolled ? imageScale : 1,
                  x: hasScrolled ? imageX : "0%",
                  y: hasScrolled ? imageY : "-290px",
                  zIndex: 1,
                  position: "relative",
                  transformOrigin: "center center",
                }}
                transformTemplate={({
                  scale,
                  x,
                  y,
                }) =>
                  `translate3d(${x}, ${y}, 0) scale(${scale})`
                }
              >
                <div
                  className="hero-card hero-card--app animate-fade-in-scale"
                  style={{
                    animationDelay: "210ms",
                  }}
                >
                  <ThemeHeroImage />

                  <motion.canvas
                    ref={canvasRef}
                    style={{
                      opacity: hasScrolled
                        ? videoOpacity
                        : 0,
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      borderRadius: "inherit",
                      zIndex: 1,
                    }}
                  />

                  {!framesReady && (
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        zIndex: 2,
                        display: "flex",
                        alignItems: "flex-end",
                        justifyContent: "center",
                        paddingBottom: "12px",
                        pointerEvents: "none",
                      }}
                    >
                      <div
                        style={{
                          background:
                            "rgba(0,0,0,0.45)",
                          backdropFilter:
                            "blur(6px)",
                          borderRadius: "999px",
                          padding: "4px 12px",
                          fontSize: "11px",
                          color:
                            "rgba(255,255,255,0.7)",
                          letterSpacing: "0.04em",
                        }}
                      >
                        Loading video… {extractPct}%
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Cards */}
        <section
          className="section"
          style={{
            position: "absolute",
            bottom: "8%",
            width: "100%",
            pointerEvents: "none",
          }}
        >
          <div
            className="container"
            style={{
              pointerEvents: "auto",
            }}
          >
            <motion.div
              style={{
                opacity: hasScrolled
                  ? cardsOpacity
                  : 1,
                y: hasScrolled
                  ? cardsY
                  : 0,
              }}
            >
              <div className="feature-grid">
                {highlights.map((item, idx) => (
                  <article
                    key={item.title}
                    className="feature-card animate-fade-up"
                    style={{
                      animationDelay: `${
                        220 + idx * 100
                      }ms`,
                    }}
                  >
                    <h2>{item.title}</h2>
                    <p>{item.text}</p>
                  </article>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      </div>

      <video
        ref={videoRef}
        muted
        playsInline
        preload="auto"
        crossOrigin="anonymous"
        style={{
          display: "none",
        }}
      >
        <source
          src="/mira.webm"
          type="video/webm"
        />
        <source
          src="/mira.mp4"
          type="video/mp4"
        />
      </video>
    </main>
  );
}