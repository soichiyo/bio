import React from "react";

type SectionProps = {
  title: string;
  children: React.ReactNode;
};

export function Section({ title, children }: SectionProps) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-4 gap-y-4 md:gap-x-8 py-8">
      {/* 左カラム: タイトル */}
      <div className="md:col-span-1">
        <h2 className="text-muted-foreground font-medium">{title}</h2>
      </div>
      {/* 右カラム: コンテンツ */}
      <div className="md:col-span-3">{children}</div>
    </section>
  );
}
