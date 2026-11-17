import type { ProfileDataType } from './types';



// 画像パス（Next.jsのpublicフォルダ）
const profileAvatar = "/assets/profile-avatar.jpg";



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
