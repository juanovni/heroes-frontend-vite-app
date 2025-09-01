import { use } from "react";
import { render, screen } from "@testing-library/react";
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
});
