"use client";

import { motion } from "motion/react";
import {
  ArrowUpRight,
  Bot,
  BriefcaseBusiness,
  CircuitBoard,
  MessageCircle,
  Mail,
} from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import {
  expertise,
  myFamily,
  profileData,
  projects,
  skills,
  workExperiences,
  writings,
} from "../lib/data";
import { ChatModal } from "./ui/ChatModal";
import type { CSSProperties, ReactNode } from "react";

function Card({
  children,
  className = "",
  label,
}: {
  children: ReactNode;
  className?: string;
  label: string;
}) {
  return (
    <motion.article
      className={`telemetry-card group p-4 sm:p-5 ${className}`}
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="telemetry-label mb-4">{label}</div>
      {children}
    </motion.article>
  );
}

function SegmentMeter({ value, segments = 18 }: { value: number; segments?: number }) {
  const filled = Math.round((value / 100) * segments);

  return (
    <div className="grid grid-cols-[repeat(var(--segments),minmax(0,1fr))] gap-1" style={{ "--segments": segments } as CSSProperties}>
      {Array.from({ length: segments }).map((_, index) => (
        <span
          key={index}
          className={`h-4 border border-border transition-colors duration-300 ${index < filled ? "bg-foreground" : "bg-transparent"}`}
          style={{ transitionDelay: `${index * 45}ms` }}
        />
      ))}
    </div>
  );
}

