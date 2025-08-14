// app/page.tsx

// セクションコンポーネントをまとめてインポート
import { ContactSection } from "../components/sections/ContactSection";
import { GallerySection } from "../components/sections/GallerySection";
import { WorkSection } from "../components/sections/WorkSection";
import { SkillsSection } from "../components/sections/SkillsSection";
import { ProjectsSection } from "../components/sections/ProjectsSection";
import { HobbiesSection } from "../components/sections/HobbiesSection";
import { CredentialsSection } from "../components/sections/CredentialsSection";
import { MyFamilySection } from "../components/sections/MyFamilySection";
import { ExpertiseSection } from "../components/sections/ExpertiseSection";
import Image from "next/image";
import { ThemeToggle } from "../components/ui/ThemeToggle";
import { profileData } from "../lib/data";

// nulogicスタイルのシンプルなヘッダー
function ProfileHeader() {
  return (
    <header className="mb-12">
      {/* プロフィール情報 - よりミニマルに */}
      <div className="flex items-center gap-3 mb-6">
        <Image
          src={profileData.avatar}
          alt={profileData.name}
          width={40}
          height={40}
          className="rounded-full object-cover"
          priority
        />
        <div>
          <h1 className="text-xl font-semibold text-foreground">
            {profileData.name}
          </h1>
          <p className="text-sm text-muted-foreground">{profileData.jobTitle}</p>
        </div>
      </div>

      {/* 説明文 - よりコンパクトに */}
      <p className="text-muted-foreground max-w-2xl leading-relaxed mb-6">
        {profileData.description}
      </p>

      {/* SNSリンク - シンプルに */}
      <div className="flex gap-3 text-sm">
        {profileData.socialLinks.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors underline"
          >
            {link.name === "X (Twitter)" ? "𝕏" : link.name}
          </a>
        ))}
      </div>
    </header>
  );
}

export default function ProfilePage() {
  return (
    <main className="container mx-auto max-w-3xl px-6 py-12">
      <ThemeToggle />
      <ProfileHeader />

      {/* nulogicスタイルのセクション構成 - より密に、絵文字ヘッダー付き */}
      <div className="space-y-16">
        {/* 💼 Work Experience */}
        <section>
          <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
            <span>💼</span>
            Work Experience
          </h2>
          <WorkSection />
        </section>

        {/* 🚀 Projects */}
        <section>
          <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
            <span>🚀</span>
            Projects
          </h2>
          <ProjectsSection />
        </section>

        {/* 🛠️ Skills */}
        <section>
          <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
            <span>🛠️</span>
            Skills
          </h2>
          <SkillsSection />
        </section>

        {/* 🎨 Expertise */}
        <section>
          <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
            <span>🎨</span>
            Expertise
          </h2>
          <ExpertiseSection />
        </section>

        {/* 📸 Gallery */}
        <section>
          <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
            <span>📸</span>
            Gallery
          </h2>
          <GallerySection />
        </section>

        {/* 🎯 Hobbies */}
        <section>
          <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
            <span>🎯</span>
            Hobbies
          </h2>
          <HobbiesSection />
        </section>

        {/* 🏆 Credentials */}
        <section>
          <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
            <span>🏆</span>
            Credentials
          </h2>
          <CredentialsSection />
        </section>

        {/* 👨‍👩‍👧‍👦 Family */}
        <section>
          <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
            <span>👨‍👩‍👧‍👦</span>
            My Family
          </h2>
          <MyFamilySection />
        </section>

        {/* 💬 Contact */}
        <section>
          <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
            <span>💬</span>
            Contact
          </h2>
          <ContactSection />
        </section>
      </div>

      {/* フッター - よりシンプルに */}
      <footer className="mt-20 pt-8 border-t border-border">
        <div className="text-center text-sm text-muted-foreground">
          <p className="mb-2">無料で相談する</p>
          <p>© 2024 {profileData.name}</p>
        </div>
      </footer>
    </main>
  );
}