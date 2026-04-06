export function CredentialItem({ title, issuer, year }: { title: string; issuer: string; year: number; }) {
    return (
        <div className="flex justify-between items-start gap-4 p-4 rounded-lg border border-border bg-card">
            <div className="flex-1 min-w-0">
                <h4 className="font-medium text-foreground leading-snug">{title}</h4>
                <p className="text-sm text-muted-foreground mt-1">{issuer}</p>
            </div>
            <span className="text-sm text-muted-foreground tabular-nums shrink-0">{year}</span>
        </div>
    );
}
