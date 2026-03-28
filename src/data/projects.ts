export type ProjectType = "film" | "doc";

export interface MediaItem {
  type: "image" | "video";
  gradient: string;
  caption?: string;
}

export interface Project {
  slug: string;
  title: string;
  director: string;
  year: number;
  type: ProjectType;
  synopsis: string;
  gradient: string;
  accentColor: string;
  image: string;
  media: MediaItem[];
}

export const projects: Project[] = [
  {
    slug: "ombre-sul-tevere",
    title: "Ombre sul Tevere",
    director: "Giulia Ferretti",
    year: 2025,
    type: "film",
    synopsis:
      "A nocturnal journey through Rome's hidden waterways, where three strangers converge on a single night that will change their lives forever.",
    gradient: "linear-gradient(135deg, #1a1a0e 0%, #1e2a20 50%, #2a3828 100%)",
    accentColor: "#2a3828",
    image: "/images/ombre-sul-tevere.jpg",
    media: [
      { type: "image", gradient: "linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)", caption: "The Tiber at night" },
      { type: "video", gradient: "linear-gradient(135deg, #0d1926 0%, #162d4a 100%)", caption: "Official Trailer" },
      { type: "image", gradient: "linear-gradient(160deg, #16213e 0%, #1a2744 100%)", caption: "Ponte Sisto" },
      { type: "image", gradient: "linear-gradient(180deg, #0f1a2e 0%, #1a3050 100%)", caption: "The three strangers" },
      { type: "image", gradient: "linear-gradient(120deg, #1a1a3e 0%, #0a2040 100%)", caption: "Dawn over Trastevere" },
    ],
  },
  {
    slug: "la-quinta-stagione",
    title: "La Quinta Stagione",
    director: "Marco Bianchi",
    year: 2024,
    type: "film",
    synopsis:
      "In a small Sicilian village, time seems to stand still — until a mysterious stranger arrives and disrupts the fragile equilibrium.",
    gradient: "linear-gradient(135deg, #0e1a1a 0%, #152825 50%, #1a3530 100%)",
    accentColor: "#1a3530",
    image: "/images/la-quinta-stagione.jpg",
    media: [
      { type: "video", gradient: "linear-gradient(135deg, #2d1b2e 0%, #6b2d5b 100%)", caption: "Official Trailer" },
      { type: "image", gradient: "linear-gradient(160deg, #3a1a3a 0%, #5a2850 100%)", caption: "The village square" },
      { type: "image", gradient: "linear-gradient(180deg, #2d1b30 0%, #4a2040 100%)", caption: "The stranger arrives" },
      { type: "image", gradient: "linear-gradient(120deg, #3d2040 0%, #5a1a50 100%)", caption: "Market scene" },
    ],
  },
  {
    slug: "vetro",
    title: "Vetro",
    director: "Alessia Conti",
    year: 2025,
    type: "film",
    synopsis:
      "A glassblower on the island of Murano faces an impossible choice between tradition and survival in the modern world.",
    gradient: "linear-gradient(135deg, #0d0e1a 0%, #1a1525 50%, #251a2a 100%)",
    accentColor: "#1a1525",
    image: "/images/vetro.jpg",
    media: [
      { type: "image", gradient: "linear-gradient(135deg, #0d1b2a 0%, #2a3f54 100%)", caption: "The furnace" },
      { type: "image", gradient: "linear-gradient(160deg, #1a2838 0%, #2a4054 100%)", caption: "Murano at dawn" },
      { type: "video", gradient: "linear-gradient(180deg, #0d2030 0%, #1b3848 100%)", caption: "Behind the scenes" },
      { type: "image", gradient: "linear-gradient(120deg, #152535 0%, #253f55 100%)", caption: "The final piece" },
      { type: "image", gradient: "linear-gradient(135deg, #0a1520 0%, #1a2a3a 100%)", caption: "Lagoon reflections" },
    ],
  },
  {
    slug: "il-peso-della-luce",
    title: "Il Peso della Luce",
    director: "Lorenzo Vitale",
    year: 2024,
    type: "film",
    synopsis:
      "Two estranged siblings reunite in their childhood home in Puglia, forced to reckon with memories they spent decades avoiding.",
    gradient: "linear-gradient(135deg, #0e1a16 0%, #152520 50%, #1a2e28 100%)",
    accentColor: "#152520",
    image: "/images/il-peso-della-luce.jpg",
    media: [
      { type: "image", gradient: "linear-gradient(135deg, #1a1a1a 0%, #404040 100%)", caption: "The family home" },
      { type: "video", gradient: "linear-gradient(160deg, #222222 0%, #3a3a3a 100%)", caption: "Official Trailer" },
      { type: "image", gradient: "linear-gradient(180deg, #1a1a1a 0%, #333333 100%)", caption: "The olive grove" },
      { type: "image", gradient: "linear-gradient(120deg, #252525 0%, #454545 100%)", caption: "Reunion" },
    ],
  },
  {
    slug: "terra-madre",
    title: "Terra Madre",
    director: "Sofia Marchetti",
    year: 2025,
    type: "doc",
    synopsis:
      "An intimate portrait of three generations of women farmers in Tuscany, fighting to preserve ancestral land against industrial expansion.",
    gradient: "linear-gradient(135deg, #0e1518 0%, #15202a 50%, #1a2830 100%)",
    accentColor: "#15202a",
    image: "/images/terra-madre.jpg",
    media: [
      { type: "image", gradient: "linear-gradient(135deg, #1a2e1a 0%, #3d6b3d 100%)", caption: "The Tuscan hills" },
      { type: "video", gradient: "linear-gradient(160deg, #1a301a 0%, #2e5a2e 100%)", caption: "Official Trailer" },
      { type: "image", gradient: "linear-gradient(180deg, #1a2a1a 0%, #2e4a30 100%)", caption: "Three generations" },
      { type: "image", gradient: "linear-gradient(120deg, #203020 0%, #3a5a3a 100%)", caption: "Harvest season" },
    ],
  },
  {
    slug: "frequenze",
    title: "Frequenze",
    director: "Davide Romano",
    year: 2024,
    type: "doc",
    synopsis:
      "Underground radio operators in Naples use forgotten frequencies to broadcast stories that the mainstream media won't tell.",
    gradient: "linear-gradient(135deg, #1a150e 0%, #2a2018 50%, #352a1a 100%)",
    accentColor: "#2a2018",
    image: "/images/frequenze.jpg",
    media: [
      { type: "video", gradient: "linear-gradient(135deg, #2e1a1a 0%, #6b2d2d 100%)", caption: "Official Trailer" },
      { type: "image", gradient: "linear-gradient(160deg, #3a1a1a 0%, #5a2828 100%)", caption: "The radio station" },
      { type: "image", gradient: "linear-gradient(180deg, #2e1a1a 0%, #4a2828 100%)", caption: "Naples underground" },
      { type: "image", gradient: "linear-gradient(120deg, #351a1a 0%, #552020 100%)", caption: "The operators" },
    ],
  },
];

export const films = projects.filter((p) => p.type === "film");
export const docs = projects.filter((p) => p.type === "doc");

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
