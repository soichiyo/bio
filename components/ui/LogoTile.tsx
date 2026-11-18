import Image from "next/image";
import { logos } from "@/content/logos";

// The adjacent text names the product; its logo is decorative.
export function LogoTile({ name, logo, variant = "inline" }: { name: string; logo?: string; variant?: "inline" | "tool" | "writing" }) {
  const asset = logo !== undefined && Object.prototype.hasOwnProperty.call(logos, logo) ? logos[logo] : undefined;
  const size = asset?.size ?? 20;
  const imageClass = size === 40 ? "h-10 w-10 object-contain" : "h-5 w-5 object-contain";
  const tileClass = variant === "tool" ? "h-14 w-14 rounded-[14px] border border-border bg-accent" : variant === "writing" ? "h-11 w-11 rounded-[10px] border border-border bg-accent" : "h-10 w-10";
  return <span className={variant === "tool" ? "inline-flex w-[72px] flex-col items-center gap-2 text-center text-[11px] leading-4" : "inline-flex items-center gap-1"}>
    {(asset || variant === "tool") && <span aria-hidden="true" className={`inline-flex shrink-0 items-center justify-center ${tileClass}`}>
      {asset && <span className={`inline-flex items-center justify-center${asset.neutralTile ? " h-10 w-10 rounded bg-white" : ""}`}><Image src={asset.src} alt="" width={size} height={size} className={asset.darkSrc ? `${imageClass} dark:hidden` : imageClass} />
      {asset.darkSrc && <Image src={asset.darkSrc} alt="" width={size} height={size} className={`hidden ${imageClass} dark:block`} />}
      </span>}
    </span>}
    <span className={variant === "writing" && asset ? "sr-only" : undefined}>{name}</span>
  </span>;
}
