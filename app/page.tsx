// app/page.tsx

// セクションコンポーネントをまとめてインポート
import { ScrollReveal } from "../components/animations/ScrollReveal";
import { ContactSection } from "../components/sections/ContactSection";
import { GallerySection } from "../components/sections/GallerySection";
import { WorkSection } from "../components/sections/WorkSection";
import { SkillsSection } from "../components/sections/SkillsSection";
import { ProjectsSection } from "../components/sections/ProjectsSection";
import { HobbiesSection } from "../components/sections/HobbiesSection";
import { CredentialsSection } from "../components/sections/CredentialsSection";
import { MyFamilySection } from "../components/sections/MyFamilySection";
import { ExpertiseSection } from "../components/sections/ExpertiseSection";
import { PersonalCharacteristicsSection } from "../components/sections/PersonalCharacteristicsSection";
import { ThemeToggle } from "../components/ui/ThemeToggle";
import { ProfileHeader } from "../components/ProfileHeader";
import { profileData } from "../lib/data";

export default function ProfilePage() {
  return (
    <main className="container mx-auto max-w-3xl px-6 py-12">
      <ThemeToggle />
      <ProfileHeader />

      {/* nulogicスタイルのセクション構成 - より密に、絵文字ヘッダー付き */}
      <div className="space-y-16">
        {/* 💼 Work Experience */}
        <ScrollReveal>
          <section>
            <h2 className="text-lg font-medium mb-4 flex items-center gap-3">
              <span className="text-3xl">💼</span>
              Work Experience
            </h2>
            <WorkSection />
          </section>
        </ScrollReveal>

        {/* 🚀 Projects */}
        <ScrollReveal>
          <section>
            <h2 className="text-lg font-medium mb-4 flex items-center gap-3">
              <span className="text-3xl">🚀</span>
              Projects
            </h2>
            <ProjectsSection />
          </section>
        </ScrollReveal>

        {/* 🛠️ Skills */}
        <ScrollReveal>
          <section>
            <h2 className="text-lg font-medium mb-4 flex items-center gap-3">
              <span className="text-3xl">🛠️</span>
              Skills
            </h2>
            <SkillsSection />
          </section>
        </ScrollReveal>

        {/* 🎨 Expertise */}
        <ScrollReveal>
          <section>
            <h2 className="text-lg font-medium mb-4 flex items-center gap-3">
              <span className="text-3xl">🎨</span>
              Expertise
            </h2>
            <ExpertiseSection />
          </section>
        </ScrollReveal>

        {/* 🧠 Personal Characteristics */}
        <ScrollReveal>
          <section>
            <h2 className="text-lg font-medium mb-4 flex items-center gap-3">
              <span className="text-3xl">🧠</span>
              Personality
            </h2>
            <PersonalCharacteristicsSection />
          </section>
        </ScrollReveal>

        {/* 📸 Gallery */}
        <ScrollReveal>
          <section>
            <h2 className="text-lg font-medium mb-4 flex items-center gap-3">
              <span className="text-3xl">📸</span>
              Gallery
            </h2>
            <GallerySection />
          </section>
        </ScrollReveal>

        {/* 🎯 Hobbies */}
        <ScrollReveal>
          <section>
            <h2 className="text-lg font-medium mb-4 flex items-center gap-3">
              <span className="text-3xl">🎯</span>
              Hobbies
            </h2>
            <HobbiesSection />
          </section>
        </ScrollReveal>

        {/* 🏆 Credentials */}
        <ScrollReveal>
          <section>
            <h2 className="text-lg font-medium mb-4 flex items-center gap-3">
              <span className="text-3xl">🏆</span>
              Credentials
            </h2>
            <CredentialsSection />
          </section>
        </ScrollReveal>

        {/* 👨‍👩‍👧‍👦 Family */}
        <ScrollReveal>
          <section>
            <h2 className="text-lg font-medium mb-4 flex items-center gap-3">
              <span className="text-3xl">👨‍👩‍👧‍👦</span>
              My Family
            </h2>
            <MyFamilySection />
          </section>
        </ScrollReveal>

        {/* 💬 Contact */}
        <ScrollReveal>
          <section>
            <h2 className="text-lg font-medium mb-4 flex items-center gap-3">
              <span className="text-3xl">💬</span>
              Contact
            </h2>
            <ContactSection />
          </section>
        </ScrollReveal>
      </div>

      {/* フッター - よりシンプルに */}
      <footer className="mt-20 pt-8 border-t border-border">
        <div className="text-center text-sm text-muted-foreground">
          <p>© 2024 {profileData.name}</p>
        </div>
      </footer>
    </main>
  );
}