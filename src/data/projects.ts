export type ProjectFormat = "feature" | "documentary" | "short" | "development";

export interface MediaItem {
  type: "image" | "video";
  gradient: string;
  caption?: string;
}

export interface Project {
  slug: string;
  title: string;
  format: ProjectFormat;
  formatLabel: string;
  directors: string[];
  producers: string[];
  executiveProducers?: string[];
  partners?: string[];
  synopsis: string;
  gradient: string;
  accentColor: string;
  media?: MediaItem[];
}

export const projects: Project[] = [
  {
    slug: "cuirdange",
    title: "CUIRDANGE",
    format: "feature",
    formatLabel: "Feature Film",
    directors: ["Riccardo Rizzi"],
    producers: ["Matteo Severini", "Riccardo Rizzi", "Thomas Piette"],
    synopsis:
      "Set against the blistering heat of Rome, this debut feature by director Riccardo Rizzi is drawn from a true story originating from a personal confession and brought to the screen by its real-life protagonists, who portray themselves.\n\nSimone, a struggling young actor drifting between auditions, and Karen, an aging American archaeologist worn down by solitude, meet on a restless night. What begins as a raw, physical connection soon evolves into something far more unexpected.\n\nAs desire gives way to vulnerability, two lives shaped by distance, time, and disillusion begin to converge. In a city layered with history and decay, their relationship becomes an intimate excavation, uncovering the fragile, often uncomfortable truth that even the most unlikely encounters can lead to healing.",
    gradient:
      "linear-gradient(135deg, #2a1a10 0%, #4a2a1a 40%, #6b3520 70%, #8a4530 100%)",
    accentColor: "#6b3520",
    media: [
      { type: "image", gradient: "linear-gradient(135deg, #2a1a10 0%, #6b3520 100%)" },
      { type: "image", gradient: "linear-gradient(160deg, #1f1410 0%, #5a2e1c 100%)" },
      { type: "image", gradient: "linear-gradient(180deg, #2a1a10 0%, #7a3a25 100%)" },
    ],
  },
  {
    slug: "jail-time-records",
    title: "JAIL TIME RECORDS",
    format: "documentary",
    formatLabel: "Feature Documentary",
    directors: ["Dione Roach", "Steve Happi"],
    producers: [
      "Dione Roach",
      "Steve Happi",
      "Giacomo Stucchi-Prinetti",
      "Tabs Breese",
    ],
    executiveProducers: [
      "Taika Waititi",
      "Rita Ora",
      "Garrett Basch",
      "Caitlin Alba-Rothstein",
      "Gillian Brown",
    ],
    partners: ["Jail Time Production", "AEF productions"],
    synopsis:
      "Jail Time Records is a documentary musical that follows recording artists emerging from one of the world's toughest settings. Inside the crammed alleyways of the Central Prison of Douala in Cameroon, the film immerses itself in the lives of the inmates-turned-artists that make up Jail Time Records, the first recording studio in an African prison.",
    gradient:
      "linear-gradient(135deg, #1a0808 0%, #3a0f0f 40%, #5a1818 70%, #7a2818 100%)",
    accentColor: "#5a1818",
    media: [
      { type: "image", gradient: "linear-gradient(135deg, #1a0808 0%, #5a1818 100%)" },
      { type: "image", gradient: "linear-gradient(160deg, #200a0a 0%, #6b1f18 100%)" },
      { type: "image", gradient: "linear-gradient(180deg, #1a0808 0%, #4a1818 100%)" },
    ],
  },
  {
    slug: "la-tempesta",
    title: "LA TEMPESTA",
    format: "short",
    formatLabel: "Short Fiction",
    directors: ["Riccardo Rizzi"],
    producers: ["Matteo Severini", "Riccardo Rizzi"],
    partners: ["Blau!"],
    synopsis:
      "Simone and Valerio hide out in a field to spend some time together. At the same time, a farmer finishes to work in a nearby vineyard and heads home. A storm is looming: the lives of the three, albeit seemingly poles apart, seem to have something in common. Inspired by the painting \"The Tempest\" by Giorgione.",
    gradient:
      "linear-gradient(135deg, #0f1525 0%, #1f2540 50%, #2f1f4a 100%)",
    accentColor: "#1f2540",
    media: [
      { type: "image", gradient: "linear-gradient(135deg, #0f1525 0%, #2f1f4a 100%)" },
      { type: "image", gradient: "linear-gradient(160deg, #15182a 0%, #251f3a 100%)" },
    ],
  },
  {
    slug: "noia",
    title: "NOIA",
    format: "short",
    formatLabel: "Short Fiction",
    directors: ["Francesco Branca"],
    producers: ["Francesco Branca", "Matteo Severini"],
    partners: ["IED production"],
    synopsis:
      "Early April 2020. A virus has brought the world to a standstill, leaving thousands dead. In Italy, a total lockdown is in place: leaving home is forbidden, except for essential needs.\n\nIn the middle of the night, three friends break the rules and venture out into a city emptied of life, suspended in an eerie stillness. Deserted streets, unnatural silence, and cold lights become the reflection of something deeper—lives frozen in place, trapped in a time that no longer seems to move.\n\nTheir journey unfolds as an existential drift, a quiet confrontation with emptiness—both around them and within.",
    gradient:
      "linear-gradient(135deg, #0a1218 0%, #15252e 50%, #1f3845 100%)",
    accentColor: "#15252e",
    media: [
      { type: "image", gradient: "linear-gradient(135deg, #0a1218 0%, #1f3845 100%)" },
      { type: "image", gradient: "linear-gradient(160deg, #0e1820 0%, #1a3038 100%)" },
    ],
  },
  {
    slug: "maree",
    title: "MAREE",
    format: "short",
    formatLabel: "Short Fiction",
    directors: ["Asia Maria Sbrugnera"],
    producers: ["Matteo Severini"],
    synopsis:
      "Maree is the intimate portrait of Carla, a young woman marked by deep depression following her partner's abandonment, which also cost her custody of her daughter Beatrice — raised by her sister Alba.\n\nTrying to rebuild her life, Carla clings to a new job and a therapeutic journey that brings her back each week to a beach tied to a traumatic memory: a fire that destroyed a house and permanently fractured her family. Behind that tragedy lies a secret Carla chooses to keep silent, taking on blame that isn't hers.\n\nBetween guilt and the desire for redemption, her slow re-emergence intertwines with the fragile possibility of rebuilding a bond with her daughter. A visceral story about motherhood, guilt, and the possibility of rebirth.",
    gradient:
      "linear-gradient(135deg, #1a2025 0%, #2a3a3f 50%, #3a4a4f 100%)",
    accentColor: "#2a3a3f",
    media: [
      { type: "image", gradient: "linear-gradient(135deg, #1a2025 0%, #3a4a4f 100%)" },
      { type: "image", gradient: "linear-gradient(160deg, #1f2a2f 0%, #354548 100%)" },
    ],
  },
  {
    slug: "kiss-of-an-angel",
    title: "KISS OF AN ANGEL",
    format: "short",
    formatLabel: "Short Film",
    directors: ["Lone Widahl Madsen"],
    producers: ["Matteo Severini"],
    partners: ["A.E.F. productions"],
    synopsis:
      "The modern-day fairytale short film \"Kiss of An Angel\" draws inspiration from Nordic landscapes, ancient myth, and timeless bygone fairytales. Rooted in a distinctly Scandinavian sensibility, the film seeks to evoke an ethereal and magical atmosphere shaped by an intimate dialogue between light and darkness — an interplay that reflects both the natural world and the inner human experience.\n\nThrough music, movement, and elemental imagery, it portrays nature as both formidable and sacred — a force that demands respect yet offers profound healing.\n\n\"Kiss of an Angel\" is to be screened as part of British Art Fair 2026 at the Saatchi Gallery, London.",
    gradient:
      "linear-gradient(135deg, #1a2530 0%, #2f4555 50%, #4a5f70 100%)",
    accentColor: "#2f4555",
    media: [
      { type: "image", gradient: "linear-gradient(135deg, #1a2530 0%, #4a5f70 100%)" },
      { type: "image", gradient: "linear-gradient(160deg, #202d3a 0%, #4a6075 100%)" },
    ],
  },
  {
    slug: "pine-tree",
    title: "PINE TREE",
    format: "development",
    formatLabel: "Feature Film — In Development",
    directors: ["Matteo Severini"],
    producers: ["Riccardo Rizzi", "Thomas Piette", "Matteo Severini"],
    synopsis:
      "A mysterious event in the past sets in motion a dark force tied to an ancient secret.\n\nIn the present day, a young woman moves to the city seeking a fresh start. She becomes involved with a group of friends whose carefree choices lead them to a strange discovery. After performing a ritual, they unknowingly awaken a supernatural presence.\n\nDisturbing visions and paranoia begin to consume them. In search of answers, they venture into an unfamiliar and ominous place. There, reality shifts and they find themselves trapped in a hostile environment. As fear grows, the group begins to fall apart under pressure.\n\nThis encounter leaves a lasting impact, blurring the line between nightmare and reality.",
    gradient:
      "linear-gradient(135deg, #0a1410 0%, #15251a 40%, #1f3525 70%, #2a1818 100%)",
    accentColor: "#1f3525",
    media: [
      { type: "image", gradient: "linear-gradient(135deg, #0a1410 0%, #2a1818 100%)" },
      { type: "image", gradient: "linear-gradient(160deg, #0e1814 0%, #1f3525 100%)" },
    ],
  },
];

export const FORMAT_FILTERS: { value: ProjectFormat | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "feature", label: "Features" },
  { value: "documentary", label: "Documentaries" },
  { value: "short", label: "Shorts" },
  { value: "development", label: "Development" },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
