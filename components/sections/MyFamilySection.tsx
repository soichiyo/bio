import { myFamily } from '../../lib/data';
import { SimpleCard } from '../SimpleCard';

export function MyFamilySection() {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {myFamily.map(member => (
                <SimpleCard key={member.id} card={member} />
            ))}
        </div>
    );
}
