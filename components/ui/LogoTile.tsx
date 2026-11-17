import Image from "next/image";
import { logos } from "@/content/logos";

// The adjacent text names the product; its logo is decorative.
export function LogoTile({ name, logo, stacked = false }: { name: string; logo?: string; stacked?: boolean }) {
  const asset = logo !== undefined && Object.prototype.hasOwnProperty.call(logos, logo) ? logos[logo] : undefined;
  const size = asset?.size ?? 20;
  const imageClass = size === 40 ? "h-10 w-10 object-contain" : "h-5 w-5 object-contain";
  return <span className={`inline-flex items-center gap-1${stacked ? " flex-col" : ""}`}>
    {asset && <span aria-hidden="true" className="inline-flex h-10 w-10 shrink-0 items-center justify-center">
      <Image src={asset.src} alt="" width={size} height={size} className={asset.darkSrc ? `${imageClass} dark:hidden` : imageClass} />
      {asset.darkSrc && <Image src={asset.darkSrc} alt="" width={size} height={size} className={`hidden ${imageClass} dark:block`} />}
    </span>}
    <span>{name}</span>
  </span>;
}
