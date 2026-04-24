"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { projects } from "../../lib/data";

export function ProjectsSection() {
  return (
    <div className="space-y-4 sm:space-y-6">
      {projects.map((project) => (
        <motion.article
          key={project.id}
          className="group border border-border rounded-lg p-3 transition-colors duration-200 hover:bg-accent/50 sm:p-4"
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          {/* プロジェクト画像 - nulogicスタイルで上部に大きく表示 */}
          {project.projectImage && (
            <div className="mb-4 flex justify-center sm:block">
              <Image
                src={project.projectImage}
                alt={project.title}
                width={697}
                height={138}
                sizes="(max-width: 640px) 320px, 100vw"
                className="h-auto w-[320px] max-w-full rounded-lg object-contain sm:h-32 sm:w-full sm:object-cover"
              />
            </div>
          )}

          {/* アプリ情報とロゴ - nulogicスタイル */}
          <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center">
            {project.appIcon && (
              <Image
                src={project.appIcon}
                alt={`${project.appName} logo`}
                width={40}
                height={40}
                className="h-10 w-10 rounded-lg bg-white object-contain"
              />
            )}
            <div className="min-w-0 flex-1">
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
                className="text-xs font-medium text-primary transition-colors hover:text-primary/80 sm:self-auto"
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
        </motion.article>
      ))}
    </div>
  );
}
