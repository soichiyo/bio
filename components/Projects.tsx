import { type ProjectType } from '../lib/data.ts';
import { ProjectCard } from './ProjectCard.tsx';

export function Projects({ items }: { items: ProjectType[] }) {
    return (
        <section className="px-5 py-8">
            <div className="flex flex-col gap-1 mb-5 px-1">
                <h2 className="text-xl font-bold">プロジェクト</h2>
                <p className="text-base text-gray-600">参加プロジェクトを一部ご紹介します (24年12月現在)</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {items.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                ))}
            </div>
        </section>
    );
}