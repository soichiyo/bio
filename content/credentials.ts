import type { CredentialType } from './types';



// [新規] 資格 (Certifications) データの追加
export const certifications: CredentialType[] = [
  {
    title: "Leadership Circle Profile Certification",
    issuer: "Leadership Circle",
    year: 2023,
    proof: {
      label: "Certificate",
      url: "https://drive.google.com/file/d/1rBPsY9MNQatHZivVHXoMJ2acTqHHnGJh/view",
    },
  },
  {
    title: "THE COACH ICP™ Certified Integration Coaching Professional",
    issuer: "THE COACH Inc.",
    year: 2021,
    proof: {
      label: "Badge",
      url: "https://www.credly.com/badges/a07a164a-8088-4437-9f34-187c8820be5f?source=linked_in_profile",
    },
  },
  {
    title: "ORSC (Organization and Relationship Systems Coach) Basics",
    issuer: "CRR Global",
    year: 2021,
    proof: {
      label: "Certificate",
      url: "https://drive.google.com/file/d/1sJH0Pne_hRMPp3yfOHAdI0W0yo2VV6DW/view?usp=drive_link",
    },
  },
  {
    title: "Global Coaching Institute 101/102",
    issuer: "Global Coaching Institute",
    year: 2022,
  },
];



// [新規] 学歴 (Education) データの追加
export const education: CredentialType[] = [
  {
    title: "The Science of Well-Being",
    issuer: "Yale University",
    year: 2021,
    proof: {
      label: "Certificate",
      url: "https://www.coursera.org/account/accomplishments/certificate/LGZKRVHPUZEROR",
    },
  },
  {
    title: "Faculty of Business Administration",
    issuer: "Hosei University",
    year: 2016,
  },
];
