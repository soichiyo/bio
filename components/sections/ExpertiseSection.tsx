import { Section } from "../Section";

// 専門領域データ
const expertiseAreas = [
  {
    title: "AI",
    description:
      "LLMを活用したワークフローの設計、Diffusionモデルのカスタマイズ",
    icon: "🤖",
  },
  {
    title: "Product Design",
    description: "App, Web, toC, toB, サービス設計、UI、UX、デザインシステム",
    icon: "🎨",
  },
  {
    title: "Product Management",
    description:
      "MVP開発, 情報設計, 仮説検証, 事業目標とユーザー体験のバランス",
    icon: "🚀",
  },
];

export function ExpertiseSection() {
  return (
    <Section title="専門領域">
      <div className="mb-6">
        <p className="text-muted-foreground">
          AI技術を前提とした新しいユーザー体験のデザイン、それらを最速で仮説検証するMVP開発が得意です
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {expertiseAreas.map((area) => (
          <div
            key={area.title}
            className="p-6 border border-border rounded-xl bg-card hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">{area.icon}</span>
              <h3 className="text-lg font-semibold text-foreground">
                {area.title}
              </h3>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {area.description}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}
