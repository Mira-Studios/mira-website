import Image from "next/image";

export function ThemeHeroImage() {
  return (
    <div className="theme-hero-image mobile-hero-image">
      <div className="hero-image-slot hero-image-light">
        <Image
          src="/assets/mira mobile.png"
          alt="Screenshot of the Mira mobile browser in light mode"
          width={390}
          height={844}
          quality={100}
          sizes="(max-width: 520px) 50vw, 280px"
          unoptimized
          className="hero-app-image mobile-app-image"
        />
      </div>
      <div className="hero-image-slot hero-image-dark">
        <Image
          src="/assets/mira mobile.png"
          alt="Screenshot of the Mira mobile browser in dark mode"
          width={390}
          height={844}
          quality={100}
          sizes="(max-width: 520px) 50vw, 280px"
          unoptimized
          className="hero-app-image mobile-app-image"
        />
      </div>
    </div>
  );
}
