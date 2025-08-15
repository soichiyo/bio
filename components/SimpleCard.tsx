// src/components/SimpleCard.tsx
import { type SimpleCardType } from "../lib/data";

export function SimpleCard({ card }: { card: SimpleCardType }) {
    return (
        // [変更] groupクラス、ボーダー、トランジションを追加
        <div className="relative aspect-square w-full overflow-hidden rounded-xl group border border-border transition-transform hover:scale-[1.02]">
            <img
                src={card.image}
                alt={card.label.text}
                // [変更] ホバーエフェクトを調整
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute bottom-3 left-3">
                <div className="flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold text-white bg-black/30 backdrop-blur-sm">
                    <span>{card.label.emoji}</span>
                    <span>{card.label.text}</span>
                </div>
            </div>
        </div>
    );
}