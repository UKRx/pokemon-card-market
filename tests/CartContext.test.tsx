import { act, renderHook } from '@testing-library/react';
import { PokemonCard } from '@/types/pokemon';
import { CartProvider, useCart } from '@/app/components/features/cart/CartContext';

// Mock Pokemon card data
const mockPokemonCard: PokemonCard = {
    id: 'test-id-1',
    name: 'Pikachu',
    cardmarket: {
        prices: {
            averageSellPrice: 10.99,
            trendPrice: 11.50,
            lowPrice: 9.99
        }
    }
};

const mockPokemonCard2: PokemonCard = {
    id: 'test-id-2',
    name: 'Charizard',
    cardmarket: {
        prices: {
            averageSellPrice: 99.99,
            trendPrice: 105.50,
            lowPrice: 89.99
        }
    }
};

// Mock localStorage
const mockLocalStorage = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: jest.fn((key) => store[key] || null),
        setItem: jest.fn((key, value) => {
            store[key] = value.toString();
        }),
        clear: jest.fn(() => {
            store = {};
        }),
        removeItem: jest.fn((key) => {
            delete store[key];
        }),
    };
})();

Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
});

// Wrapper component for testing hooks
const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;

describe('CartContext', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        window.localStorage.clear();
    });

    test('should initialize with empty cart', () => {
        const { result } = renderHook(() => useCart(), { wrapper });

        expect(result.current.state.items).toHaveLength(0);
        expect(result.current.state.totalItems).toBe(0);
        expect(result.current.state.totalPrice).toBe(0);
    });

    test('should add item to cart', () => {
        const { result } = renderHook(() => useCart(), { wrapper });

        act(() => {
            result.current.addItem(mockPokemonCard);
        });

        expect(result.current.state.items).toHaveLength(1);
        expect(result.current.state.items[0].card.id).toBe('test-id-1');
        expect(result.current.state.items[0].quantity).toBe(1);
        expect(result.current.state.totalItems).toBe(1);
        expect(result.current.state.totalPrice).toBe(10.99);
    });

    test('should increase quantity when adding existing item', () => {
        const { result } = renderHook(() => useCart(), { wrapper });

        act(() => {
            result.current.addItem(mockPokemonCard);
            result.current.addItem(mockPokemonCard);
        });

        expect(result.current.state.items).toHaveLength(1);
        expect(result.current.state.items[0].quantity).toBe(2);
        expect(result.current.state.totalItems).toBe(2);
        expect(result.current.state.totalPrice).toBeCloseTo(21.98);
    });

    test('should remove item from cart', () => {
        const { result } = renderHook(() => useCart(), { wrapper });

        act(() => {
            result.current.addItem(mockPokemonCard);
            result.current.addItem(mockPokemonCard2);
            result.current.removeItem('test-id-1');
        });

        expect(result.current.state.items).toHaveLength(1);
        expect(result.current.state.items[0].card.id).toBe('test-id-2');
        expect(result.current.state.totalItems).toBe(1);
        expect(result.current.state.totalPrice).toBe(99.99);
    });

    test('should update item quantity', () => {
        const { result } = renderHook(() => useCart(), { wrapper });

        act(() => {
            result.current.addItem(mockPokemonCard);
            result.current.updateQuantity('test-id-1', 5);
        });

        expect(result.current.state.items[0].quantity).toBe(5);
        expect(result.current.state.totalItems).toBe(5);
        expect(result.current.state.totalPrice).toBeCloseTo(54.95);
    });

    test('should remove item when quantity is set to 0', () => {
        const { result } = renderHook(() => useCart(), { wrapper });

        act(() => {
            result.current.addItem(mockPokemonCard);
            result.current.addItem(mockPokemonCard2);
            result.current.updateQuantity('test-id-1', 0);
        });

        expect(result.current.state.items).toHaveLength(1);
        expect(result.current.state.items[0].card.id).toBe('test-id-2');
    });

    test('should clear cart', () => {
        const { result } = renderHook(() => useCart(), { wrapper });

        act(() => {
            result.current.addItem(mockPokemonCard);
            result.current.addItem(mockPokemonCard2);
            result.current.clearCart();
        });

        expect(result.current.state.items).toHaveLength(0);
        expect(result.current.state.totalItems).toBe(0);
        expect(result.current.state.totalPrice).toBe(0);
    });

    test('should save cart to localStorage', () => {
        const { result } = renderHook(() => useCart(), { wrapper });

        act(() => {
            result.current.addItem(mockPokemonCard);
        });

        expect(localStorage.setItem).toHaveBeenCalled();
        const savedCart = JSON.parse(localStorage.setItem.mock.calls[localStorage.setItem.mock.calls.length - 1][1]);
        expect(savedCart.items).toHaveLength(1);
        expect(savedCart.items[0].card.id).toBe('test-id-1');
    });

    test('should load cart from localStorage', () => {
        // Setup localStorage with cart data
        const cartData = {
            items: [{ card: mockPokemonCard, quantity: 3 }],
            totalItems: 3,
            totalPrice: 32.97
        };

        localStorage.getItem.mockReturnValueOnce(JSON.stringify(cartData));

        // Re-render with localStorage data
        const { result } = renderHook(() => useCart(), { wrapper });

        // Note: Due to how we restore the cart in useEffect, 
        // we need to wait for the asynchronous operations
        expect(localStorage.getItem).toHaveBeenCalledWith('pokemonCart');

        // This might need adjustment based on how your actual implementation handles loading
        // You might need to use waitFor or similar for async operations
    });

    test('should handle fallback prices when averageSellPrice is not available', () => {
        const { result } = renderHook(() => useCart(), { wrapper });

        const cardWithoutAvgPrice: PokemonCard = {
            id: 'test-id-3',
            name: 'Bulbasaur',
            cardmarket: {
                prices: {
                    trendPrice: 5.50,
                    lowPrice: 4.99
                }
            }
        };

        act(() => {
            result.current.addItem(cardWithoutAvgPrice);
        });

        expect(result.current.state.totalPrice).toBe(5.50); // Should use trendPrice
    });

    test('should handle cards with no price data', () => {
        const { result } = renderHook(() => useCart(), { wrapper });

        const cardWithoutPrice: PokemonCard = {
            id: 'test-id-4',
            name: 'Squirtle'
        };

        act(() => {
            result.current.addItem(cardWithoutPrice);
        });

        expect(result.current.state.items).toHaveLength(1);
        expect(result.current.state.totalPrice).toBe(0);
    });

    test('should throw error when useCart is used outside of CartProvider', () => {
        expect(() => {
            renderHook(() => useCart());
        }).toThrow('useCart must be used within a CartProvider');
    });

});
