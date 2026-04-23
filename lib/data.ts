// --- 型定義 ---

export type SocialLink = {
  name: string;
  url: string;
  icon: string;
};

export type ProfileDataType = {
  name: string;
  avatar: string;
  jobTitle: string;
  location: string;
  description: string;
  email: string;
  socialLinks: SocialLink[];
};

export type WorkExperienceType = {
  period: string;
  title: string;
  companies: {
    name: string;
    icon: string;
    style: string;
  }[];
};

export type ProjectType = {
  id: number;
  title: string;
  appName: string;
  appDescription: string;
  appIcon: string;
  projectImage?: string;
  emojis?: string[];
  tags: string[];
  url: string;
  status: "live" | "wip";
  bgColor: string;
};

export type SimpleCardType = {
  id: number;
  image: string;
  label: {
    emoji: string;
    text: string;
  };
};
export type SkillType = {
  text: string;
  icon?: string;
  style?: string;
};

// [新規] 資格・学歴用の型定義
export type CredentialType = {
  title: string;
  issuer: string;
  year: number;
};

// [新規] フォトギャラリー用の型定義
export type PhotoType = {
  src: string;
  width: number; // ライトボックスでの表示に必要
  height: number; // ライトボックスでの表示に必要
  alt: string;
};

// [新規] パーソナル特性用の型定義
export type PersonalCharacteristicType = {
  title: string;
  description: string;
  icon?: string;
};

export type WritingType = {
  title: string;
  url: string;
  platform: "zenn" | "note";
  date: string;
};

// 画像パス（Next.jsのpublicフォルダ）
const profileAvatar = "/assets/profile-avatar.png";

// --- データ本体 ---

export const profileData: ProfileDataType = {
  name: "Soichiro Yoshimura",
  avatar: profileAvatar,
  jobTitle: "2C Business Responsibility, Studio Prairie",
  location: "Machida, Tokyo, JP",
  description:
    "Product Manager, Professional Coach, Photographer, DJ, Father or SOMETHING.",
  email: "soichiro0111@gmail.com",
  socialLinks: [
    {
      name: "X",
      url: "https://x.com/soichi_yo",
      icon: "Twitter",
    },
    {
      name: "Facebook",
      url: "https://www.facebook.com/soichiyo",
      icon: "Facebook",
    },
    {
      name: "Instagram",
      url: "https://instagram.com/soichiyo",
      icon: "Instagram",
    },
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/soichiyo",
      icon: "LinkedIn",
    },
    {
      name: "GitHub",
      url: "https://github.com/soichiyo",
      icon: "GitHub",
    },
    {
      name: "note",
      url: "https://note.com/soichiro",
      icon: "FileText",
    },
  ],
};

export const workExperiences: WorkExperienceType[] = [
  {
    period: "2024 - Present",
    title: "2C Business Responsibility at",
    companies: [
      {
        name: "Studio Prairie",
        icon: "/assets/company/studio-prairie.jpg",
        style: "bg-purple-100 text-purple-800 border-purple-300/50",
      },
    ],
  },
  {
    period: "2022 - 2023",
    title: "Director at",
    companies: [
      {
        name: "THE COACH Inc.",
        icon: "/assets/company/the-coach.jpg",
        style: "bg-blue-100 text-blue-800 border-blue-300/50",
      },
    ],
  },
  {
    period: "2017 - 2022",
    title: "CPO/CXO/Executive Officer at",
    companies: [
      {
        name: "Lovegraph Inc.",
        icon: "/assets/company/lovegraph.jpg",
        style: "bg-pink-100 text-pink-800 border-pink-300/50",
      },
    ],
  },
  {
    period: "2016 - 2017",
    title: "Global Account / Product Manager at",
    companies: [
      {
        name: "LINE Corporation",
        icon: "/assets/company/line.jpg",
        style: "bg-green-100 text-green-800 border-green-300/50",
      },
    ],
  },
];

