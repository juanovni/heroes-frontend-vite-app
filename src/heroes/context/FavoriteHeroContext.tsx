import {
  createContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import * as z from "zod";
import type { Hero } from "../types/hero.interface";

interface FavoriteHeroStateContext {
  // State
  favorites: Hero[];
  favoriteCount: number;
  // Methods
  isFavorite: (hero: Hero) => boolean;
  toogleFavorite: (hero: Hero) => void;
}

const HeroSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  alias: z.string(),
  powers: z.array(z.string()),
  description: z.string(),
  strength: z.number(),
  intelligence: z.number(),
  speed: z.number(),
  durability: z.number(),
  team: z.string(),
  image: z.string(),
  firstAppearance: z.string(),
  status: z.string(),
  category: z.string(),
  universe: z.string(),
});
// Schema para favoritos
const FavoriteHeroSchema = z.array(HeroSchema);

export const FavoriteHeroContext = createContext({} as FavoriteHeroStateContext);

const getFavoritesFromLocalStorage = (): Hero[] => {
  const localStorageState = localStorage.getItem("favorites");
  if (!localStorageState) {
    return [];
  }
  try {
    const parsed = JSON.parse(localStorageState);
    const result = FavoriteHeroSchema.safeParse(parsed);
    if (!result.success) {
      console.error("Error validando favoritos:", result.error);
      return [];
    }

    return result.data;
  } catch (error) {
    console.error("Error parseando favoritos:", error);
    return [];
  }
};

const FavoriteHeroContextProvider = ({ children }: PropsWithChildren) => {
  const [favorites, setFavorites] = useState<Hero[]>(
    getFavoritesFromLocalStorage()
  );
  const isFavorite = (hero: Hero) => favorites.some((h) => h.id == hero.id); // Some devuelve true o false si es que encuenra
  const handleToodleFavorites = (hero: Hero) => {
    const heroExist = favorites.find((h) => h.id === hero.id);
    if (heroExist) {
      const newFavorites = favorites.filter((h) => h.id !== hero.id);
      setFavorites(newFavorites);
      return;
    }
    setFavorites([...favorites, hero]);
  };

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  return (
    <FavoriteHeroContext
      value={{
        //States
        favorites,
        favoriteCount: favorites.length,
        //Methods
        isFavorite,
        toogleFavorite: handleToodleFavorites,
      }}
    >
      {children}
    </FavoriteHeroContext>
  );
};

export default FavoriteHeroContextProvider;
