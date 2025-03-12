import React from 'react';
import Image from 'next/image';
import { CartItem as CartItemType } from '@/types/cart';

interface CartItemProps {
    item: CartItemType;
    updateQuantity: (id: string, quantity: number) => void;
}

export default function CartItem({ item, updateQuantity }: CartItemProps) {
    return (
        <div className="flex flex-col">
            {/* Item info row */}
            <div className="flex items-center mb-2">
                <div className="flex-1 flex items-center">
                    <div className="w-12 h-12 relative mr-2">
                        <Image
                            src={item.card.images.small}
                            alt={item.card.name}
                            width={48}
                            height={48}
                            className="object-contain"
                        />
                    </div>
                    <div>
                        <p className="text-sm truncate">{item.card.name || '{name}'}</p>
                        <p className="text-xs text-gray-400">$ {(item.card.cardmarket?.prices.averageSellPrice || 2.29).toFixed(2)}</p>
                    </div>
                </div>
                <div className="w-16 text-right">
                    $ {((item.card.cardmarket?.prices.averageSellPrice || 2.29) * item.quantity).toFixed(2)}
                </div>
            </div>

            {/* Quantity controls */}
            <div className="flex h-10 mb-1">
                <button
                    onClick={() => updateQuantity(item.card.id, item.quantity - 1)}
                    className="w-12 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center"
                >
                    -
                </button>
                <div className="flex-1 mx-2 bg-gray-800 rounded-lg flex items-center justify-center">
                    {item.quantity}
                </div>
                <button
                    onClick={() => updateQuantity(item.card.id, item.quantity + 1)}
                    className="w-12 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center"
                >
                    +
                </button>
            </div>
        </div>
    );
}
