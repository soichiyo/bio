import { type ProjectType } from '../lib/data.ts';

export function ProjectCard({ project }: { project: ProjectType }) {
    return (
        <div className="border bg-card text-card-foreground shadow-sm overflow-hidden rounded-3xl">
            <div className="p-0">
                <div className={project.bgColor}>
                    <div className="relative aspect-square w-full">
                        {project.projectImage ? (
                            <img
                                alt={`${project.appName} project`}
                                loading="lazy"
                                className="object-cover absolute h-full w-full left-0 top-0 right-0 bottom-0"
                                src={project.projectImage}
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center pb-20">
                                <div className="text-[64px] flex gap-4">
                                    {project.emojis?.map((emoji, i) => <span key={i}>{emoji}</span>)}
                                </div>
                            </div>
                        )}
                        <div className={`absolute bottom-0 left-0 right-0 p-4 flex flex-col gap-3 ${project.projectImage ? 'bg-gradient-to-t from-black/50 to-transparent' : ''}`}>
                            <div className="flex flex-wrap items-start gap-1">
                                {project.tags.map((tag, i) => (
                                    <div key={i} className="inline-flex items-center whitespace-nowrap border px-2.5 py-0.5 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-white/10 backdrop-blur-xl border-white/10 rounded-lg text-white/70 text-sm font-normal">
                                        {tag}
                                    </div>
                                ))}
                            </div>
                            <div className="px-1">
                                <h4 className="text-white text-xl font-bold">{project.title}</h4>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center p-3 pl-4 bg-[#F6F5F4] justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden">
                            <img
                                alt={`${project.appName} logo`}
                                loading="lazy"
                                width="40"
                                height="40"
                                src={project.appIcon}
                            />
                        </div>
                        <div>
                            <h3 className="font-bold">{project.appName}</h3>
                            <p className="text-sm text-gray-600">{project.appDescription}</p>
                        </div>
                    </div>
                    {project.status === 'live' ? (
                        <a href={project.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary/5 text-secondary-foreground hover:bg-secondary/80 h-10 rounded-lg px-6 py-2">
                            開く
                        </a>
                    ) : (
                        <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary/5 text-secondary-foreground hover:bg-secondary/80 h-10 rounded-lg px-6 py-2" disabled>
                            開発中
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}