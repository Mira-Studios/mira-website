"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef, useCallback } from "react";

interface NavItem {
  href: string;
  label: string;
}

interface DynamicNavProps {
  isAdmin?: boolean;
}

export function DynamicNav({ isAdmin = false }: DynamicNavProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false); // 1. Track mounting
  const [opacity, setOpacity] = useState(1);
  const [displayNavItems, setDisplayNavItems] = useState<NavItem[]>([]);
  const previousNavItemsRef = useRef<NavItem[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const getNavItems = useCallback((): NavItem[] => {
    const path = pathname ?? "/";
    const items: NavItem[] = [];

    if (isAdmin) items.push({ href: "/admin", label: "Admin" });

    if (path === "/") {
      items.push(
        { href: "/browser", label: "mira" },
        { href: "/office", label: "miraOffice" },
        { href: "/mail", label: "miraMail" },
        { href: "/themes", label: "Themes" }
      );
    } else if (path.startsWith("/browser")) {
      items.push(
        { href: "/", label: "Home" },
        { href: "/browser/roadmap", label: "Roadmap" },
        { href: "/browser/downloads", label: "Downloads" },
        { href: "/themes", label: "Themes" }
      );
    } else if (path.startsWith("/office")) {
      items.push(
        { href: "/", label: "Home" },
        { href: "/office/roadmap", label: "Roadmap" },
        { href: "/office/downloads", label: "Downloads" },
        { href: "/themes", label: "Themes" }
      );
    } else if (path.startsWith("/themes")) {
      items.push(
        { href: "/", label: "Home" },
        { href: "/browser", label: "mira" },
        { href: "/office", label: "miraOffice" },
        { href: "/mail", label: "miraMail" }
      );
    } else {
      items.push({ href: "/", label: "Home" });
    }

    return items;
  }, [pathname, isAdmin]);

  // Handle Initial Mount and Updates
  useEffect(() => {
    const newNavItems = getNavItems();
    
    if (!mounted) {
      // First time loading: set items immediately
      setDisplayNavItems(newNavItems);
      previousNavItemsRef.current = newNavItems;
      setMounted(true);
    } else {
      // Subsequent path changes: trigger fade animation
      const itemsChanged = JSON.stringify(newNavItems) !== JSON.stringify(previousNavItemsRef.current);
      
      if (itemsChanged) {
        setOpacity(0);
        timeoutRef.current = setTimeout(() => {
          setDisplayNavItems(newNavItems);
          previousNavItemsRef.current = newNavItems;
          setOpacity(1);
        }, 200);
      }
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [getNavItems, mounted]);

  // 2. Prevent the "Empty Nav" render on the server
  if (!mounted) {
    return (
        <nav className="nav-links" aria-label="Primary" style={{ opacity: 0 }}>
            {/* Optional: Render a single 'Home' link here as a placeholder if you want SEO */}
        </nav>
    );
  }

  return (
    <nav
      className="nav-links desktop-only"
      aria-label="Primary"
      style={{
        opacity,
        transition: "opacity 200ms ease",
      }}
    >
      {displayNavItems.map((item) => (
        <Link key={item.href} href={item.href}>
          {item.label}
        </Link>
      ))}
    </nav>
  );
}