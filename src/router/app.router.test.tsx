import { describe, expect, test, vi } from "vitest";
import { appRouter } from "./app.router";
import { render, screen } from "@testing-library/react";
import {
  createMemoryRouter,
  Outlet,
  RouterProvider,
  useParams,
} from "react-router";

vi.mock("@/heroes/layouts/HeroesLayout", () => ({
  HeroesLayout: () => (
    <div data-testid="heroes-layout">
      <Outlet />
    </div>
  ),
}));

vi.mock("@/heroes/pages/home/HomePage", () => ({
  HomePage: () => <div data-testid="home-page"></div>,
}));

// Creando un heroPageMock
vi.mock("@/heroes/pages/hero/HeroPage", () => ({
  HeroPage: () => {
    const { idSlug = "" } = useParams();

    return <div data-testid="hero-page">HeroPage - {idSlug}</div>;
  },
}));

// Search objeto implicito para el SearchPage
vi.mock("@/heroes/pages/search/SearchPage", () => ({
  default: () => <div data-testid="search-page"></div>,
}));

describe("appRouter", () => {
  test("should be configured as expected", () => {
    expect(appRouter.routes).toMatchSnapshot();
  });

  test("should render home page at root path", () => {
    const router = createMemoryRouter(appRouter.routes, {
      initialEntries: ["/"], // Especificar la ruta que va a verificar
    });
    render(<RouterProvider router={router} />);
    expect(screen.getByTestId("home-page")).toBeDefined();
  });

  test("should render hero page at /heroes/:idSlug path", () => {
    const router = createMemoryRouter(appRouter.routes, {
      initialEntries: ["/heroes/superman"], // Especificar la ruta que va a verificar
    });
    render(<RouterProvider router={router} />);

    expect(screen.getByTestId("hero-page").innerHTML).toContain("superman");
  });

  // Cargar un page con cpginas pererozas lazy await
  test("should render search page at /search path", async () => {
    const router = createMemoryRouter(appRouter.routes, {
      initialEntries: ["/search"],
    });

    render(<RouterProvider router={router} />);

    expect(await screen.findByTestId("search-page")).toBeDefined();
  });

  // Testing para paginas no existentes
  test("should redirect to home page for unknown routes", () => {
    const router = createMemoryRouter(appRouter.routes, {
      initialEntries: ["/otra-pagina-rara"],
      //initialEntries: ["/otra-pagina-rara?name=superma&page=1"], // Para poder evaluar rutas
    });

    render(<RouterProvider router={router} />);
    //screen.debug();

    expect(screen.getByTestId("home-page")).toBeDefined();
  });
});
