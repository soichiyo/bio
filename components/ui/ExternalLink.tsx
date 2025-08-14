import { ArrowUpRight } from 'lucide-react';

export function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1 text-text-secondary hover:text-text-main transition-colors"
        >
            {children}
            <ArrowUpRight
                size={14}
                className="text-text-tertiary transition-transform group-hover:-translate-y-px group-hover:translate-x-px"
            />
        </a>
    );
}