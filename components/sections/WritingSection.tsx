import { LogoTile } from "@/components/ui/LogoTile";
import { logoByName } from "@/content/logos";
import type { WritingResult } from "@/lib/writing/types";
import { WRITING_LIMIT, WRITING_SOURCES } from "@/lib/writing/sources";
import { formatUpdatedAt } from "@/lib/usage/format";

export function WritingSection({ result }: { result: WritingResult }) {
  const unavailable = result.sources.some(source => source.origin === "unavailable");
  return (
    <section id="writing" className="mb-20 scroll-mt-8" aria-labelledby="writing-heading">
      <h2 id="writing-heading" className="mb-6 text-[28px] font-medium">Writing</h2>
      {result.entries.length > 0 ? (
        <div className="border-t border-border">
          {result.entries.slice(0, WRITING_LIMIT).map(writing => (
            <a key={writing.url} href={writing.url} target="_blank" rel="noopener noreferrer"
              className="grid grid-cols-[44px_minmax(0,1fr)] items-start gap-x-4 gap-y-2 border-b border-border py-3.5 hover:bg-accent sm:grid-cols-[44px_minmax(0,1fr)_auto] sm:items-center">
              <span className="row-span-2 sm:row-span-1"><LogoTile variant="writing" name={writing.platform} logo={logoByName[WRITING_SOURCES[writing.platform].name]} /></span>
              <h3 className="min-w-0 break-words text-[17px] font-medium">{writing.title}</h3>
              <span className="col-start-2 font-data text-xs text-muted-foreground sm:col-start-3">
                {writing.publishedAt
                  ? <time dateTime={writing.publishedAt} title={formatUpdatedAt(writing.publishedAt)}>{writing.displayMonth}</time>
                  : <span>{writing.displayMonth}</span>} ↗
              </span>
            </a>
          ))}
        </div>
      ) : <p role="status" className="text-sm text-muted-foreground">{unavailable ? "記事を取得できません。" : "表示できる公開記事はありません。"}</p>}
      <p className="mt-5 flex gap-6 text-xs text-muted-foreground">
        <a href={WRITING_SOURCES.zenn.profileUrl} target="_blank" rel="noopener noreferrer">More on Zenn ↗</a>
        <a href={WRITING_SOURCES.note.profileUrl} target="_blank" rel="noopener noreferrer">More on note ↗</a>
      </p>
    </section>
  );
}
