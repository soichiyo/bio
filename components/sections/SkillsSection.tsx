import { Chip } from "../ui/Chip";
import { skills } from "../../lib/data";

export function SkillsSection() {
  return (
    <div className="flex flex-wrap gap-2">
      {skills.map((skill) => (
        <Chip
          key={skill.text}
          text={skill.text}
          icon={skill.icon}
          style={skill.style}
        />
      ))}
    </div>
  );
}
