// components/pages/LegacyBioPage.tsx

import type { ReactNode } from "react";
import { ScrollReveal } from "../animations/ScrollReveal";
import { ProfileHeader } from "../ProfileHeader";
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
import { ThemeToggle } from "../ui/ThemeToggle";
import { profileData } from "../../lib/data";

function LegacySection({
  icon,
  title,
  children,
}: {
  icon: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <ScrollReveal>
      <section>
        <h2 className="mb-4 flex items-center gap-3 text-lg font-medium">
          <span className="text-3xl" aria-hidden="true">
            {icon}
          </span>
          {title}
        </h2>
        {children}
      </section>
    </ScrollReveal>
  );
}

export function LegacyBioPage() {
  return (
    <main className="legacy-bio-page container mx-auto max-w-3xl px-6 py-12">
      <ThemeToggle />
      <ProfileHeader />

      <div className="space-y-16">
        <LegacySection icon="💼" title="Work Experience">
          <WorkSection />
        </LegacySection>

        <LegacySection icon="🚀" title="Projects">
          <ProjectsSection />
        </LegacySection>

        <LegacySection icon="✍️" title="Writings">
          <WritingsSection />
        </LegacySection>

        <LegacySection icon="🛠️" title="Skills">
          <SkillsSection />
        </LegacySection>

        <LegacySection icon="🎨" title="Expertise">
          <ExpertiseSection />
        </LegacySection>

        <LegacySection icon="🧠" title="Personality">
          <PersonalCharacteristicsSection />
        </LegacySection>

        <LegacySection icon="📸" title="Gallery">
          <GallerySection />
        </LegacySection>

        <LegacySection icon="🎯" title="Hobbies">
          <HobbiesSection />
        </LegacySection>

        <LegacySection icon="🏆" title="Credentials">
          <CredentialsSection />
        </LegacySection>

        <LegacySection icon="👨‍👩‍👧‍👦" title="My Family">
          <MyFamilySection />
        </LegacySection>

        <LegacySection icon="💬" title="Contact">
          <ContactSection />
        </LegacySection>
      </div>

      <footer className="mt-20 border-t border-border pt-8">
        <div className="text-center text-sm text-muted-foreground">
          <p>© 2024 {profileData.name}</p>
        </div>
      </footer>
    </main>
  );
}
