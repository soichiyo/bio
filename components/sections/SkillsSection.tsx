import { Chip } from "../ui/Chip";
import { skills } from "../../lib/data";
import { StaggerChildren } from "../animations/StaggerChildren";

export function SkillsSection() {
  return (
    <StaggerChildren className="flex flex-wrap gap-2">
      {skills.map((skill) => (
        <Chip key={skill.text} text={skill.text} icon={skill.icon} style={skill.style} />
      ))}
    </StaggerChildren>
  );
}
