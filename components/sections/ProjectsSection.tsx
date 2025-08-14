import { projects } from "../../lib/data";

export function ProjectsSection() {
  return (
    <div className="space-y-6">
      {projects.map((project) => (
        <article
          key={project.id}
          className="group border border-border rounded-lg p-4 hover:bg-accent/50 transition-all duration-200"
        >
          {/* プロジェクト画像 - nulogicスタイルで上部に大きく表示 */}
          {project.projectImage && (
            <div className="mb-4">
              <img
                src={project.projectImage}
                alt={project.title}
                className="w-full h-32 object-cover rounded-lg"
              />
            </div>
          )}

          {/* アプリ情報とロゴ - nulogicスタイル */}
          <div className="flex items-center gap-3 mb-3">
            {project.appIcon && (
              <img
                src={project.appIcon}
                alt={`${project.appName} logo`}
                className="w-10 h-10 rounded-lg object-contain bg-white"
              />
            )}
            <div className="flex-1">
              <h3 className="font-medium text-foreground">
                {project.appName}
              </h3>
              <p className="text-sm text-muted-foreground">
                {project.appDescription}
              </p>
            </div>
            {project.status === "live" && (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:text-primary/80 font-medium transition-colors"
              >
                View →
              </a>
            )}
          </div>

          {/* タグ表示 - よりコンパクトに */}
          <div className="flex flex-wrap gap-1">
            {project.tags.map((tag) => {
              let emoji = "";
              let bgColor = "bg-muted text-muted-foreground";

              if (tag === "AI") {
                emoji = "🤖";
                bgColor = "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
              } else if (tag === "Product Design") {
                emoji = "🎨";
                bgColor = "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300";
              } else if (tag === "Engineering") {
                emoji = "💻";
                bgColor = "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";
              }

              return (
                <span
                  key={tag}
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${bgColor}`}
                >
                  <span>{emoji}</span>
                  {tag}
                </span>
              );
            })}
          </div>
        </article>
      ))}
    </div>
  );
}
