import React from 'react';
import CardItem from './CardItem';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import EmptyState from '@/components/ui/EmptyState';
import { PokemonCard } from '@/types/pokemon';

interface CardGridProps {
    cards: PokemonCard[];
    loading: boolean;
    error: string | null;
    onAddToCart: (card: PokemonCard) => void;
}

export default function CardGrid({ cards, loading, error, onAddToCart }: CardGridProps) {
    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {Array.from({ length: 12 }).map((_, index) => (
                    <LoadingSkeleton key={index} />
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-900/30 border border-red-500 p-4 rounded-lg text-center">
                <p className="text-red-300">{error}</p>
            </div>
        );
    }

    if (cards.length === 0) {
        return (
            <EmptyState
                title="No Pokémon cards found"
                message="Try adjusting your search or filters to find what you're looking for."
            />
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {cards.map(card => (
                <CardItem
                    key={card.id}
                    card={card}
                    onAddToCart={onAddToCart}
                />
            ))}
        </div>
    );
}
