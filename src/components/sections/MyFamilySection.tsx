import { Section } from '../Section';
import { myFamily } from '../../lib/data';
import { SimpleCard } from '../SimpleCard';

export function MyFamilySection() {
    return (
        <Section title="My Family">
            <div className="grid grid-cols-2 gap-4">
                {myFamily.map(member => (
                    <SimpleCard key={member.id} card={member} />
                ))}
            </div>
        </Section>
    );
}