import { Section } from '../Section';
import { certifications, education } from '../../lib/data';
import { CredentialItem } from '../ui/CredentialItem';

export function CredentialsSection() {
    return (
        <Section title="Credentials">
            <div className="space-y-6">
                <div className="space-y-4">
                    <h4 className="font-medium text-text-main">Certifications</h4>
                    {certifications.map(cert => (
                        <CredentialItem key={cert.title} {...cert} />
                    ))}
                </div>
                <div className="space-y-4">
                    <h4 className="font-medium text-text-main">Education</h4>
                    {education.map(edu => (
                        <CredentialItem key={edu.title} {...edu} />
                    ))}
                </div>
            </div>
        </Section>
    );
}