export const writings: WritingType[] = [
  {
    title: "Claude Code設定の全体設計、個人的ベストプラクティス（2026年4月版）",
    url: "https://zenn.dev/soichiyo/articles/b2a0ba2814acf6",
    platform: "zenn",
    date: "2026-04",
  },
  {
    title: "AI-Native GTD を作ってみた — GTDに「誰がやる？」を足す実験",
    url: "https://zenn.dev/soichiyo/articles/45ca0fd1925d5d",
    platform: "zenn",
    date: "2026-04",
  },
  {
    title: "プレーリーカードの事業責任者になりました",
    url: "https://note.com/soichiro/n/n734668a8d936",
    platform: "note",
    date: "2024-07",
  },
];

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

// [ここからが不足していた部分です]
export const myFamily: SimpleCardType[] = [
  {
    id: 1,
    image: "/assets/photos/family/koppe.jpg",
    label: { emoji: "🐿️", text: "Koppe" },
  },
  {
    id: 2,
    image: "/assets/photos/family/muu.jpg",
    label: { emoji: "🐈", text: "Muu" },
  },
  {
    id: 3,
    image: "/assets/photos/family/kolon.jpg",
    label: { emoji: "🐈", text: "Kolon" },
  },
  {
    id: 4,
    image: "/assets/photos/family/minato.jpg",
    label: { emoji: "👶", text: "Minato" },
  },
  {
    id: 5,
    image: "/assets/photos/family/oharu.jpg",
    label: { emoji: "👩", text: "Oharu" },
  },
];

export const skills: SkillType[] = [
  {
    text: "Marketing",
    style:
      "bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 border-purple-300/50",
  },
  {
    text: "Product Management",
    style:
      "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-blue-300/50",
  },
  {
    text: "MySQL",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
    style:
      "bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300 border-orange-300/50",
  },
  {
    text: "Coaching",
    style:
      "bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 border-green-300/50",
  },
  {
    text: "React Native",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
    style:
      "bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300 border-sky-300/50",
  },
  {
    text: "Lightroom",
    style:
      "bg-cyan-100 dark:bg-cyan-900/50 text-cyan-700 dark:text-cyan-300 border-cyan-300/50",
  },
  {
    text: "Figma",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg",
    style:
      "bg-pink-100 dark:bg-pink-900/50 text-pink-700 dark:text-pink-300 border-pink-300/50",
  },
  {
    text: "TypeScript",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
    style:
      "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-blue-300/50",
  },
  {
    text: "Python",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
    style:
      "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300 border-yellow-300/50",
  },
];

// [新規] 専門分野 (Expertise) データの追加
export const expertise: SkillType[] = [
  {
    text: "2C Business Development",
    icon: "🚀",
    style:
      "bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 border-purple-300/50",
  },
  {
    text: "Integration Coaching (ICP™)",
    icon: "🎯",
    style:
      "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-blue-300/50",
  },
  {
    text: "Relationship Systems Coaching (ORSC)",
    icon: "👥",
    style:
      "bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 border-green-300/50",
  },
  {
    text: "Product Management & Strategy",
    icon: "📱",
    style:
      "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 border-indigo-300/50",
  },
  {
    text: "Couple & Family Dynamics",
    icon: "💑",
    style:
      "bg-pink-100 dark:bg-pink-900/50 text-pink-700 dark:text-pink-300 border-pink-300/50",
  },
  {
    text: "Leadership Development",
    icon: "⭐",
    style:
      "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300 border-yellow-300/50",
  },
  {
    text: "Well-being & Psychology",
    icon: "🧠",
    style:
      "bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 border-teal-300/50",
  },
  {
    text: "Photography",
    icon: "📷",
    style:
      "bg-gray-100 dark:bg-gray-900/50 text-gray-700 dark:text-gray-300 border-gray-300/50",
  },
  {
    text: "DJ/Music Production",
    icon: "🎵",
    style:
      "bg-cyan-100 dark:bg-cyan-900/50 text-cyan-700 dark:text-cyan-300 border-cyan-300/50",
  },
];

