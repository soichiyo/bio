import { hobbies } from "../../lib/data";
import { Chip } from "../ui/Chip";
import { StaggerChildren } from "../animations/StaggerChildren";

export function HobbiesSection() {
  return (
    <StaggerChildren className="flex flex-wrap gap-2">
      {hobbies.map((hobby) => (
        <Chip key={hobby.text} {...hobby} />
      ))}
    </StaggerChildren>
  );
}
