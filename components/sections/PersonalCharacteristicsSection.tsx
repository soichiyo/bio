import { personalCharacteristics } from "../../lib/data";

export function PersonalCharacteristicsSection() {
  return (
    <div>
      <div className="mb-6">
        <p className="text-muted-foreground">
          MBTI診断結果と個人的な特性について
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {personalCharacteristics.map((characteristic, index) => (
          <div
            key={`${characteristic.title}-${index}`}
            className="telemetry-card p-4"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="h-2 w-2 bg-foreground" style={{ opacity: 0.45 + (index % 3) * 0.18 }} />
              <h3 className="text-md font-semibold text-foreground">
                {characteristic.title}
              </h3>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {characteristic.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
