import { use } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import FavoriteHeroContextProvider, {
  FavoriteHeroContext,
} from "./FavoriteHeroContext";
import type { Hero } from "../types/hero.interface";

const mockHero = {
  id: "1",
  name: "batman",
} as Hero;

const TestComponent = () => {
  const { favoriteCount, favorites, isFavorite, toogleFavorite } =
    use(FavoriteHeroContext);

  return (
    <div>
      <div data-testid="favorite-count">{favoriteCount}</div>
      <div data-testid="favorite-list">
        {favorites.map((hero) => (
          <div key={hero.id} data-testid={`hero-${hero.id}`}>
            {hero.name}
          </div>
        ))}
      </div>
      <button
        data-testid="toggle-favorite"
        onClick={() => toogleFavorite(mockHero)}
      >
        Toggle Favorite
      </button>
      <div data-testid="is-favorite">{isFavorite(mockHero).toString()}</div>
    </div>
  );
};

const renderContextTest = () => {
  return render(
    <FavoriteHeroContextProvider>
      <TestComponent />
    </FavoriteHeroContextProvider>
  );
};

describe("FavoriteHeroContext", () => {
  test("Should initialize with default values", () => {
    renderContextTest();
    /* render(<FavoriteHeroContextProvider />);*/
    expect(screen.getByTestId("favorite-count").textContent).toBe("0");
    expect(screen.getByTestId("favorite-count").children.length).toBe(0);

    screen.debug();
  });

  test("should add hero to favorites when toggleFavorite is called with new Hero", () => {
    renderContextTest();
    const button = screen.getByTestId("toggle-favorite");

    fireEvent.click(button);
    // Manda a ejecutar la funcion 
    //console.log(localStorage.getItem('favorites'));

    expect(screen.getByTestId("favorite-count").textContent).toBe("1");
    expect(screen.getByTestId("is-favorite").textContent).toBe("true");
    expect(screen.getByTestId("hero-1").textContent).toBe("batman");
    expect(localStorage.getItem("favorites")).toBe(
      '[{"id":"1","name":"batman"}]'
    );
  });
});
