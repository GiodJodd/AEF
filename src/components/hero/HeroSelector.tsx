"use client";

import HeroBlurMorph from "./HeroBlurMorph";
import type { Film } from "@/lib/film";

export default function HeroSelector({ films }: { films: Film[] }) {
  return <HeroBlurMorph films={films} />;
}
