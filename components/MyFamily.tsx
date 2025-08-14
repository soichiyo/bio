// src/components/MyFamily.tsx
import { type SimpleCardType } from "../lib/data.ts";
import { SimpleCard } from "./SimpleCard.tsx";

export function MyFamily({ items }: { items: SimpleCardType[] }) {
    return (
        <section className="px-5 py-8">
            <div className="flex items-center gap-2 mb-5 px-1">
                <span className="text-xl">🏠</span>
                <h2 className="text-xl font-bold">My Family</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
                {items.map((item) => (
                    <SimpleCard key={item.id} card={item} />
                ))}
            </div>
        </section>
    );
}