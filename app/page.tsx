'use client';

import { useState, useEffect } from 'react';
import { getCards, getFilterOptions } from '@/lib/api';
import { PokemonCard } from '@/types/pokemon';
import { useCart } from '@/components/features/cart/CartContext';
import useDebounce from '@/hooks/useDebounce';

// Components
import PageLayout from '@/components/layout/PageLayout';
import Header from '@/components/layout/Header';
import CardGrid from '@/components/features/cards/CardGrid';
import Pagination from '@/components/ui/Pagination';
import CartSidebar from '@/components/features/cart/CartSidebar';
import FiltersSection from '@/components/features/filters/FiltersSection';

export default function Home() {
  // State management
  const [cards, setCards] = useState<PokemonCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCart, setShowCart] = useState(false);

  // Filter states
  const [filterOptions, setFilterOptions] = useState({
    types: [],
    rarities: [],
    sets: [],
  });
  const [selectedFilters, setSelectedFilters] = useState({
    types: [] as string[],
    rarities: [] as string[],
    sets: [] as string[],
  });

  // Hooks
  const { state: cartState, addItem } = useCart();
  const debouncedSearch = useDebounce(searchTerm, 500);

  // Load filter options on component mount
  useEffect(() => {
    loadFilterOptions();
  }, []);

  // Load cards when search, filters, or pagination changes
  useEffect(() => {
    loadCards();
  }, [currentPage, debouncedSearch, selectedFilters]);

  // API Calls
  const loadFilterOptions = async () => {
    try {
      const options = await getFilterOptions();
      setFilterOptions(options as any);
    } catch (err) {
      console.error('Failed to load filter options:', err);
    }
  };

  const loadCards = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await getCards(
        currentPage,
        20,
        debouncedSearch,
        selectedFilters
      );

      setCards(result.cards);
      setTotalPages(result.totalPages);
    } catch (err) {
      console.error('Failed to fetch cards:', err);
      setError('Failed to load Pokémon cards. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Event Handlers
  const handleFilterChange = (filterType: 'types' | 'rarities' | 'sets', value: string) => {
    setSelectedFilters(prev => {
      const currentValues = [...prev[filterType]];
      const index = currentValues.indexOf(value);

      if (index >= 0) {
        currentValues.splice(index, 1);
      } else {
        currentValues.push(value);
      }

      const newFilters = {
        ...prev,
        [filterType]: currentValues,
      };

      return newFilters;
    });

    setCurrentPage(1); // Reset to first page when filters change
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page when search changes
  };

  const toggleCart = () => {
    setShowCart(!showCart);
  };

  // Render
  return (
    <PageLayout>
      <Header
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        cartItemCount={cartState.totalItems}
        onCartClick={toggleCart}
      />

      <FiltersSection
        filterOptions={filterOptions}
        selectedFilters={selectedFilters}
        onFilterChange={handleFilterChange}
      />

      <CardGrid
        cards={cards}
        loading={loading}
        error={error}
        onAddToCart={addItem}
      />

      {!loading && cards.length > 0 && (
        <div className="mt-8 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* Cart Sidebar */}
      {showCart && (
        <CartSidebar onClose={toggleCart} />
      )}
    </PageLayout>
  );
}
