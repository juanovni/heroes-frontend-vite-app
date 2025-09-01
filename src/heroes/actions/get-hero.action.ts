import { BASE_URL, heroApi } from "../api/hero.api";
import type { Hero } from "../types/hero.interface";

export const getHeroAction = async (idSlug: string): Promise<Hero> => {
  const { data } = await heroApi.get<Hero>(`/${idSlug}`);

  return { ...data, image: `${BASE_URL}/images/${data.image}` };
};
