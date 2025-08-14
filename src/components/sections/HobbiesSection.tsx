import { Section } from "../Section";
import { hobbies } from "../../lib/data";
import { Chip } from "../ui/Chip";

export function HobbiesSection() {
  return (
    <Section title="Hobbies">
      <div className="flex flex-wrap gap-2">
        {hobbies.map((hobby) => (
          <Chip key={hobby.text} {...hobby} />
        ))}
      </div>
    </Section>
  );
}
