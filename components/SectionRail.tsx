"use client";

import { useEffect, useMemo, useState } from "react";

type RailSection = {
  id: string;
  code: string;
  label: string;
};

const sections: RailSection[] = [
  { id: "overview", code: "OV", label: "Overview" },
  { id: "career", code: "01", label: "Career Log" },
  { id: "projects", code: "02", label: "Modules" },
  { id: "writings", code: "03", label: "Writings" },
  { id: "skills", code: "04", label: "Skills" },
  { id: "expertise", code: "05", label: "Expertise" },
  { id: "personality", code: "06", label: "Personality" },
  { id: "gallery", code: "07", label: "Gallery" },
  { id: "hobbies", code: "08", label: "Hobbies" },
  { id: "credentials", code: "09", label: "Credentials" },
  { id: "family", code: "10", label: "Family" },
  { id: "contact", code: "11", label: "Contact" },
];

export function SectionRail() {
  const [activeId, setActiveId] = useState(sections[0].id);
  const [progress, setProgress] = useState(0);

  const sectionIds = useMemo(() => sections.map((section) => section.id), []);

  useEffect(() => {
    const update = () => {
      const scrollTop = window.scrollY;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollable > 0 ? Math.min(scrollTop / scrollable, 1) : 0);

      const probeY = window.innerHeight * 0.32;
      let current = sections[0].id;

      for (const id of sectionIds) {
        const element = document.getElementById(id);
        if (!element) continue;
        const rect = element.getBoundingClientRect();
        if (rect.top <= probeY && rect.bottom > 0) {
          current = id;
        }
      }

      setActiveId(current);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [sectionIds]);

  function scrollToSection(id: string) {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <nav
      aria-label="Section navigation"
      className="fixed left-0 top-1/2 z-40 hidden -translate-y-1/2 md:block 2xl:left-[calc((100vw-72rem)/2-4rem)]"
    >
      <div className="telemetry-card flex w-7 flex-col items-center gap-1 px-1 py-2">
        <div className="relative mb-1 h-10 w-px overflow-hidden bg-border">
          <div
            className="absolute left-0 top-0 w-px bg-foreground transition-transform duration-200"
            style={{
              height: "100%",
              transform: `translateY(${Math.round((progress - 1) * 100)}%)`,
            }}
          />
        </div>

        {sections.map((section) => {
          const isActive = activeId === section.id;

          return (
            <button
              key={section.id}
              type="button"
              onClick={() => scrollToSection(section.id)}
              className={`group/rail relative flex h-5 w-5 items-center justify-center border font-data text-[8px] tracking-[0.04em] transition-colors ${
                isActive
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-transparent text-muted-foreground hover:border-[var(--border-visible)] hover:text-foreground"
              }`}
              aria-current={isActive ? "true" : undefined}
              aria-label={`Jump to ${section.label}`}
            >
              <span>{section.code}</span>
              <span className="pointer-events-none absolute left-full ml-2 whitespace-nowrap border border-border bg-card px-2 py-1 font-data text-[10px] uppercase tracking-[0.08em] text-foreground opacity-0 transition-opacity group-hover/rail:opacity-100">
                {section.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
