import type { SkillType, PersonalCharacteristicType } from './types';



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
