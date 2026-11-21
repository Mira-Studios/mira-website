import Image from "next/image";
import Link from "next/link";

export function DynamicHeaderImage() {
  return (
    <Link href="/" className="brand ml-[-5px]" aria-label="Mira home">
      <Image
        src="/assets/mira.png"
        alt="Mira"
        width={3700}
        height={2000}
        className="brand-image"
        priority
      />
    </Link>
  );
}
