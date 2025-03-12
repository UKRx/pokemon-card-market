import React from 'react';
import Image from 'next/image';
import { PokemonCard } from '@/types/pokemon';

interface CardItemProps {
    card: PokemonCard;
    onAddToCart: (card: PokemonCard) => void;
}

export default function CardItem({ card, onAddToCart }: CardItemProps) {
    return (
        <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="relative h-48 bg-gray-700 flex items-center justify-center">
                <Image
                    src={card.images.small}
                    alt={card.name}
                    width={180}
                    height={250}
                    className="object-contain h-full"
                />
            </div>
            <div className="p-4">
                <h3 className="font-medium text-white truncate mb-1">{card.name}</h3>
                <div className="flex justify-between items-center mb-3">
                    <div className="text-gray-400 text-sm">
                        $ {(card.cardmarket?.prices.averageSellPrice || 0).toFixed(2)}
                    </div>
                    <div className="text-gray-400 text-sm">
                        {card.set.total} Cards
                    </div>
                </div>
                <button
                    onClick={() => onAddToCart(card)}
                    className="w-full flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-md transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    Add to cart
                </button>
            </div>
        </div>
    );
}
