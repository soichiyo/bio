import { certifications } from "./credentials";
import { myFamily } from "./family";
export const aiProfile = {
  handle: "@soichiyo",
  description: "Product Manager, Professional Coach, Photographer, DJ, Father or SOMETHING.",
  coachingHours: "850+",
  coachingImage: "/assets/projects/coaching-cicp-certification.jpg",
};
// The three existing credentials with public evidence, as selected in the approved mock.
export const coachingCredentials = certifications.filter(item => item.proof);
export const profileFamily = ["Oharu", "Minato", "Koppe", "Muu", "Kolon"].map(name => myFamily.find(item => item.label.text === name)!);
