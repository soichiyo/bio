import { Section } from '../Section';
import { hobbies } from '@/content';
import { Chip } from './Chip';

export function HobbiesSection() {
    return (
        <Section title="Hobbies">
            <div className="flex flex-wrap gap-2">
                {hobbies.map(hobby => (
                    <Chip key={hobby.text} {...hobby} />
                ))}
            </div>
        </Section>
    );
}