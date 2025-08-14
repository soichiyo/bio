import { Section } from "../Section";
import { profileData } from "../../lib/data";

export function AboutSection() {
  return (
    <Section title="About">
      <p className="text-muted-foreground leading-relaxed">
        {profileData.description}
      </p>
    </Section>
  );
}
