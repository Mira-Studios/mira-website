import Image from "next/image";

export function ThemeHeroImage({ featureScreenshots = false }: { featureScreenshots?: boolean }) {
  return (
    <div className="theme-hero-image">
      <div className="hero-image-slot hero-image-light">
        <Image
          src="/assets/mira_app_light.png"
          alt="Screenshot of the Mira browser in light mode"
          width={2557}
          height={1537}
          quality={100}
          sizes="(max-width: 520px) 100vw, 980px"
          unoptimized
          preload
          className="hero-app-image"
        />
      </div>
      <div className="hero-image-slot hero-image-dark">
        <Image
          src="/assets/mira_app.png"
          alt="Screenshot of the Mira browser in dark mode"
          width={2557}
          height={1541}
          quality={100}
          sizes="(max-width: 520px) 100vw, 980px"
          unoptimized
          preload
          className="hero-app-image"
        />
      </div>
      {featureScreenshots ? (
        <>
        <div className="hero-feature-image" aria-hidden="true">
          <div className="hero-image-slot hero-image-light">
            <Image src="/assets/mira_open_source_light.png" alt="Mira displaying its open source repository in light mode" width={2557} height={1537} sizes="(max-width: 520px) 100vw, 980px" unoptimized preload className="hero-app-image" />
          </div>
          <div className="hero-image-slot hero-image-dark">
            <Image src="/assets/mira_open_source_dark.png" alt="Mira displaying its open source repository in dark mode" width={2557} height={1537} sizes="(max-width: 520px) 100vw, 980px" unoptimized preload className="hero-app-image" />
          </div>
        </div>
        <div className="hero-feature-image hero-feature-image--adblock" aria-hidden="true">
          <div className="hero-image-slot hero-image-light">
            <Image src="/assets/mira_adblock_light.webp" alt="Diagonal comparison with an ad-free video on the left and an advertisement on the right, in light mode" width={2557} height={1537} sizes="(max-width: 520px) 100vw, 980px" unoptimized preload className="hero-app-image" />
          </div>
          <div className="hero-image-slot hero-image-dark">
            <Image src="/assets/mira_adblock_dark.webp" alt="Diagonal comparison with an ad-free video on the left and an advertisement on the right, in dark mode" width={2557} height={1537} sizes="(max-width: 520px) 100vw, 980px" unoptimized preload className="hero-app-image" />
          </div>
        </div>
        <div className="hero-feature-image hero-feature-image--customization" aria-hidden="true">
          <Image src="/assets/mira_customization.webp" alt="Four Mira themes combined in diagonal strips with macOS window controls" width={2557} height={1537} sizes="(max-width: 520px) 100vw, 980px" unoptimized preload className="hero-app-image" />
        </div>
        </>
      ) : null}
    </div>
  );
}
