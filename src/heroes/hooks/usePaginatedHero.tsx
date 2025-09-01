import { useQuery } from "@tanstack/react-query";
import { getHeroesByPageAction } from "../actions/get-heroes-by-page.action";

export const usePaginatedHero = (
  page: number,
  limit: number,
  category: string = "all"
) => {
  return useQuery({
    // queryKey: ["heroes", "pages", page], // Key para mantener en cache la peticion cuando no son posicionales un solo valor
    queryKey: ["heroes", { page, limit, category }], // Key posicional
    queryFn: () => getHeroesByPageAction(+page, +limit, category),
    staleTime: 1000 * 60 * 5, // 5 minutos: Tiempo de la data fresca tipo cache
  });
};
