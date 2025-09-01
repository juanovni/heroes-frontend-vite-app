import { useQuery } from "@tanstack/react-query";
import { CustomJumbotron } from "@/components/custom/CustomJumbotron";
import { HeroStats } from "@/heroes/components/HeroStats";
import { SearchController } from "./ui/SearchController";
import { CustomBreadcrumbs } from "@/components/custom/CustomBreadcrumbs";
import { searchHeroesAction } from "@/heroes/actions/search-heros.action";
import { HeroGrid } from "@/heroes/components/HeroGrid";
import { useSearchParams } from "react-router";

export const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const name = searchParams.get("name") ?? undefined;
  const strength = searchParams.get("strength") ?? undefined;

  /* const team = searchParams.get("team") ?? undefined;
  const category = searchParams.get("category") ?? undefined; */

  const { data: heroes = [] } = useQuery({
    queryKey: ["search-heroes", { name, strength }],
    queryFn: () => searchHeroesAction({ name, strength }),
    //staleTime: 1000 * 60 * 5, // 5 minutos cache
  });

  return (
    <>
      <CustomJumbotron
        title="Busqueda de SuperHeroes"
        description="Descubre, explora y administra super heroes y villanos"
      />

      <CustomBreadcrumbs
        currentPage="Buscador de Super Herores"
        /*  breadcrumbs={[{ label: "Home1", to: "/" }]} */
      />

      {/* Stats Dashboard */}
      <HeroStats />

      {/* Filter and search */}
      <SearchController />

      <HeroGrid heroes={heroes ?? []} />
    </>
  );
};

export default SearchPage;
