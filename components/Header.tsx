// src/components/Header.tsx
import { profileData } from '../lib/data';
import { Instagram, Linkedin, Send, Twitter } from 'lucide-react';

// アイコン名をコンポーネントにマッピング
const iconComponents = {
    Instagram: <Instagram size={20} />,
    Threads: <Send size={20} />, // Threadsの公式アイコンがないためSendで代用
    Twitter: <Twitter size={20} />,
    Linkedin: <Linkedin size={20} />,
};

export function Header({ data }: { data: typeof profileData }) {
    return (
        <section className="flex flex-col items-center justify-center text-center w-full pt-12 pb-12 px-5">
            {/* Profile Image */}
            <img
                src={data.avatar}
                alt={data.name}
                className="w-24 h-24 rounded-full object-cover mb-4 border-2 border-white shadow-md"
            />

            {/* Name */}
            <h1 className="text-4xl font-bold mb-2">
                {data.name}
            </h1>

            {/* Description */}
            <p className="max-w-xl text-muted-foreground mb-6">
                {data.description}
            </p>

            {/* Info Section */}
            <div className="flex flex-col items-center gap-2 mb-8">
                <div className="flex items-center gap-2 text-sm text-foreground">
                    <span className="font-semibold">✍️ {data.jobTitle}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-foreground">
                    <span className="font-semibold">🇯🇵 {data.location}</span>
                </div>
            </div>

            {/* Social Links */}
            <div className="flex flex-col gap-3 w-full max-w-xs">
                {data.socialLinks.map((link) => (
                    <a
                        key={link.name}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-3 w-full px-4 py-3 bg-secondary hover:bg-secondary/80 rounded-xl transition-colors duration-200 font-semibold text-secondary-foreground"
                    >
                        {iconComponents[link.icon as keyof typeof iconComponents]}
                        {link.name}
                    </a>
                ))}
            </div>

        </section>
    );
}