export function CredentialItem({ title, issuer, year }: { title: string; issuer: string; year: number; }) {
    return (
        <div className="flex justify-between items-baseline">
            <div>
                <h4 className="font-semibold text-text-main">{title}</h4>
                <p className="text-sm text-text-secondary">{issuer}</p>
            </div>
            <p className="text-sm text-text-tertiary">{year}</p>
        </div>
    );
}