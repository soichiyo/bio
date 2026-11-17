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
  proof?: {
    label: "Badge" | "Certificate";
    url: string;
  };
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
