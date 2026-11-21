"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, type CSSProperties } from "react";

type GalleryItem = { title: string; image: string; width: number; height: number };
const columns: { key: string; width: number; items: GalleryItem[] }[] = [
  { key: "tabs", width: 536, items: [
    { title: "Vertical tabs", image: "vertical-tabs", width: 1000, height: 400 },
    { title: "Tab groups", image: "tab-groups", width: 680, height: 108 },
    { title: "Pinned & muted tabs", image: "pinned-muted", width: 493, height: 91 },
  ] },
  { key: "backgrounds", width: 600, items: [
    { title: "Backgrounds", image: "backgrounds", width: 1600, height: 900 },
  ] },
  { key: "sidebar", width: 320, items: [
    { title: "Sidebar", image: "sidebar", width: 965, height: 1100 },
  ] },
  { key: "restoring", width: 620, items: [
    { title: "Recently closed", image: "recently-closed", width: 1020, height: 540 },
  ] },
  { key: "navigation", width: 500, items: [
    { title: "Quick Navigate", image: "quick-navigate", width: 800, height: 290 },
    { title: "Profiles", image: "profiles", width: 700, height: 300 },
  ] },
  { key: "editing", width: 640, items: [
    { title: "File editing", image: "file-editing", width: 1600, height: 962 },
  ] },
  { key: "video", width: 640, items: [
    { title: "Picture in Picture", image: "picture-in-picture", width: 1600, height: 962 },
  ] },
  { key: "web-apps", width: 600, items: [
    { title: "Web apps", image: "web-apps", width: 1600, height: 1000 },
  ] },
];
const loopingColumns = [0, 1, 2].flatMap(copy => columns.map(column => ({ ...column, copy })));

function positions(track: HTMLDivElement) {
  const children = Array.from(track.children) as HTMLElement[];
  const mobile = window.matchMedia("(max-width: 1023px)").matches;
  return children.map((column, index) => {
    const next = children[index + 1] ?? children[0];
    const pairWidth = column.offsetWidth + (mobile ? 0 : 32 + next.offsetWidth);
    const margin = (track.clientWidth - pairWidth) / 2;
    column.style.scrollMarginLeft = `${margin}px`;
    return column.offsetLeft - margin;
  });
}

function closest(values: number[], value: number) {
  return values.reduce((best, position, index) => Math.abs(position - value) < Math.abs(values[best] - value) ? index : best, 0);
}

export function MoreFeaturesGallery() {
  const trackRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(0);
  const targetRef = useRef<number | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let timer: ReturnType<typeof setTimeout>;
    const center = () => {
      const offsets = positions(track);
      track.scrollTo({ left: offsets[columns.length + activeRef.current], behavior: "instant" });
      targetRef.current = null;
    };
    const settle = () => {
      const offsets = positions(track);
      const index = closest(offsets, track.scrollLeft);
      activeRef.current = index % columns.length;
      targetRef.current = null;
      if (index < columns.length || index >= columns.length * 2) {
        track.scrollTo({ left: offsets[columns.length + activeRef.current], behavior: "instant" });
      }
    };
    const onScroll = () => {
      clearTimeout(timer);
      timer = setTimeout(settle, 220);
    };
    const observer = new ResizeObserver(center);
    observer.observe(track);
    track.addEventListener("scroll", onScroll, { passive: true });
    track.addEventListener("scrollend", settle);
    center();
    return () => {
      clearTimeout(timer);
      observer.disconnect();
      track.removeEventListener("scroll", onScroll);
      track.removeEventListener("scrollend", settle);
    };
  }, []);

  const slide = (direction: number) => {
    const track = trackRef.current;
    if (!track) return;
    const offsets = positions(track);
    const current = targetRef.current ?? closest(offsets, track.scrollLeft);
    const next = Math.max(0, Math.min(offsets.length - 1, current + direction));
    targetRef.current = next;
    track.scrollTo({
      left: offsets[next],
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  };

  return (
    <section className="home-more" aria-labelledby="home-more-title">
      <div className="container">
        <div className="home-more-bar">
          <h2 id="home-more-title">And much more.</h2>
          <div className="home-gallery-controls">
            <button type="button" aria-label="Previous features" aria-controls="home-gallery" onClick={() => slide(-1)}><ChevronLeft size={22} /></button>
            <button type="button" aria-label="Next features" aria-controls="home-gallery" onClick={() => slide(1)}><ChevronRight size={22} /></button>
          </div>
        </div>
      </div>
      <div id="home-gallery" ref={trackRef} className="home-gallery" role="region" aria-label="More Mira features" aria-roledescription="carousel" tabIndex={0} onKeyDown={event => {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault();
          slide(event.key === "ArrowLeft" ? -1 : 1);
        }
      }}>
        {loopingColumns.map(column => (
          <div className="home-gallery-column" key={`${column.copy}-${column.key}`} style={{ "--gallery-column-width": `${column.width}px` } as CSSProperties} aria-hidden={column.copy !== 1}>
            {column.items.map(item => (
              <article className={`home-gallery-card home-gallery-card--${item.image}`} key={item.image}>
                <div className="home-gallery-picture">
                  <Image src={`/assets/gallery_${item.image}_light.webp`} alt={`Mira ${item.title.toLowerCase()} in light mode`} width={item.width} height={item.height} sizes="(max-width: 1023px) 85vw, 620px" unoptimized preload className="home-gallery-image hero-image-light" />
                  <Image src={`/assets/gallery_${item.image}_dark.webp`} alt={`Mira ${item.title.toLowerCase()} in dark mode`} width={item.width} height={item.height} sizes="(max-width: 1023px) 85vw, 620px" unoptimized preload className="home-gallery-image hero-image-dark" />
                </div>
                <div className="home-gallery-caption"><h3>{item.title}</h3></div>
              </article>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
