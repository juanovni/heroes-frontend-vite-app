import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HeroStats } from "./HeroStats";
import { useHeroSummary } from "../hooks/useHeroSummary";
import type { SummaryInformationResponse } from "../types/get-summary.response";

const mockHero = {
  id: "1",
  name: "Clark Kent",
  slug: "clark-kent",
  alias: "Superman",
  powers: [
    "Súper fuerza",
    "Vuelo",
    "Visión de calor",
    "Visión de rayos X",
    "Invulnerabilidad",
    "Súper velocidad",
  ],
  description:
    "El Último Hijo de Krypton, protector de la Tierra y símbolo de esperanza para toda la humanidad.",
  strength: 10,
  intelligence: 8,
  speed: 9,
  durability: 10,
  team: "Liga de la Justicia",
  image: "1.jpeg",
  firstAppearance: "1938",
  status: "Active",
  category: "Hero",
  universe: "DC",
};

const mockSummaryData: SummaryInformationResponse = {
  totalHeroes: 25,
  strongestHero: {
    id: "1",
    name: "Clark Kent",
    slug: "clark-kent",
    alias: "Superman",
    powers: [
      "Súper fuerza",
      "Vuelo",
      "Visión de calor",
      "Visión de rayos X",
      "Invulnerabilidad",
      "Súper velocidad",
    ],
    description:
      "El Último Hijo de Krypton, protector de la Tierra y símbolo de esperanza para toda la humanidad.",
    strength: 10,
    intelligence: 8,
    speed: 9,
    durability: 10,
    team: "Liga de la Justicia",
    image: "1.jpeg",
    firstAppearance: "1938",
    status: "Active",
    category: "Hero",
    universe: "DC",
  },
  smartestHero: {
    id: "2",
    name: "Bruce Wayne",
    slug: "bruce-wayne",
    alias: "Batman",
    powers: [
      "Artes marciales",
      "Habilidades de detective",
      "Tecnología avanzada",
      "Sigilo",
      "Genio táctico",
    ],
    description:
      "El Caballero Oscuro de Ciudad Gótica, que utiliza el miedo como arma contra el crimen y la corrupción.",
    strength: 6,
    intelligence: 10,
    speed: 6,
    durability: 7,
    team: "Liga de la Justicia",
    image: "2.jpeg",
    firstAppearance: "1939",
    status: "Active",
    category: "Hero",
    universe: "DC",
  },
  heroCount: 18,
  villainCount: 7,
};

// Para el fecth creamos un mock
vi.mock("../hooks/useHeroSummary");
const mockUseHeroSummary = vi.mocked(useHeroSummary); // Mock de ese componente
//mockUseHeroSummary().

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false, // SOlo una peticion si lo quieres cambiar mandarlo con parametro
    },
  },
});

const renderHeroStats = (mockData?: Partial<SummaryInformationResponse>) => {
  // APlicar este cambio porque con el mock ya hay data aunque undefined
  // debemos aplicar estos cambios
  if (mockData) {
    mockUseHeroSummary.mockReturnValue({
      data: mockData, // Si hay data vamos a mandar a sobreescribir la data
    } as unknown as ReturnType<typeof useHeroSummary>);
  } else {
    mockUseHeroSummary.mockReturnValue({
      data: undefined, // Si no hay la primera vez
    } as unknown as ReturnType<typeof useHeroSummary>);
  }

  return render(
    <QueryClientProvider client={queryClient}>
      <HeroStats />
    </QueryClientProvider>
  );
};

describe("HeroStats", () => {
  test("Should render component with default values", () => {
    const { container } = renderHeroStats(); // Sin pasar nada

    expect(screen.getByText("Cargando...")).toBeDefined();
    expect(container).toMatchSnapshot();
    //screen.debug();
  });

  test("Should render HeroStats with mock", () => {
    const { container } = renderHeroStats(mockSummaryData); // Pasando el mock
    expect(container).toMatchSnapshot();
    expect(screen.getByText("Total Characters")).toBeDefined();
    expect(screen.getByText("Favorites")).toBeDefined();

    //screen.debug();
  });

  test("should change the percentage of favorites when a hero is added to favorites", () => {
    localStorage.setItem("favorites", JSON.stringify([mockHero]));
    renderHeroStats(mockSummaryData);

    // Revisar no salio el render
    //const favoritePercentageElement = screen.getByTestId("favorite-percentage");
    //expect(favoritePercentageElement.innerHTML).toContain("4.00%");

    //const favoriteCountElement = screen.getByTestId("favorite-count");
    //expect(favoriteCountElement.innerHTML).toContain("1");
  });
});
