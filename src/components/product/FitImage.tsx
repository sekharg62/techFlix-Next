import Image from "next/image";

/**
 * Shows the WHOLE image, whatever its size or shape (no cropping): the image is
 * contained in its frame and a blurred, zoomed copy of itself fills the leftover space,
 * so wide, tall or square uploads all look intentional. The parent must be `relative`
 * with a fixed size or aspect ratio.
 */
export function FitImage({
  src,
  alt,
  sizes,
  priority = false,
  className = "",
}: {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  /** Extra classes for the foreground image (e.g. hover zoom). */
  className?: string;
}) {
  return (
    <>
      {/* Backdrop: tiny, blurred version of the same picture (a small `sizes` keeps it cheap) */}
      <Image
        src={src}
        alt=""
        aria-hidden="true"
        fill
        sizes="64px"
        priority={priority}
        className="object-cover scale-110 blur-2xl opacity-60 saturate-150"
      />
      <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={`object-contain ${className}`} />
    </>
  );
}
