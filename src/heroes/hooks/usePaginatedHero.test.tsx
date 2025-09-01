import type { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { usePaginatedHero } from "./usePaginatedHero";
import { getHeroesByPageAction } from "../actions/get-heroes-by-page.action";

vi.mock("../actions/get-heroes-by-page.action", () => ({
  getHeroesByPageAction: vi.fn(),
}));
// Creamos la simulaciond el action
const mockGetHeroesByPageAction = vi.mocked(getHeroesByPageAction);

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

describe("usePaginatedHero", () => {
  test("Should return the initial state (isLoading)", () => {
    // Si usamos en tankquery debemos aplicar otro metodo que es el wrapper tanStackCustomProvider
    const { result } = renderHook(() => usePaginatedHero(1, 6), {
      wrapper: tanStackCustomProvider(),
    });
    expect(result.current.isLoading).toBeDefined();
    expect(result.current.isLoading).toBeTruthy(); // valor verdadero
    expect(result.current.data).toBe(undefined);
    //console.log(result);
  });

  test("should return success state with data when API call succeeds", async () => {
    // 1. Data Mock
    const mockHeroesData = {
      total: 20,
      pages: 4,
      heroes: [],
    };
    // 2. Crearla
    mockGetHeroesByPageAction.mockResolvedValue(mockHeroesData); // Data de retorno

    const { result } = renderHook(() => usePaginatedHero(1, 6), {
      wrapper: tanStackCustomProvider(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.status).toBe("success");
    expect(mockGetHeroesByPageAction).toHaveBeenCalled();
    expect(mockGetHeroesByPageAction).toHaveBeenCalledWith(1, 6, "all");
  });

  test("should return success with arguments", async () => {
    // 1. Data Mock
    const mockHeroesData = {
      total: 20,
      pages: 4,
      heroes: [],
    };
    // 2. Crearla
    mockGetHeroesByPageAction.mockResolvedValue(mockHeroesData); // Data de retorno

    const { result } = renderHook(() => usePaginatedHero(1, 6, "heroesABC"), {
      wrapper: tanStackCustomProvider(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.status).toBe("success");
    expect(mockGetHeroesByPageAction).toHaveBeenCalled();
    //expect(mockGetHeroesByPageAction).toHaveBeenCalledWith(); // para ver si fue llamado de esa manera
    expect(mockGetHeroesByPageAction).toHaveBeenCalledWith(1, 6, "heroesABC"); // para ver si fue llamado de esa manera
  });
});
