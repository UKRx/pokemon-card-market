import { PokemonCard } from './pokemon';

export interface CartItem {
    card: PokemonCard;
    quantity: number;
}

export interface CartState {
    items: CartItem[];
    totalItems: number;
    totalPrice: number;
}
