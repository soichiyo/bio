import { ArrowUpRight } from "lucide-react";
import type { CredentialType } from "../../lib/data";

export function CredentialItem({ title, issuer, year, proof }: CredentialType) {
    const content = (
        <>
            <div className="flex-1 min-w-0">
                <h4 className="font-medium text-foreground leading-snug">{title}</h4>
                <p className="text-sm text-muted-foreground mt-1">{issuer}</p>
                {proof ? (
                    <span className="mt-2 inline-flex items-center gap-1.5 font-data text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
                        {proof.label}
                        <ArrowUpRight size={13} strokeWidth={1.5} />
                    </span>
                ) : null}
            </div>
            <span className="text-sm text-muted-foreground tabular-nums shrink-0">{year}</span>
        </>
    );

    const className =
        "flex justify-between items-start gap-4 p-4 rounded-lg border border-border bg-card transition-colors";

    if (proof) {
        return (
            <a
                href={proof.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`${className} hover:border-[var(--border-visible)] hover:bg-accent`}
                aria-label={`${title} ${proof.label}`}
            >
                {content}
            </a>
        );
    }

    return <div className={className}>{content}</div>;
}
