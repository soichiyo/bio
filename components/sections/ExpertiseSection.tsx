import { expertise } from "../../lib/data";
import { Chip } from "../ui/Chip";

export function ExpertiseSection() {
  return (
    <div>
      <div className="mb-6">
        <p className="text-muted-foreground">
          Professional Coach、Product Manager、そして創作活動を通じて培った多様な専門領域です
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        {expertise.map((skill, index) => (
          <Chip
            key={`${skill.text}-${index}`}
            text={skill.text}
            icon={skill.icon}
            style={skill.style}
          />
        ))}
      </div>
    </div>
  );
}
