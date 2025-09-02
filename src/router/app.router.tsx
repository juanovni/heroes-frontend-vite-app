import { createHashRouter, Navigate } from "react-router";
import { HeroPage } from "@/heroes/pages/hero/HeroPage";
import { HomePage } from "@/heroes/pages/home/HomePage";
/* import { SearchPage } from "@/heroes/pages/search/SearchPage"; */
import { AdminPage } from "@/admin/pages/AdminPage";
import { HeroesLayout } from "@/heroes/pages/layouts/HeroesLayout";
import { AdminLayout } from "@/admin/pages/layouts/AdminLayout";
import { lazy } from "react";

// Rutas privadas con router data pero is framework es del lado del servidor
// crear un archivo externo porque no puede ser llamado desde aqui

// Sirve para renderizar paginas peresozas
const SearchPage = lazy(() => import("@/heroes/pages/search/SearchPage"));

//export const appRouter = createBrowserRouter([
export const appRouter = createHashRouter([
  {
    path: "/",
    element: <HeroesLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "heroes/:idSlug",
        element: <HeroPage />,
      },
      {
        path: "search",
        element: <SearchPage />,
      },
      {
        path: "*",
        element: <Navigate to="/" />,
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <AdminPage />,
      },
    ],
  },
]);
