import { ExternalLink } from "lucide-react";
import { writings } from "../../lib/data";

const platformMeta = {
  zenn: { label: "Zenn", style: "bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300" },
  note: { label: "note", style: "bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300" },
} as const;

export function WritingsSection() {
  return (
    <div className="space-y-4">
      {writings.map((w) => {
        const meta = platformMeta[w.platform];
        return (
          <a
            key={w.url}
            href={w.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-start gap-3 p-3 -mx-3 rounded-lg hover:bg-accent transition-colors"
          >
            <span
              className={`shrink-0 mt-0.5 text-xs font-medium px-2 py-0.5 rounded ${meta.style}`}
            >
              {meta.label}
            </span>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-medium text-foreground group-hover:underline underline-offset-2 line-clamp-2">
                {w.title}
              </h3>
              <span className="text-xs text-muted-foreground">{w.date}</span>
            </div>
            <ExternalLink className="shrink-0 mt-1 w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
        );
      })}

      <div className="flex gap-4 pt-2 text-xs text-muted-foreground">
        <a
          href="https://zenn.dev/soichiyo"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground transition-colors"
        >
          Zenn で他の記事を読む →
        </a>
        <a
          href="https://note.com/soichiro"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground transition-colors"
        >
          note で他の記事を読む →
        </a>
      </div>
    </div>
  );
}