// [新規] 趣味 (Hobbies) データの追加
export const hobbies: SkillType[] = [
  {
    text: "ゲーム",
    icon: "🎮",
    style:
      "bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 border-purple-300/50",
  },
  {
    text: "占い",
    icon: "🔮",
    style:
      "bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300 border-violet-300/50",
  },
  {
    text: "カメラ",
    icon: "📷",
    style:
      "bg-gray-100 dark:bg-gray-900/50 text-gray-700 dark:text-gray-300 border-gray-300/50",
  },
  {
    text: "人生相談",
    icon: "💭",
    style:
      "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-blue-300/50",
  },
  {
    text: "お酒",
    icon: "🍺",
    style:
      "bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 border-amber-300/50",
  },
  {
    text: "シーシャ",
    icon: "💨",
    style:
      "bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 border-teal-300/50",
  },
  {
    text: "麻雀",
    icon: "🀄",
    style:
      "bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 border-red-300/50",
  },
  {
    text: "SUP",
    icon: "🏄",
    style:
      "bg-cyan-100 dark:bg-cyan-900/50 text-cyan-700 dark:text-cyan-300 border-cyan-300/50",
  },
  {
    text: "料理",
    icon: "🍳",
    style:
      "bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300 border-orange-300/50",
  },
  {
    text: "キャンプ",
    icon: "⛺",
    style:
      "bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 border-green-300/50",
  },
  {
    text: "ランニング",
    icon: "🏃",
    style:
      "bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300 border-sky-300/50",
  },
];

// [新規] 資格 (Certifications) データの追加
export const certifications: CredentialType[] = [
  {
    title: "Leadership Circle Profile Certification",
    issuer: "Leadership Circle",
    year: 2023,
  },
  {
    title: "THE COACH ICP™ Certified Integration Coaching Professional",
    issuer: "THE COACH Inc.",
    year: 2021,
  },
  {
    title: "ORSC (Organization and Relationship Systems Coach) Basics",
    issuer: "CRR Global",
    year: 2021,
  },
  {
    title: "Global Coaching Institute 101/102",
    issuer: "Global Coaching Institute",
    year: 2022,
  },
  {
    title: "The Science of Well-Being",
    issuer: "Yale University",
    year: 2021,
  },
];

// [新規] 学歴 (Education) データの追加
export const education: CredentialType[] = [
  {
    title: "Faculty of Business Administration",
    issuer: "Hosei University",
    year: 2016,
  },
];

// [新規] パーソナル特性 (Personal Characteristics) データの追加
export const personalCharacteristics: PersonalCharacteristicType[] = [
  {
    title: "MBTI: INFP",
    description: "内向型・直感型・感情型・知覚型",
    icon: "🧠",
  },
  {
    title: "Sensitive to Emotions",
    description: "人の感情に敏感で、相手の気持ちを察知することが得意",
    icon: "💭",
  },
  {
    title: "Introspective",
    description: "内省的で、自分自身と深く向き合うことを大切にしている",
    icon: "🔍",
  },
  {
    title: "Values Personal Growth",
    description: "個人の成長と自己実現を重視し、常に向上心を持っている",
    icon: "🌱",
  },
  {
    title: "Core Values Commitment",
    description: "自分の核となる価値観にコミットし、それに基づいて行動する",
    icon: "⭐",
  },
];

// [新規] フォトギャラリー (Photo Gallery) データの追加
export const photoGallery: PhotoType[] = [
  {
    src: "/assets/photos/photo_01.jpg",
    width: 800,
    height: 1200,
    alt: "Description of photo 1",
  },
  {
    src: "/assets/photos/photo_02.jpg",
    width: 1200,
    height: 800,
    alt: "Description of photo 2",
  },
  {
    src: "/assets/photos/photo_03.jpg",
    width: 800,
    height: 1000,
    alt: "Description of photo 3",
  },
];
