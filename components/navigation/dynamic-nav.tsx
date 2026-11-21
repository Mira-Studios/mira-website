"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const browserLinks = [
  { href: "/", label: "Home" },
  { href: "/roadmap", label: "Roadmap" },
  { href: "/downloads", label: "Downloads" },
  { href: "/themes", label: "Themes" },
];

interface DynamicNavProps {
  isAdmin?: boolean;
}

export function DynamicNav({ isAdmin = false }: DynamicNavProps) {
  const pathname = usePathname() ?? "/";
  const isWithin = (route: string) => pathname === route || pathname.startsWith(`${route}/`);
  const isBrowserPage = pathname === "/" || ["/browser", "/roadmap", "/downloads", "/mobile"].some(isWithin);
  const links = isBrowserPage
    ? browserLinks
    : isWithin("/office")
      ? [
          { href: "/", label: "Home" },
          { href: "/office/roadmap", label: "Roadmap" },
          { href: "/office/downloads", label: "Downloads" },
          { href: "/themes", label: "Themes" },
        ]
      : isWithin("/themes")
        ? [
            { href: "/", label: "Home" },
            { href: "/browser", label: "mira" },
            { href: "/office", label: "miraOffice" },
            { href: "/mail", label: "miraMail" },
          ]
        : [{ href: "/", label: "Home" }];

  return (
    <nav className="nav-links desktop-only" aria-label="Primary">
      {isAdmin ? <Link href="/admin">Admin</Link> : null}
      {links.map((item) => (
        <Link key={item.href} href={item.href}>
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
