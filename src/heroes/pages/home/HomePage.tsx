import { use, useMemo } from "react";
import { useSearchParams } from "react-router";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CustomJumbotron } from "@/components/custom/CustomJumbotron";
import { HeroStats } from "@/heroes/components/HeroStats";
import { HeroGrid } from "@/heroes/components/HeroGrid";
import { CustomPagination } from "@/components/custom/CustomPagination";
import { CustomBreadcrumbs } from "@/components/custom/CustomBreadcrumbs";
import { useHeroSummary } from "@/heroes/hooks/useHeroSummary";
import { usePaginatedHero } from "@/heroes/hooks/usePaginatedHero";
import { FavoriteHeroContext } from "@/heroes/context/FavoriteHeroContext";

export const HomePage = () => {
  /* const [activeTab, setActiveTab] = useState<
    "all" | "favorites" | "heroes" | "villains"
  >("all"); */
  const { favoriteCount, favorites } = use(FavoriteHeroContext);

  // USANDO EL useQuery para obtener los url como parametros
  let [searchParams, setSearchParams] = useSearchParams();
  // Ejemplo para buscar por el name del parametro de la url
  //console.log(searchParams.get("tab"));
  const activeTab = searchParams.get("tab") ?? "all";
  const page = searchParams.get("page") ?? "1";
  const limit = searchParams.get("limit") ?? "6";
  const category = searchParams.get("category") ?? "all";

  // Hacemos uso del useMemo para memorizar cambios solo si cambia el tab por el search
  const selectedTab = useMemo(() => {
    const activeTabs = ["all", "favorites", "heroes", "villains"];
    return activeTabs.includes(activeTab) ? activeTab : "all";
  }, [activeTab]);

  /* const { data: heroResponse } = useQuery({
    // queryKey: ["heroes", "pages", page], // Key para mantener en cache la peticion cuando no son posicionales un solo valor
    queryKey: ["heroes", { activeTab, page, limit }], // Key posicional
    queryFn: () => getHeroesByPageAction(selectedTab, +page, +limit),
    staleTime: 1000 * 60 * 5, // 5 minutos: Tiempo de la data fresca tipo cache
  }); */
  const { data: heroResponse } = usePaginatedHero(+page, +limit, category);

  // 1.1 Si ya hay dos peticiones mismo query deberia crearse un custom hook
  /* const { data: summary } = useQuery({
    queryKey: ["summary-information"],
    queryFn: getSummaryAction,
    staleTime: 1000 * 60 * 5, // 5 minutos
  }); */
  // 1.2 custom hook
  const { data: summary } = useHeroSummary();

  /* console.log({ heroResponse }); */
  // TRADICIONAL NO RECOMENDADO
  /* useEffect(() => {
    getHeroesByPageAction();
  }, []); */

  return (
    <>
      <>
        {/* Header */}
        <CustomJumbotron
          title="Universo de SuperHeroes"
          description="Descubre, explora y administra super heroes y villanos"
        />
        <CustomBreadcrumbs currentPage="Super Herores" />

        {/* Stats Dashboard */}
        <HeroStats />

        {/* Tabs */}
        <Tabs value={selectedTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger
              value="all"
              //onClick={() => setSearchParams("?tab=all")} si lo mantenemos asi se pierde el valor anterior una mejor forma con el prev
              // Asi mantenemos valores anteriores y seguimos concatenando
              onClick={() =>
                setSearchParams((prev) => {
                  prev.set("tab", "all");
                  prev.set("category", "all");
                  prev.set("page", "1");
                  return prev;
                })
              }
            >
              All Characters ({summary?.totalHeroes})
            </TabsTrigger>
            <TabsTrigger
              value="favorites"
              className="flex items-center gap-2"
              //onClick={() => setSearchParams("?tab=favorites")}
              onClick={() =>
                setSearchParams((prev) => {
                  prev.set("tab", "favorites");
                  return prev;
                })
              }
            >
              Favorites ({favoriteCount})
            </TabsTrigger>
            <TabsTrigger
              value="heroes"
              //onClick={() => setSearchParams("?tab=heroes")}
              onClick={() =>
                setSearchParams((prev) => {
                  prev.set("tab", "heroes");
                  prev.set("category", "hero");
                  prev.set("page", "1");

                  return prev;
                })
              }
            >
              Heroes ({summary?.heroCount})
            </TabsTrigger>
            <TabsTrigger
              value="villains"
              //onClick={() => setSearchParams("?tab=villans")}
              onClick={() =>
                setSearchParams((prev) => {
                  prev.set("tab", "villains");
                  prev.set("category", "villain");
                  prev.set("page", "1");

                  return prev;
                })
              }
            >
              Villains ({summary?.villainCount})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            {/* Mostrar todos los personajes */}
            <HeroGrid heroes={heroResponse?.heroes ?? []} />
          </TabsContent>
          <TabsContent value="favorites">
            {/* Mostrar todos los personajes favoritos */}
            <HeroGrid heroes={favorites} />
          </TabsContent>
          <TabsContent value="heroes">
            {/* Mostrar todos los héroes */}
            <HeroGrid heroes={heroResponse?.heroes ?? []} />
          </TabsContent>
          <TabsContent value="villains">
            {/* Mostrar todos los Villanos */}
            <HeroGrid heroes={heroResponse?.heroes ?? []} />
          </TabsContent>
        </Tabs>

        {/* Pagination */}
        <CustomPagination totalPages={heroResponse?.pages ?? 1} />
      </>
    </>
  );
};
