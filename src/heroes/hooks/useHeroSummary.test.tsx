import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { PropsWithChildren } from "react";
import { useHeroSummary } from "./useHeroSummary";
import { getSummaryAction } from "../actions/get-summary.action";
import type { SummaryInformationResponse } from "../types/get-summary.response";

vi.mock("../actions/get-summary.action", () => ({
  getSummaryAction: vi.fn(),
}));

const mockGetSummaryAction = vi.mocked(getSummaryAction);

const tanStackCustomProvider = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // SOlo una peticion si lo quieres cambiar mandarlo con parametro
      },
    },
  });

  return ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useHeroSummary", () => {
  test("Should return the initial state (isLoading)", () => {
    // Si usamos en tankquery debemos aplicar otro metodo que el
    // expect(result.current.gifs.length).toBe(0);
    const { result } = renderHook(() => useHeroSummary(), {
      wrapper: tanStackCustomProvider(),
    });

    expect(result.current.isLoading).toBeDefined();
    expect(result.current.isLoading).toBeTruthy(); // valor verdadero
    expect(result.current.data).toBe(undefined);

    //console.log(result);
  });

  test("should return success state with data when API call succeeds", async () => {
    const mockSummaryData = {
      totalHeroes: 10,
      strongestHero: {
        id: "1",
        name: "Superman",
      },
      smartestHero: {
        id: "2",
        name: "Batman",
      },
      heroCount: 18,
      villainCount: 7,
    } as SummaryInformationResponse;

    mockGetSummaryAction.mockResolvedValue(mockSummaryData);

    const { result } = renderHook(() => useHeroSummary(), {
      wrapper: tanStackCustomProvider(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true); // Con esto espera que termine de hacer la peticion para retornar la data
    });
    //console.log(result.current);

    // 1. Si queremos camibar esto po una mejor logica ya que la data puede cambiar
    // se aconseja crear un mock
    /* expect(result.current.data).toStrictEqual({
      totalHeroes: 25,
      strongestHero: {
        id: "1",
        name: "Clark Kent",
        slug: "clark-kent",
        alias: "Superman",
        powers: expect.any(Array),
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
        powers: expect.any(Array),
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
    }); */

    // 2. Mejorada crear un pbjeto de retorno arriba

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(mockGetSummaryAction).toHaveBeenCalled();
    //Ver con que argumentos fue llamado llama a esa data
    //expect(mockGetSummaryAction).toHaveBeenCalledWith();
  });
});
