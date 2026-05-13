"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function DynamicHeaderImage() {
  const pathname = usePathname();
  
  // Use miraStudios.webp for home page, mira.png for browser page and others
  const imageSrc = pathname === "/" ? "/assets/miraStudios.webp" : "/assets/mira.png";
  const imageAlt = "Mira";
  const imageWidth = pathname === "/" ? 160 : 140;
  const imageHeight = pathname === "/" ? 68 : 38;
  const imageClass = pathname === "/" ? "brand-image brand-image-studios" : "brand-image";

  return (
    <Link href="/" className="brand ml-[-5px]" aria-label="Mira home">
      <Image
        src={imageSrc}
        alt={imageAlt}
        width={imageWidth}
        height={imageHeight}
        className={imageClass}
        priority
      />
    </Link>
  );
}
