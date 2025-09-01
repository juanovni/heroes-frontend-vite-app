import { BASE_URL, heroApi } from "../api/hero.api";
import type { Hero } from "../types/hero.interface";

interface Options {
  name?: string;
  team?: string;
  category?: string;
  strength?: string;
}

export const searchHeroesAction = async (options: Options = {}) => {
  const { name, team, category, strength } = options;

  if (!name && !team && !category && !strength) {
    return [];
  }

  const { data } = await heroApi.get<Hero[]>(`/search`, {
    params: {
      name: name,
      team: team,
      category: category,
      strength: strength,
    },
  });

  return data.map((hero) => ({
    ...hero,
    image: `${BASE_URL}/images/${hero.image}`,
  }));
};
