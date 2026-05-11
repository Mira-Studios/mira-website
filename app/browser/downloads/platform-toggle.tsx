"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";

function DesktopIcon() {
  return (
    <svg className="platform-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  );
}

function MobileIcon() {
  return (
    <svg className="platform-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="2" width="12" height="20" rx="2" />
      <line x1="12" y1="18" x2="12" y2="18.01" />
    </svg>
  );
}

type PlatformToggleProps = {
  platform: "desktop" | "mobile";
};

export function PlatformToggle({ platform }: PlatformToggleProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const isMobile = platform === "mobile";

  const setPlatform = useCallback((newPlatform: "desktop" | "mobile") => {
    if (isPending || newPlatform === platform) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.set("platform", newPlatform);

    const query = params.toString();
    startTransition(() => {
      router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
    });
  }, [isPending, platform, searchParams, pathname, router]);

  return (
    <div className="platform-toggle">
      <button
        type="button"
        onClick={() => setPlatform("desktop")}
        disabled={isPending}
        className={`platform-btn ${!isMobile ? "active" : ""} ${isPending ? "pending" : ""}`}
      >
        <DesktopIcon />
        Desktop
      </button>
      <button
        type="button"
        onClick={() => setPlatform("mobile")}
        disabled={isPending}
        className={`platform-btn ${isMobile ? "active" : ""} ${isPending ? "pending" : ""}`}
      >
        <MobileIcon />
        Mobile
      </button>
    </div>
  );
}
