import { ExternalLink } from "../ui/ExternalLink";
import { profileData } from "../../lib/data";

export function ContactSection() {
  return (
    <div className="flex flex-col gap-2">
      <ExternalLink href={`mailto:${profileData.email}`}>
        {profileData.email}
      </ExternalLink>
      {profileData.socialLinks.map((link) => (
        <ExternalLink key={link.name} href={link.url}>
          {link.name}
        </ExternalLink>
      ))}
    </div>
  );
}
