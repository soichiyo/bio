import Image from "next/image";
import { workExperiences } from "@/content/career";
import { expertise } from "@/content/expertise";
import { hobbies } from "@/content/life";
import { aiProfile, coachingCredentials, profileFamily } from "@/content/ai-profile";
import { AIPhotoGallery } from "@/components/AIPhotoGallery";
export function BeyondAISection() {
  return <section id="beyond" className="scroll-mt-8"><h2 className="text-[28px] font-medium">Beyond AI</h2>
    <ul className="my-7 flex flex-wrap gap-2">{expertise.filter(item => !["Photography", "DJ/Music Production"].includes(item.text)).map(item => <li key={item.text} className="border border-border px-3 py-2 text-xs text-muted-foreground">{item.text}</li>)}</ul>
    <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
      <section className="ai-panel"><h3 className="text-lg font-medium">Career</h3><ol className="mt-5">{workExperiences.map(work => <li key={work.period} className="flex gap-4 border-b border-border py-5 last:border-0">
        <Image src={work.companies[0].icon} alt="" width={40} height={40} className="h-10 w-10 rounded-full" /><div className="min-w-0"><p className="font-medium">{work.companies.map(company => company.name).join(" / ")}</p><p className="mt-1 text-sm text-muted-foreground">{work.title.replace(/ at$/, "")}</p><p className="mt-2 font-data text-[10px] text-muted-foreground">{work.period}</p></div>
      </li>)}</ol></section>
      <section className="ai-panel"><h3 className="text-lg font-medium">Coaching</h3><Image src={aiProfile.coachingImage} alt="THE COACH ICP certification" width={697} height={138} className="my-6 h-auto w-full" /><p className="font-display-dot text-5xl">{aiProfile.coachingHours}<span className="ml-2 font-data text-sm">hours</span></p><ul className="mt-6 space-y-4 text-xs leading-relaxed text-muted-foreground">{coachingCredentials.map(item => <li key={item.title}><a href={item.proof!.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">{item.title} ↗</a></li>)}</ul></section>
      <section className="ai-panel min-w-0"><h3 className="mb-5 text-lg font-medium">Photography</h3><AIPhotoGallery /><p className="mt-5 text-xs leading-relaxed text-muted-foreground">Sony α7III + SIGMA Art 50mm F1.4 + FE 135mm F1.8 GM</p></section>
      <section className="ai-panel"><h3 className="text-lg font-medium">Family</h3><ul className="mt-6 flex flex-wrap gap-5">{profileFamily.map(person => <li key={person.id} className="text-center"><Image src={person.image} alt={person.label.text} width={56} height={56} className="h-14 w-14 rounded-full object-cover" /><p className="mt-2 text-xs text-muted-foreground">{person.label.text}</p></li>)}</ul><h4 className="mb-4 mt-8 font-data text-[10px] tracking-widest text-muted-foreground">LIFE</h4><p className="text-xs leading-loose text-muted-foreground">DJ / {hobbies.map(item => item.text).join(" / ")}</p></section>
    </div>
  </section>;
}
