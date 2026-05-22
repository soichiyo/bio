// components/pages/TelemetryBioPage.tsx

import { ScrollReveal } from "../animations/ScrollReveal";
import { PersonalOSDashboard } from "../PersonalOSDashboard";
import { SectionRail } from "../SectionRail";
import { ContactSection } from "../sections/ContactSection";
import { CredentialsSection } from "../sections/CredentialsSection";
import { ExpertiseSection } from "../sections/ExpertiseSection";
import { GallerySection } from "../sections/GallerySection";
import { HobbiesSection } from "../sections/HobbiesSection";
import { MyFamilySection } from "../sections/MyFamilySection";
import { PersonalCharacteristicsSection } from "../sections/PersonalCharacteristicsSection";
import { ProjectsSection } from "../sections/ProjectsSection";
import { SkillsSection } from "../sections/SkillsSection";
import { WorkSection } from "../sections/WorkSection";
import { WritingsSection } from "../sections/WritingsSection";
import { ChatButton } from "../ui/ChatButton";
import { ThemeToggle } from "../ui/ThemeToggle";
import { profileData } from "../../lib/data";

function SectionHeading({
  id,
  title,
  subtitle,
}: {
  id: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-5 flex flex-col gap-3 border-b border-border pb-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
      <div>
        <div className="telemetry-label mb-2">{id}</div>
        <h2 className="text-xl font-medium tracking-[-0.01em] text-foreground sm:text-2xl">
          {title}
        </h2>
      </div>
      <p className="max-w-xl text-sm text-muted-foreground sm:max-w-xs sm:text-right">
        {subtitle}
      </p>
    </div>
  );
}

export function TelemetryBioPage() {
  return (
    <main className="container mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 md:pl-12 lg:px-8">
      <ThemeToggle />
      <SectionRail />
      <ChatButton />
      <div id="overview" className="scroll-mt-8">
        <PersonalOSDashboard />
      </div>

      <div className="mx-auto max-w-4xl space-y-14 sm:space-y-20">
        <ScrollReveal>
          <section id="career" className="scroll-mt-10">
            <SectionHeading
              id="LOG / 001"
              title="Career Log / Work Experience"
              subtitle="A chronological trace of product, growth, coaching, and business responsibility."
            />
            <WorkSection />
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section id="projects" className="scroll-mt-10">
            <SectionHeading
              id="MOD / 002"
              title="Modules / Projects"
              subtitle="Selected systems shipped, scaled, or shaped."
            />
            <ProjectsSection />
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section id="writings" className="scroll-mt-10">
            <SectionHeading
              id="TX / 003"
              title="Transmission Log / Writings"
              subtitle="Notes from the edge of product, AI, and personal systems."
            />
            <WritingsSection />
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section id="skills" className="scroll-mt-10">
            <SectionHeading
              id="CAP / 004"
              title="Capability Matrix / Skills"
              subtitle="Tools and muscles that keep the system moving."
            />
            <SkillsSection />
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section id="expertise" className="scroll-mt-10">
            <SectionHeading
              id="EXP / 005"
              title="Expertise Field"
              subtitle="Where product thinking, coaching practice, and creative work overlap."
            />
            <ExpertiseSection />
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section id="personality" className="scroll-mt-10">
            <SectionHeading
              id="INT / 006"
              title="Inner Telemetry / Personality"
              subtitle="The internal signal behind the visible work."
            />
            <PersonalCharacteristicsSection />
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section id="gallery" className="scroll-mt-10">
            <SectionHeading
              id="OPT / 007"
              title="Optical Archive / Gallery"
              subtitle="A small contact sheet from the visual layer."
            />
            <GallerySection />
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section id="hobbies" className="scroll-mt-10">
            <SectionHeading
              id="LIFE / 008"
              title="Human Layer / Hobbies"
              subtitle="Signals that make the operating system less mechanical."
            />
            <HobbiesSection />
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section id="credentials" className="scroll-mt-10">
            <SectionHeading
              id="CERT / 009"
              title="Credentials"
              subtitle="Formal traces of learning and practice."
            />
            <CredentialsSection />
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section id="family" className="scroll-mt-10">
            <SectionHeading
              id="NET / 010"
              title="Human Network / My Family"
              subtitle="The home signal."
            />
            <MyFamilySection />
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section id="contact" className="scroll-mt-10">
            <SectionHeading
              id="BEACON / 011"
              title="Contact"
              subtitle="Open a channel."
            />
            <ContactSection />
          </section>
        </ScrollReveal>
      </div>

      <footer className="mx-auto mt-24 max-w-4xl border-t border-border pt-8">
        <div className="text-center font-data text-xs uppercase tracking-[0.08em] text-muted-foreground">
          <p>© 2024 {profileData.name}</p>
        </div>
      </footer>
    </main>
  );
}
