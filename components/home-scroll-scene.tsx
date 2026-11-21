"use client";

import { useEffect, useRef, type ReactNode } from "react";

const sectionLabels = ["Overview", "Privacy and open source", "Ad blocking", "Customization", "Full view"];

export function HomeScrollScene({ children }: { children: ReactNode }) {
  const sceneRef = useRef<HTMLElement>(null);
  const sectionTargetsRef = useRef<number[]>([]);

  useEffect(() => {
    const scene = sceneRef.current;
    const image = scene?.querySelector<HTMLElement>(".hero-card--app");
    const gallery = scene?.querySelector<HTMLElement>(".home-more");
    const copy = scene?.querySelector<HTMLElement>(".hero-copy");
    const highlights = scene?.querySelector<HTMLElement>(".home-features");
    if (!scene || !image || !gallery || !copy) return;
    const sectionNav = scene.querySelector<HTMLElement>(".home-scroll-indicators");
    const indicators = Array.from(scene.querySelectorAll<HTMLButtonElement>(".home-scroll-indicator"));
    const divider = gallery.querySelector<HTMLElement>(".home-more-bar") ?? gallery;
    for (const screenshot of scene.querySelectorAll<HTMLImageElement>(".hero-feature-image img")) {
      void screenshot.decode().catch(() => {});
    }
    const steps = Array.from(scene.querySelectorAll<HTMLElement>(".home-feature-step")).map(element => ({
      element,
      card: element.querySelector<HTMLElement>(".home-story-card")!,
      top: 0,
      side: element.dataset.side === "left" ? -1 : 1,
    }));

    const desktop = window.matchMedia("(min-width: 1024px)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let x = 0;
    let y = 0;
    let imageTop = 0;
    let centerShift = 0;
    let centeredTop = 0;
    let maxShift = 0;
    let targetScale = 1;
    let imageHeight = 0;
    let storyScale = 1;
    let storyNudge = 0;
    let cardTravel = 0;
    let dividerTop = 0;
    let sceneEnd = 0;

    const ease = (value: number) => {
      const clamped = Math.max(0, Math.min(1, value));
      return clamped * clamped * (3 - 2 * clamped);
    };
    const getStoryStart = () => Math.max(
      Math.min(420, window.innerHeight * 0.6) + window.innerHeight * 0.08,
      (steps[0]?.top ?? 0) - window.innerHeight * 0.8,
    );

    type SceneState = { intro: number; story: number; push: number; cards: number[] };
    let current: SceneState = { intro: 0, story: 0, push: 0, cards: steps.map(() => 0) };
    let animation: { from: SceneState; to: SceneState; start: number } | null = null;
    let targetKey = "";
    const duration = 420;

    const update = (time = performance.now()) => {
      frame = 0;
      const enabled = desktop.matches && !reducedMotion.matches;
      const distance = Math.max(0, window.scrollY);
      if (animation) {
        const progress = Math.min(1, (time - animation.start) / duration);
        const blend = ease(progress);
        const interpolate = (from: number, to: number) => from + (to - from) * blend;
        current = {
          intro: interpolate(animation.from.intro, animation.to.intro),
          story: interpolate(animation.from.story, animation.to.story),
          push: interpolate(animation.from.push, animation.to.push),
          cards: animation.from.cards.map((value, index) => interpolate(value, animation!.to.cards[index])),
        };
        if (progress === 1) animation = null;
      }
      const firstStart = getStoryStart();
      const stepDistance = window.innerHeight * 1.1;
      const storyEnd = firstStart + steps.length * stepDistance;
      const starts = enabled
        ? [0, firstStart, firstStart + stepDistance, firstStart + stepDistance * 2, storyEnd]
        : sectionTargetsRef.current;
      let sectionIndex = -1;
      indicators.forEach((indicator, index) => {
        const start = starts[index] ?? 0;
        const end = enabled && index === 4
          ? Math.max(start + 1, maxShift - centeredTop + imageTop)
          : starts[index + 1] ?? Math.max(start + 1, sceneEnd - window.innerHeight);
        const progress = Math.max(0, Math.min(1, (distance - start) / Math.max(1, end - start)));
        indicator.style.setProperty("--section-progress", `${progress < 0.015 ? 0 : progress}`);
        if (distance >= start && distance < end) sectionIndex = index;
        if (index === sectionIndex) indicator.setAttribute("aria-current", "step");
        else indicator.removeAttribute("aria-current");
      });
      if (sectionNav) {
        const height = sectionNav.offsetHeight || 40;
        const top = Math.min(window.innerHeight - height - 64, dividerTop - distance - height - 56);
        sectionNav.style.top = `${top}px`;
        sectionNav.style.visibility = top + height <= 0 ? "hidden" : "visible";
      }
      const requestedActive = enabled && distance >= firstStart && distance < storyEnd
        ? Math.floor((distance - firstStart) / stepDistance)
        : -1;
      const active = current.intro >= 1 ? requestedActive : -1;
      const intro = enabled && distance >= Math.min(160, window.innerHeight * 0.2) ? 1 : 0;
      const key = enabled + ":" + intro + ":" + active;
      if (key !== targetKey) {
        targetKey = key;
        const target: SceneState = {
          intro,
          story: active >= 0 ? 1 : 0,
          push: active >= 0 ? -steps[active].side * storyNudge : 0,
          cards: steps.map((_, index) => active === index ? 1 : 0),
        };
        if (enabled) animation = { from: current, to: target, start: time };
        else { current = target; animation = null; }
      }
      centeredTop = Math.max(100, (window.innerHeight - imageHeight * targetScale) / 2);
      const releaseAt = maxShift - centeredTop + imageTop;
      for (const [index, step] of steps.entries()) {
        const visibility = enabled ? (distance <= releaseAt ? current.cards[index] : 0) : 1;
        step.card.style.setProperty("--feature-x", `${enabled ? step.side * (1 - visibility) * cardTravel : 0}px`);
        step.card.style.setProperty("--feature-opacity", `${visibility}`);
        step.card.style.visibility = visibility < 0.001 ? "hidden" : "visible";
        step.card.inert = visibility < 0.1;
      }
      const scale = 1 + (targetScale - 1) * current.intro + (storyScale - targetScale) * current.story;
      x = centerShift * current.intro + current.push;
      y = enabled ? Math.min(maxShift, distance + (centeredTop - imageTop) * current.intro) : 0;
      scene.style.setProperty("--scene-x", `${x}px`);
      scene.style.setProperty("--scene-y", `${y}px`);
      scene.style.setProperty("--scene-scale", `${scale}`);
      scene.style.setProperty("--scene-open-source-opacity", `${current.cards[0] ?? 0}`);
      scene.style.setProperty("--scene-adblock-opacity", `${current.cards[1] ?? 0}`);
      scene.style.setProperty("--scene-customization-opacity", `${current.cards[2] ?? 0}`);
      scene.style.setProperty("--scene-push", `${current.push}px`);
      const exitOffset = Math.min(0, releaseAt - distance);
      const viewportTop = centeredTop + exitOffset;
      scene.style.setProperty("--scene-pin-top", `${viewportTop}px`);
      if (enabled && current.intro >= 1) image.dataset.pinned = "true";
      else delete image.dataset.pinned;
      image.style.visibility = enabled && current.intro >= 1 && viewportTop + imageHeight * scale < 0
        ? "hidden"
        : "visible";
      scene.style.setProperty("--scene-content-opacity", `${Math.max(0, 1 - current.intro * 2)}`);
      scene.style.setProperty("--scene-highlights-opacity", `${Math.max(0, 1 - current.intro * 5)}`);
      copy.inert = current.intro >= 0.5;
      if (highlights) highlights.inert = current.intro >= 0.2;
      if (animation) frame = window.requestAnimationFrame(update);
    };

    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    const measure = () => {
      if (desktop.matches && !reducedMotion.matches) scene.dataset.scrollMotion = "true";
      else delete scene.dataset.scrollMotion;
      delete image.dataset.pinned;
      scene.style.setProperty("--scene-x", "0px");
      scene.style.setProperty("--scene-y", "0px");
      scene.style.setProperty("--scene-scale", "1");
      const bounds = image.getBoundingClientRect();
      const viewportWidth = document.documentElement.clientWidth;
      const storyEdge = Math.max(24, (viewportWidth - 1200) / 2);
      const cardWidth = Math.min(320, viewportWidth * 0.29);
      cardTravel = cardWidth + storyEdge + 24;
      imageHeight = bounds.height;
      targetScale = Math.max(1, Math.min(
        1.14,
        (document.documentElement.clientWidth - 64) / bounds.width,
        (window.innerHeight - 160) / bounds.height,
      ));
      storyScale = Math.min(targetScale, (viewportWidth - storyEdge * 2 - cardWidth - 24) / bounds.width);
      storyNudge = (cardWidth + 24) / 2;
      scene.style.setProperty("--scene-image-width", `${bounds.width}px`);
      scene.style.setProperty("--story-edge", `${storyEdge}px`);
      scene.style.setProperty("--story-card-width", `${cardWidth}px`);
      imageTop = bounds.top + window.scrollY;
      centerShift = document.documentElement.clientWidth / 2 - (bounds.left + bounds.width / 2);
      centeredTop = Math.max(100, (window.innerHeight - bounds.height * targetScale) / 2);
      scene.style.setProperty("--story-card-height", `${bounds.height * storyScale}px`);
      for (const step of steps) step.top = step.element.getBoundingClientRect().top + window.scrollY;
      const tailSpace = getStoryStart() - (steps[0]?.top ?? 0) + centeredTop + bounds.height * targetScale + 160 + window.innerHeight * 0.35;
      scene.style.setProperty("--story-tail", `${Math.max(64, tailSpace)}px`);
      const galleryTop = gallery.getBoundingClientRect().top + window.scrollY;
      dividerTop = divider.getBoundingClientRect().top + window.scrollY;
      sceneEnd = scene.getBoundingClientRect().bottom + window.scrollY;
      sectionTargetsRef.current = [0, ...steps.map((step, index) => desktop.matches && !reducedMotion.matches
        ? getStoryStart() + index * window.innerHeight * 1.1 + window.innerHeight * 0.2
        : Math.max(0, step.top - 100)), desktop.matches && !reducedMotion.matches
          ? getStoryStart() + steps.length * window.innerHeight * 1.1 + window.innerHeight * 0.1
          : Math.max(0, galleryTop - 100)];
      maxShift = Math.max(0, galleryTop - imageTop - bounds.height * targetScale - 160);
      if (frame) window.cancelAnimationFrame(frame);
      update();
    };

    const observer = new ResizeObserver(measure);
    observer.observe(scene);
    observer.observe(image);
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", measure);
    desktop.addEventListener("change", measure);
    reducedMotion.addEventListener("change", measure);
    measure();

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", measure);
      desktop.removeEventListener("change", measure);
      reducedMotion.removeEventListener("change", measure);
    };
  }, []);

  return (
    <main ref={sceneRef} className="home-scroll-scene">
      {children}
      <nav className="home-scroll-indicators" aria-label="Page sections">
        {sectionLabels.map((label, index) => (
          <button
            className="home-scroll-indicator"
            key={label}
            type="button"
            aria-label={`Go to ${label}`}
            aria-current={index === 0 ? "step" : undefined}
            onClick={() => window.scrollTo({
              top: sectionTargetsRef.current[index] ?? 0,
              behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
            })}
          >
            <span className="home-scroll-line" aria-hidden="true"><span className="home-scroll-fill" /></span>
          </button>
        ))}
      </nav>
    </main>
  );
}
