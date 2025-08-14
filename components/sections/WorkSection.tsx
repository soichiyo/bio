import { workExperiences } from "../../lib/data";

export function WorkSection() {
  return (
    <div className="space-y-8">
      {workExperiences.map((exp) => (
        <article key={exp.period} className="group">
          {/* 期間とタイトル - よりコンパクトに */}
          <div className="mb-3">
            <div className="text-sm text-muted-foreground mb-1">
              {exp.period}
            </div>
            <h3 className="text-base font-medium text-foreground">
              {exp.title}
            </h3>
          </div>

          {/* 会社リスト - nulogicスタイルのロゴ重視 */}
          <div className="flex flex-wrap items-center gap-2">
            {exp.companies.map((company) => (
              <div key={company.name} className="flex items-center">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card border border-border hover:bg-accent transition-colors">
                  {company.icon && (
                    <img
                      src={company.icon}
                      alt={company.name}
                      className="w-6 h-6 rounded object-contain"
                    />
                  )}
                  <span className="text-sm font-medium text-foreground">
                    {company.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}
