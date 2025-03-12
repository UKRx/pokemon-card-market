'use client';

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { PokemonCard } from '@/types/pokemon';

// Define types for cart items and state
export interface CartItem {
    card: PokemonCard;
    quantity: number;
}

export interface CartState {
    items: CartItem[];
    totalItems: number;
    totalPrice: number;
}

// Define action types for the reducer
type CartAction =
    | { type: 'ADD_ITEM'; payload: PokemonCard }
    | { type: 'REMOVE_ITEM'; payload: string }
    | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
    | { type: 'CLEAR_CART' };

// Initial state for the cart
const initialState: CartState = {
    items: [],
    totalItems: 0,
    totalPrice: 0,
};

// Helper function to calculate totals
const calculateTotals = (items: CartItem[]): { totalItems: number; totalPrice: number } => {
    return items.reduce(
        (acc, item) => {
            const price = item.card.cardmarket?.prices.averageSellPrice ||
                item.card.cardmarket?.prices.trendPrice ||
                item.card.cardmarket?.prices.lowPrice ||
                0;
            return {
                totalItems: acc.totalItems + item.quantity,
                totalPrice: acc.totalPrice + price * item.quantity,
            };
        },
        { totalItems: 0, totalPrice: 0 }
    );
};

// Reducer function to handle cart state updates
const cartReducer = (state: CartState, action: CartAction): CartState => {
    switch (action.type) {
        case 'ADD_ITEM': {
            const existingItemIndex = state.items.findIndex(item => item.card.id === action.payload.id);

            if (existingItemIndex >= 0) {
                const updatedItems = [...state.items];
                updatedItems[existingItemIndex] = {
                    ...updatedItems[existingItemIndex],
                    quantity: updatedItems[existingItemIndex].quantity + 1,
                };

                const { totalItems, totalPrice } = calculateTotals(updatedItems);
                return { items: updatedItems, totalItems, totalPrice };
            }

            const newItems = [...state.items, { card: action.payload, quantity: 1 }];
            const { totalItems, totalPrice } = calculateTotals(newItems);
            return { items: newItems, totalItems, totalPrice };
        }

        case 'REMOVE_ITEM': {
            const newItems = state.items.filter(item => item.card.id !== action.payload);
            const { totalItems, totalPrice } = calculateTotals(newItems);
            return { items: newItems, totalItems, totalPrice };
        }

        case 'UPDATE_QUANTITY': {
            const { id, quantity } = action.payload;

            if (quantity <= 0) {
                const newItems = state.items.filter(item => item.card.id !== id);
                const { totalItems, totalPrice } = calculateTotals(newItems);
                return { items: newItems, totalItems, totalPrice };
            }

            const updatedItems = state.items.map(item =>
                item.card.id === id ? { ...item, quantity } : item
            );

            const { totalItems, totalPrice } = calculateTotals(updatedItems);
            return { items: updatedItems, totalItems, totalPrice };
        }

        case 'CLEAR_CART':
            return initialState;

        default:
            return state;
    }
};

// Create the context
type CartContextType = {
    state: CartState;
    addItem: (card: PokemonCard) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

// Create the provider component
export function CartProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(cartReducer, initialState);

    // Load cart from localStorage on initial render
    useEffect(() => {
        const savedCart = localStorage.getItem('pokemonCart');
        if (savedCart) {
            try {
                const parsedCart = JSON.parse(savedCart);
                // Need to properly restore the cart state
                if (parsedCart.items && Array.isArray(parsedCart.items)) {
                    parsedCart.items.forEach((item: CartItem) => {
                        dispatch({ type: 'ADD_ITEM', payload: item.card });
                        if (item.quantity > 1) {
                            dispatch({
                                type: 'UPDATE_QUANTITY',
                                payload: { id: item.card.id, quantity: item.quantity }
                            });
                        }
                    });
                }
            } catch (e) {
                console.error('Failed to parse cart from localStorage', e);
            }
        }
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('pokemonCart', JSON.stringify(state));
    }, [state]);

    // Define the actions that can be performed on the cart
    const addItem = (card: PokemonCard) => {
        dispatch({ type: 'ADD_ITEM', payload: card });
    };

    const removeItem = (id: string) => {
        dispatch({ type: 'REMOVE_ITEM', payload: id });
    };

    const updateQuantity = (id: string, quantity: number) => {
        dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
    };

    const clearCart = () => {
        dispatch({ type: 'CLEAR_CART' });
    };

    return (
        <CartContext.Provider value={{ state, addItem, removeItem, updateQuantity, clearCart }}>
            {children}
        </CartContext.Provider>
    );
}

// Custom hook to use the cart context
export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
