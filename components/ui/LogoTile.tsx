import Image from "next/image";
import { logos } from "@/content/logos";

// The adjacent text names the product; its logo is decorative.
export function LogoTile({ name, logo }: { name: string; logo?: string }) {
  const asset = logo !== undefined && Object.prototype.hasOwnProperty.call(logos, logo) ? logos[logo] : undefined;
  return <span className="inline-flex items-center gap-1">
    {asset && <span aria-hidden="true" className="inline-flex h-10 w-10 shrink-0 items-center justify-center">
      <Image src={asset.src} alt="" width={20} height={20} className={asset.darkSrc ? "h-5 w-5 object-contain dark:hidden" : "h-5 w-5 object-contain"} />
      {asset.darkSrc && <Image src={asset.darkSrc} alt="" width={20} height={20} className="hidden h-5 w-5 object-contain dark:block" />}
    </span>}
    <span>{name}</span>
  </span>;
}
