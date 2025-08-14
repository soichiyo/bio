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

// 画像パス（Next.jsのpublicフォルダ）
const profileAvatar = "/assets/profile-avatar.png";

// --- データ本体 ---

export const profileData: ProfileDataType = {
  name: "Soichiro Yoshimura",
  avatar: profileAvatar,
  jobTitle: "Business Manager, Studio Prairie",
  location: "Based in Tokyo, JP",
  description: "Product Manager, Photographer, DJ, Father or SOMETHING.",
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
  ],
};

export const workExperiences: WorkExperienceType[] = [
  {
    period: "2024 - Present",
    title: "AI-UX Designer & Engineer at",
    companies: [
      {
        name: "Studio",
        icon: "/assets/company/studio-alt.png",
        style: "bg-gray-100 text-gray-800 border-gray-300/50",
      },
      {
        name: "Humade.ai",
        icon: "/assets/company/humade.png",
        style: "bg-purple-100 text-purple-700 border-purple-300/50",
      },
    ],
  },
  // ... 他の職歴データ
];

export const projects: ProjectType[] = [
  {
    id: 1,
    title: "AI時代の新しいWeb制作体験のR&D",
    appName: "Studio",
    appDescription: "ノーコードWeb制作ツール",
    appIcon: "/assets/app/airtoon.png",
    projectImage: "/assets/projects/airtoon.png",
    tags: ["AI", "Product Design", "Engineering"],
    url: "https://studio.design/",
    status: "live",
    bgColor: "bg-[#222222]",
  },
  // ... 他のプロジェクトデータ
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
];

export const skills: SkillType[] = [
  {
    text: "React",
    icon: "/assets/skills/react.svg",
    style:
      "bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300 border-sky-300/50",
  },
  {
    text: "TypeScript",
    icon: "/assets/skills/typescript.svg",
    style:
      "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-blue-300/50",
  },
  { text: "Next.js", icon: "/assets/skills/nextjs.svg" }, // デフォルトスタイルが適用される
  {
    text: "Figma",
    icon: "/assets/skills/figma.svg",
    style:
      "bg-pink-100 dark:bg-pink-900/50 text-pink-700 dark:text-pink-300 border-pink-300/50",
  },
  {
    text: "Tailwind CSS",
    icon: "/assets/skills/tailwind.svg",
    style:
      "bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 border-teal-300/50",
  },
  { text: "Product Design" }, // アイコンなしの例
  { text: "MVP Development" },
];

// [新規] 趣味 (Hobbies) データの追加
export const hobbies: SkillType[] = [
  { text: "Photography", icon: "📷" },
  { text: "Traveling", icon: "✈️" },
  { text: "Coffee", icon: "☕" },
  {
    text: "Music",
    icon: "🎵",
    style:
      "bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 border-green-300/50",
  },
  { text: "Sauna", icon: "♨️" },
];

// [新規] 資格 (Certifications) データの追加
export const certifications: CredentialType[] = [
  { title: "色彩検定UC級", issuer: "色彩検定協会", year: 2023 },
  {
    title: "Webクリエイター能力認定試験",
    issuer: "サーティファイ",
    year: 2022,
  },
];

// [新規] 学歴 (Education) データの追加
export const education: CredentialType[] = [
  {
    title: "デジタルハリウッドSTUDIO by LIG",
    issuer: "Webデザイン",
    year: 2022,
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
