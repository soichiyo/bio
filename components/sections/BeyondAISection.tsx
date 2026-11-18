import Image from "next/image";
import { workExperiences } from "@/content/career";
import { expertise } from "@/content/expertise";
import { hobbies } from "@/content/life";
import { aiProfile, coachingCredentials, profileFamily, careerHighlights } from "@/content/ai-profile";
import { AIPhotoGallery } from "@/components/AIPhotoGallery";
export function BeyondAISection() {
  return <section id="beyond" className="scroll-mt-8"><h2 className="text-[28px] font-medium">Beyond AI</h2>
    <ul className="my-7 flex flex-wrap gap-2">{expertise.filter(item => !["Photography", "DJ/Music Production"].includes(item.text)).map(item => <li key={item.text} className="border border-border px-3 py-2 text-xs text-muted-foreground">{item.text}</li>)}</ul>
    <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
      <section className="ai-panel"><h3 className="text-lg font-medium">Career</h3><ol className="mt-5">{workExperiences.map(work => <li key={work.period} className="grid grid-cols-[44px_minmax(0,1fr)_auto] gap-x-3 gap-y-1 border-b border-border py-5 last:border-0">
        <Image src={work.companies[0].icon} alt="" width={44} height={44} className="row-span-2 h-11 w-11 rounded-[10px] border border-border bg-white object-contain" />
        <p className="text-base font-medium">{work.companies.map(company => company.name).join(" / ")}</p>
        <p className="text-right font-data text-xs text-muted-foreground">{work.period}</p>
        <p className="col-span-2 col-start-2 text-[13px] leading-relaxed text-muted-foreground">{work.title.replace(/ at$/, "")}{careerHighlights.filter(highlight => work.companies.some(company => company.name === highlight.company)).map(highlight => <span key={highlight.company}> · <a href={highlight.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">{highlight.text} ↗</a></span>)}</p>
      </li>)}</ol></section>
      <section className="ai-panel ai-coaching-panel overflow-hidden">
        <Image src={aiProfile.coachingImage} alt="THE COACH ICP certification" width={697} height={138} className="h-auto w-full" />
        <div className="p-5 sm:p-7"><h3 className="text-lg font-medium">Coaching</h3>
          <p className="mt-5 flex items-baseline gap-2"><span className="font-display-dot text-[52px] font-extrabold leading-none">{aiProfile.coachingHours.replace(/\+$/, "")}</span><span className="font-data text-lg text-muted-foreground">hrs{aiProfile.coachingHours.endsWith("+") ? "+" : ""}</span></p>
          <ul className="mt-6 flex flex-wrap gap-2 text-xs leading-relaxed text-muted-foreground">{coachingCredentials.map(item => <li key={item.title}><a href={item.proof!.url} target="_blank" rel="noopener noreferrer" className="inline-block rounded-md border border-border px-3 py-2 hover:bg-accent">{item.title} ↗</a></li>)}</ul>
        </div>
      </section>
      <section className="ai-panel min-w-0"><h3 className="mb-5 text-lg font-medium">Photography</h3><AIPhotoGallery /><p className="mt-5 text-xs leading-relaxed text-muted-foreground">Sony α7III + SIGMA Art 50mm F1.4 + FE 135mm F1.8 GM</p></section>
      <section className="ai-panel"><h3 className="text-lg font-medium">Family</h3><ul className="mt-6 flex flex-wrap gap-5">{profileFamily.map(person => <li key={person.id} className="text-center"><Image src={person.image} alt={person.label.text} width={56} height={56} className="h-14 w-14 rounded-full object-cover" /><p className="mt-2 text-xs text-muted-foreground">{person.label.text}</p></li>)}</ul><h4 className="mb-4 mt-8 font-data text-[10px] tracking-widest text-muted-foreground">LIFE</h4><p className="text-xs leading-loose text-muted-foreground">DJ / {hobbies.map(item => item.text).join(" / ")}</p></section>
    </div>
  </section>;
}
