import type { ProjectType } from './types';



export const projects: ProjectType[] = [
  {
    id: 1,
    title: "Professional Coaching Practice",
    appName: "Coaching",
    appDescription: "850+ hours of professional coaching experience",
    appIcon: "/assets/app/coaching.jpg",
    projectImage: "/assets/projects/coaching-cicp-certification.jpg",
    tags: ["Coaching", "Leadership", "Development"],
    url: "https://thecoach.jp/meet/coach/soichiro-yoshimura/",
    status: "live",
    bgColor: "bg-[#4A90E2]",
  },
  {
    id: 2,
    title: "Lovegraph Growth & Scale",
    appName: "Lovegraph",
    appDescription: "1000+ photographers platform & 300% YoY growth",
    appIcon: "/assets/app/lovegraph.jpg",
    projectImage: "/assets/projects/lovegraph-growth-scale.jpg",
    tags: ["Product Management", "Growth", "Platform"],
    url: "https://careerhack.en-japan.com/report/detail/939",
    status: "live",
    bgColor: "bg-[#FF6B9D]",
  },
  {
    id: 3,
    title: "LINE Profile+ Launch",
    appName: "LINE",
    appDescription: "iOS product development & user authentication",
    appIcon: "/assets/app/line.jpg",
    projectImage: "/assets/projects/line-profile-plus.jpg",
    tags: ["iOS", "Product Management", "Security"],
    url: "https://developers.line.biz/ja/docs/partner-docs/line-profile-plus/",
    status: "live",
    bgColor: "bg-[#00B900]",
  },
];
