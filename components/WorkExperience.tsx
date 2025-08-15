// src/components/WorkExperience.tsx
import { type WorkExperienceType } from '../lib/data';

export function WorkExperience({ items }: { items: WorkExperienceType[] }) {
    // 全てのバッジに共通する基本スタイルを定義
    const baseBadgeStyle = "whitespace-nowrap border transition-colors h-[29px] px-2.5 py-1.5 rounded-[9px] text-sm font-semibold flex items-center gap-1";

    return (
        <section className="px-5 py-8">
            <h2 className="text-2xl font-bold mb-5">Work Experience</h2>
            <div className="space-y-6">
                {items.map((item, index) => (
                    <div key={index}>
                        <div className="text-muted-foreground text-sm mb-1">{item.period}</div>
                        <h3 className="text-base font-medium mb-3">{item.title}</h3>
                        <div className="flex flex-wrap gap-1">
                            {item.companies.map((company, cIndex) => (
                                // 変更点: classNameを動的に設定
                                <div key={cIndex} className={`${baseBadgeStyle} ${company.style}`}>
                                    {company.icon && (
                                        <img
                                            alt={company.name}
                                            loading="lazy"
                                            width="12"
                                            height="12"
                                            className="w-3 h-3"
                                            src={company.icon}
                                        />
                                    )}
                                    {company.name}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}