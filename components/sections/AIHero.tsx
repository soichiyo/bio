import Image from "next/image";
import { profileData } from "@/content/profile";
import { aiProfile } from "@/content/ai-profile";
import { ChatButton } from "@/components/ui/ChatButton";
export function AIHero() {
  return <section id="ai" className="flex flex-wrap items-center gap-7 py-12 sm:py-14">
    <Image src={profileData.avatar} alt={profileData.name} width={114} height={114} priority className="h-24 w-24 rounded-full object-cover grayscale sm:h-28 sm:w-28" />
    <div className="min-w-0 flex-1 basis-64"><h1 className="text-[32px] font-medium leading-tight tracking-tight sm:text-[40px]">{profileData.name}</h1>
      <p className="mt-2 font-data text-sm text-muted-foreground">{aiProfile.handle}</p><p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">{aiProfile.description}</p></div>
    <div className="flex flex-wrap gap-3 lg:flex-col"><a href={`mailto:${profileData.email}`} className="ai-contact-link">仕事の相談をする ↗</a><ChatButton variant="inline" /></div>
  </section>;
}
