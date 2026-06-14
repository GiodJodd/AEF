"use client";

import { createContext, useContext, useState, useCallback } from "react";

interface HeroColorState {
  gradient: string;
  accentColor: string;
  title: string;
}

interface HeroColorContextType {
  heroColor: HeroColorState;
  setHeroColor: (color: HeroColorState) => void;
}

const defaultState: HeroColorState = {
  gradient: "",
  accentColor: "",
  title: "",
};

const HeroColorContext = createContext<HeroColorContextType>({
  heroColor: defaultState,
  setHeroColor: () => {},
});

export function HeroColorProvider({ children }: { children: React.ReactNode }) {
  const [heroColor, setHeroColorState] = useState<HeroColorState>(defaultState);

  const setHeroColor = useCallback((color: HeroColorState) => {
    setHeroColorState(color);
  }, []);

  return (
    <HeroColorContext.Provider value={{ heroColor, setHeroColor }}>
      {children}
    </HeroColorContext.Provider>
  );
}

export function useHeroColor() {
  return useContext(HeroColorContext);
}
