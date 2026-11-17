import type { WritingResult } from "@/lib/writing/types";
import { WRITING_LIMIT, WRITING_SOURCES, WRITING_STALE_MS } from "@/lib/writing/sources";
import { formatUpdatedAt } from "@/lib/usage/format";

export function WritingSection({ result, now }: { result: WritingResult; now: Date }) {
  const bundled = result.sources.filter(source => source.origin === "bundled");
  const unavailable = result.sources.some(source => source.origin === "unavailable");
  const stale = result.sources.some(source => source.fetchedAt &&
    now.getTime() - Date.parse(source.fetchedAt) >= WRITING_STALE_MS);
  return (
    <section id="writing" className="mb-20 scroll-mt-8" aria-labelledby="writing-heading">
      <h2 id="writing-heading" className="mb-6 text-[28px] font-medium">Writing</h2>
      {result.entries.length > 0 ? (
        <div className="border-t border-border">
          {result.entries.slice(0, WRITING_LIMIT).map(writing => (
            <a key={writing.url} href={writing.url} target="_blank" rel="noopener noreferrer"
              className="flex items-start gap-4 border-b border-border py-6 hover:bg-accent sm:gap-8">
              <span className="w-10 shrink-0 font-data text-[10px] uppercase text-muted-foreground">{writing.platform}</span>
              <h3 className="min-w-0 flex-1 break-words text-sm font-medium sm:text-base">{writing.title}</h3>
              <span className="shrink-0 font-data text-[10px] text-muted-foreground">
                {writing.publishedAt
                  ? <time dateTime={writing.publishedAt} title={formatUpdatedAt(writing.publishedAt)}>{writing.displayMonth}</time>
                  : <span>{writing.displayMonth}</span>} ↗
              </span>
            </a>
          ))}
        </div>
      ) : <p role="status" className="text-sm text-muted-foreground">{unavailable ? "記事を取得できません。" : "表示できる公開記事はありません。"}</p>}
      <div className="mt-4 space-y-2 text-xs text-muted-foreground">
        {bundled.length > 0 && <p role="status">{bundled.length === result.sources.length ? "保存している記事を表示しています。" : "一部の記事は保存分です。"}</p>}
        {unavailable && result.entries.length > 0 && <p role="status">一部の媒体の記事を取得できません。</p>}
        {stale && <p role="status">記事の取得確認が遅れています。</p>}
        <details>
          <summary className="w-fit cursor-pointer underline-offset-4 hover:underline">記事の取得状況</summary>
          <ul className="mt-3 space-y-2">
            {result.sources.map(source => (
              <li key={source.platform}>
                {WRITING_SOURCES[source.platform].name}: {source.fetchedAt
                  ? <>取得確認 <time dateTime={source.fetchedAt}>{formatUpdatedAt(source.fetchedAt)}</time></>
                  : source.origin === "bundled" ? "保存記事（取得確認日時なし）" : "取得できません"}
                {source.rejectedItems > 0 && <> · 読み込めなかった記事 {source.rejectedItems}件</>}
              </li>
            ))}
          </ul>
          <p className="mt-2 leading-relaxed">公開年月と取得確認日時は別の値です。アクセス時に読み直すため、最新の公開記事がまだ反映されていない場合があります。</p>
        </details>
      </div>
      <p className="mt-5 flex gap-6 text-xs text-muted-foreground">
        <a href={WRITING_SOURCES.zenn.profileUrl} target="_blank" rel="noopener noreferrer">More on Zenn ↗</a>
        <a href={WRITING_SOURCES.note.profileUrl} target="_blank" rel="noopener noreferrer">More on note ↗</a>
      </p>
    </section>
  );
}
