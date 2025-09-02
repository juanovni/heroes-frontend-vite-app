import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { HomePage } from './HomePage';
import { MemoryRouter } from 'react-router';
import { usePaginatedHero } from '@/heroes/hooks/usePaginatedHero';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import FavoriteHeroContextProvider from '@/heroes/context/FavoriteHeroContext';

vi.mock('@/heroes/hooks/usePaginatedHero');

const mockUsePaginatedHero = vi.mocked(usePaginatedHero);

// Valores iniciales para el mock para que no reviente la app
mockUsePaginatedHero.mockReturnValue({
  data: [],
  isLoading: false,
  isError: false,
  isSuccess: true,
} as unknown as ReturnType<typeof usePaginatedHero>);

const queryClient = new QueryClient();

const renderHomePage = (initialEntries: string[] = ['/']) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <FavoriteHeroContextProvider>
        <QueryClientProvider client={queryClient}>
          <HomePage />
        </QueryClientProvider>
      </FavoriteHeroContextProvider>
    </MemoryRouter>
  );
};

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should render HomePage with default values', () => {
    const { container } = renderHomePage();
    expect(container).toMatchSnapshot();
  });

  test('should call usePaginatedHero with default values', () => {
    renderHomePage();
    expect(mockUsePaginatedHero).toHaveBeenCalledWith(1, 6, 'all');
  });

  test('should call usePaginatedHero with custom query params', () => {
    renderHomePage(['/?page=2&limit=10&category=villains']);
    expect(mockUsePaginatedHero).toHaveBeenCalledWith(2, 10, 'villains');
  });

  test('should called usePaginatedHero with default page and same limit on tab clicked', () => {
    renderHomePage(['/?tab=favorites&page=2&limit=10']);

    // const [allTabs, favoriteTab, heroesTab, villainsTab] = screen.getAllByRole('tab');
    const [, , , villainsTab] = screen.getAllByRole('tab');

    fireEvent.click(villainsTab);

    expect(mockUsePaginatedHero).toHaveBeenCalledWith(1, 10, 'villain');
  });
});