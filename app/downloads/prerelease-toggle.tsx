"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";

type PrereleaseToggleProps = {
  checked: boolean;
  disabled?: boolean;
};

export function PrereleaseToggle({
  checked: serverChecked,
  disabled = false,
}: PrereleaseToggleProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Derive checked state from URL to stay in sync
  const urlChecked = searchParams.get("includePrereleases") === "1" || searchParams.get("includePrereleases") === "true";
  const checked = isPending ? !serverChecked : (urlChecked || serverChecked);

  const handleToggle = useCallback(() => {
    if (disabled || isPending) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    const nextChecked = !urlChecked;

    if (nextChecked) {
      params.set("includePrereleases", "1");
    } else {
      params.delete("includePrereleases");
    }

    const query = params.toString();
    startTransition(() => {
      router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
    });
  }, [disabled, isPending, urlChecked, searchParams, pathname, router]);

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label="Include pre-releases"
      onClick={handleToggle}
      disabled={disabled || isPending}
      className={`toggle-switch ${checked ? "on" : "off"} ${disabled ? "disabled" : ""} ${isPending ? "pending" : ""}`}
    >
      <span className="toggle-slider" />
    </button>
  );
}