function MiniBars({ values, labels }: { values: number[]; labels?: string[] }) {
  return (
    <div className="flex h-12 items-end gap-1 sm:h-16" aria-hidden="true">
      {values.map((value, index) => (
        <span
          key={`${value}-${index}`}
          className="w-full border border-border bg-foreground/80"
          title={labels?.[index]}
          style={{
            height: `${value}%`,
            transition: "height 700ms cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        />
      ))}
    </div>
  );
}

function ProfileLinks() {
  return (
    <div className="flex flex-wrap gap-2">
      {profileData.socialLinks.map((link) => (
        <a
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 border border-border px-2 py-1.5 font-data text-[11px] uppercase tracking-[0.04em] text-muted-foreground transition-colors hover:border-[var(--border-visible)] hover:text-foreground"
        >
          <span className="truncate">{link.name === "X (Twitter)" ? "X" : link.name}</span>
          <ArrowUpRight className="h-3 w-3 shrink-0" strokeWidth={1.5} />
        </a>
      ))}
    </div>
  );
}

export function PersonalOSDashboard() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const coachingHours = 850;
  const familyNodes = myFamily.length;
  const projectCount = projects.length;
  const writingCount = writings.length;

  const currentWork = workExperiences[0];
  const latestWriting = writings[0];
  const zennCount = writings.filter((writing) => writing.platform === "zenn").length;
  const noteCount = writings.filter((writing) => writing.platform === "note").length;
  const capabilityItems = useMemo(() => [...skills.slice(0, 6), ...expertise.slice(0, 6)], []);
  const capabilityTotal = skills.length + expertise.length;
  const capabilityGroups = useMemo(
    () => [
      { label: "product", value: 92 },
      { label: "coaching", value: 86 },
      { label: "creative", value: 72 },
      { label: "technical", value: 64 },
    ],
    []
  );
  const agenticSignals = useMemo(
    () => [
      { label: "delegation", value: "Codex + opencode workers" },
      { label: "harness", value: "Hermes Agent / cron / health checks" },
      { label: "knowledge", value: "Studio Prairie rules / skills / templates" },
      { label: "ops", value: "PRs / review / repo stewardship" },
    ],
    []
  );
  const careerBars = useMemo(
    () => [
      { label: "LINE / 1y", value: 22 },
      { label: "Lovegraph / 5y", value: 92 },
      { label: "THE COACH / 1y", value: 24 },
      { label: "Studio Prairie / active", value: 48 },
    ],
    []
  );

  return (
    <section className="mb-14 sm:mb-16">
      <div className="mb-5 flex flex-col gap-3 border-b border-border pb-5 sm:mb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="telemetry-label mb-2">PERSONAL PROFILE / TELEMETRY VIEW</div>
          <h1 className="text-3xl font-semibold tracking-[-0.01em] text-foreground sm:text-5xl">
            {profileData.name}
          </h1>
        </div>
        <div className="flex items-center gap-3 font-data text-xs uppercase tracking-[0.08em] text-muted-foreground">
          <span className="h-2 w-2 bg-foreground" />
          <span>{profileData.location}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.72fr)_minmax(220px,0.86fr)_minmax(190px,0.7fr)] lg:items-stretch">
        <Card label="PROFILE SUMMARY" className="sm:col-span-2 lg:col-span-1">
          <div className="grid gap-5 sm:grid-cols-[136px_1fr] sm:items-start">
            <div className="relative h-36 w-full overflow-hidden border border-border bg-muted sm:h-36 sm:w-36">
              <Image
                src={profileData.avatar}
                alt={profileData.name}
                fill
                sizes="(max-width: 640px) 100vw, 144px"
                priority
                className="object-cover grayscale"
              />
            </div>
            <div className="min-w-0">
              <div className="font-display-dot text-[42px] font-normal leading-none tracking-[-0.03em] text-[var(--display)] sm:text-[56px]">
                SOICHIYO
              </div>
              <p className="mt-3 text-lg leading-snug tracking-[-0.01em] text-foreground sm:text-2xl">
                {profileData.description}
              </p>
              <div className="mt-5 grid grid-cols-1 gap-2 font-data text-xs uppercase tracking-[0.08em] text-muted-foreground sm:grid-cols-2">
                <span>Role / {profileData.jobTitle}</span>
                <span>Base / {profileData.location}</span>
                <span>Projects / {projectCount}</span>
                <span>Family / {familyNodes}</span>
              </div>
            </div>
          </div>
        </Card>

        <Card label="CURRENT WORK">
          <div className="flex h-full flex-col gap-5">
            <BriefcaseBusiness className="h-6 w-6 text-muted-foreground" strokeWidth={1.5} />
            <div>
              <div className="font-data text-xs uppercase tracking-[0.08em] text-muted-foreground">
                {currentWork.period}
              </div>
              <h2 className="mt-2 text-2xl font-medium tracking-[-0.01em] text-foreground">
                {currentWork.companies[0]?.name}
              </h2>
              <p className="mt-1 text-sm leading-snug text-muted-foreground">{currentWork.title.replace(" at", "")}</p>
            </div>
            <div className="border-t border-border pt-4">
              <p className="text-sm leading-snug text-muted-foreground">
                Current focus is the business and product growth of Prairie Card.
              </p>
            </div>
          </div>
        </Card>

        <Card label="COACHING PRACTICE">
          <div className="flex h-full flex-col gap-5">
            <div className="flex items-baseline gap-2">
              <span className="font-display-dot text-6xl leading-none tracking-[-0.03em] text-[var(--display)]">
                {coachingHours}
              </span>
              <span className="font-data text-sm uppercase text-muted-foreground">hrs+</span>
            </div>
            <div className="space-y-3">
              <SegmentMeter value={86} />
              <p className="text-sm text-muted-foreground">
                Professional coaching hours logged through client work.
              </p>
            </div>
            <div className="border-t border-border pt-4">
              <p className="font-data text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
                Leadership / product teams / personal transformation
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[repeat(24,minmax(0,1fr))]">
        <Card label="CAREER LOG" className="sm:col-span-2 lg:col-span-7">
          <div className="grid h-full gap-4 xl:grid-cols-[1fr_140px]">
            <div className="space-y-2">
              {workExperiences.map((work) => (
                <div key={work.period} className="grid grid-cols-[84px_1fr] gap-3 border-b border-border pb-1.5 last:border-0">
                  <span className="font-data text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
                    {work.period}
                  </span>
                  <span className="text-sm text-foreground">{work.companies.map((company) => company.name).join(" / ")}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col justify-between gap-3">
              <MiniBars
                values={careerBars.map((item) => item.value)}
                labels={careerBars.map((item) => item.label)}
              />
              <p className="font-data text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
                Tenure by years
              </p>
            </div>
          </div>
        </Card>

        <Card label="CAPABILITY MATRIX" className="min-h-[300px] lg:col-span-5">
          <div className="flex h-full flex-col gap-5">
            <div className="flex items-start justify-between gap-3">
              <CircuitBoard className="h-6 w-6 text-muted-foreground" strokeWidth={1.5} />
              <div className="text-right">
                <div className="font-display-dot text-5xl leading-none tracking-[-0.03em] text-[var(--display)]">
                  {capabilityTotal}
                </div>
                <div className="font-data text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
                  signals
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {capabilityGroups.map((group) => (
                <div key={group.label} className="grid grid-cols-[82px_1fr] items-center gap-3">
                  <span className="font-data text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
                    {group.label}
                  </span>
                  <div className="grid grid-cols-12 gap-1">
                    {Array.from({ length: 12 }).map((_, index) => (
                      <span
                        key={index}
                        className={`h-3 border border-border ${index < Math.round((group.value / 100) * 12) ? "bg-foreground" : "bg-transparent"}`}
                        style={{ opacity: index < Math.round((group.value / 100) * 12) ? 0.42 + index * 0.04 : 1 }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-x-3 gap-y-2 border-t border-border pt-3">
              {capabilityItems.slice(0, 8).map((item, index) => (
                <div key={`${item.text}-${index}`} className="flex min-w-0 items-center gap-2">
                  <span className="h-2 w-2 shrink-0 bg-foreground" style={{ opacity: 0.3 + (index % 5) * 0.12 }} />
                  <span className="truncate font-data text-[11px] uppercase tracking-[0.06em] text-muted-foreground">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card label="AI OPERATIONS" className="min-h-[300px] sm:col-span-2 lg:col-span-7">
          <div className="flex h-full flex-col gap-5">
            <div className="flex items-start justify-between gap-3">
              <Bot className="h-6 w-6 text-muted-foreground" strokeWidth={1.5} />
              <div className="grid grid-cols-4 gap-1.5">
                {["CDX", "CC", "OP", "HM"].map((item, index) => (
                  <span
                    key={item}
                    className="flex h-8 w-8 items-center justify-center border border-border font-data text-[10px] uppercase text-muted-foreground"
                    style={{ opacity: 0.44 + index * 0.14 }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-medium leading-tight tracking-[-0.01em] text-foreground">
                Agentic workbench, not just prompts.
              </h2>
              <p className="mt-3 text-sm leading-snug text-muted-foreground">
                Codex, Claude Code, opencode, Hermes Agent, and Studio Prairie LLM assets are used as a delegated product and engineering environment.
              </p>
            </div>

            <div className="grid gap-2 border-t border-border pt-3">
              {agenticSignals.map((signal) => (
                <div key={signal.label} className="grid grid-cols-[94px_1fr] gap-3">
                  <span className="font-data text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
                    {signal.label}
                  </span>
                  <span className="text-sm leading-snug text-foreground">
                    {signal.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card label="CONTACT BEACON" className="min-h-[300px] lg:col-span-5">
          <div className="flex min-h-[224px] flex-col gap-4">
            <div className="flex items-center justify-between">
              <Mail className="h-6 w-6 signal-red" strokeWidth={1.5} />
              <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={1.5} />
            </div>
            <div>
              <div className="mb-3 h-2 w-20 signal-red-bg" />
              <h2 className="text-xl font-medium tracking-[-0.01em] text-foreground">Open channel</h2>
              <p className="mt-1 break-all font-data text-[11px] uppercase tracking-[0.04em] text-muted-foreground">
                {profileData.email}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => setIsChatOpen(true)}
                className="inline-flex items-center justify-center gap-2 border border-border px-3 py-2 font-data text-[11px] uppercase tracking-[0.08em] text-foreground transition-colors hover:border-[var(--border-visible)] hover:bg-accent"
              >
                <MessageCircle size={14} />
                Chat with AI
              </button>
              <a
                className="inline-flex items-center justify-center gap-2 border border-border px-3 py-2 font-data text-[11px] uppercase tracking-[0.08em] text-muted-foreground transition-colors hover:border-[var(--border-visible)] hover:text-foreground"
                href={`mailto:${profileData.email}`}
              >
                Mail
                <ArrowUpRight size={14} />
              </a>
            </div>
            <div className="border-t border-border pt-3">
              <ProfileLinks />
            </div>
          </div>
        </Card>

        <Card label="WRITING TRANSMISSION" className="min-h-[260px] sm:col-span-2 lg:col-span-full">
          <div className="flex h-full flex-col gap-4">
            <div className="grid gap-4 md:grid-cols-[1fr_150px]">
              <a
                href={latestWriting.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group/latest min-w-0 border-y border-border py-3"
              >
                <div className="mb-2 flex items-center justify-between gap-3 font-data text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
                  <span>latest packet</span>
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover/latest:-translate-y-0.5 group-hover/latest:translate-x-0.5" strokeWidth={1.5} />
                </div>
                <h3 className="line-clamp-2 text-lg font-medium leading-snug tracking-[-0.01em] text-foreground">
                  {latestWriting.title}
                </h3>
                <div className="mt-3 flex flex-wrap gap-3 font-data text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
                  <span>{latestWriting.platform}</span>
                  <span>{latestWriting.date}</span>
                </div>
              </a>

              <div className="grid grid-cols-3 gap-2 md:grid-cols-1">
                <div>
                  <div className="font-display-dot text-5xl leading-none tracking-[-0.03em] text-[var(--display)]">
                    {String(writingCount).padStart(2, "0")}
                  </div>
                  <div className="font-data text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
                    entries
                  </div>
                </div>
                <div className="border-l border-border pl-3 md:border-l-0 md:border-t md:pl-0 md:pt-2">
                  <div className="font-data text-sm text-foreground">{zennCount}</div>
                  <div className="font-data text-[11px] uppercase tracking-[0.08em] text-muted-foreground">zenn</div>
                </div>
                <div className="border-l border-border pl-3 md:border-l-0 md:border-t md:pl-0 md:pt-2">
                  <div className="font-data text-sm text-foreground">{noteCount}</div>
                  <div className="font-data text-[11px] uppercase tracking-[0.08em] text-muted-foreground">note</div>
                </div>
              </div>
            </div>

            <div className="grid gap-2">
              {writings.slice(0, 3).map((writing, index) => (
                <a
                  key={writing.url}
                  href={writing.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid min-w-0 grid-cols-[14px_72px_1fr_auto] items-center gap-2 border-b border-border pb-2 last:border-0 last:pb-0"
                >
                  <span
                    className="h-2 w-2 bg-foreground"
                    style={{ opacity: 0.45 + index * 0.18 }}
                  />
                  <span className="font-data text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
                    {writing.date}
                  </span>
                  <span className="truncate text-sm text-foreground">
                    {writing.title}
                  </span>
                  <span className="font-data text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
                    {writing.platform}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </Card>
      </div>
      <ChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </section>
  );
}
