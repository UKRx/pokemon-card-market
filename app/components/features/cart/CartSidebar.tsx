import React from 'react';
import CartItem from './CartItem';
import { useCart } from './CartContext';

interface CartSidebarProps {
    onClose: () => void;
}

export default function CartSidebar({ onClose }: CartSidebarProps) {
    const { state, updateQuantity, clearCart } = useCart();
    const { items, totalItems, totalPrice } = state;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
            <div className="w-full max-w-md bg-gray-900 h-full overflow-auto">
                <div className="p-4">
                    {/* Cart Header */}
                    <div className="flex justify-between items-start mb-5">
                        <div>
                            <h2 className="text-xl font-bold mb-1">Cart</h2>
                            {items.length > 0 && (
                                <button
                                    onClick={clearCart}
                                    className="text-sm text-gray-400 hover:text-white"
                                >
                                    Clear all
                                </button>
                            )}
                        </div>

                        <button
                            onClick={onClose}
                            className="bg-orange-400 p-2.5 rounded-lg text-white hover:bg-orange-500 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Column Headers */}
                    {items.length > 0 && (
                        <div className="flex text-sm text-gray-400 mb-3">
                            <div className="flex-1">Item</div>
                            <div className="w-28 text-center">Qty</div>
                            <div className="w-16 text-right">Price</div>
                        </div>
                    )}

                    {/* Cart Content */}
                    <div className="flex-1 space-y-5">
                        {items.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-64 text-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                                <p className="text-gray-400">Your cart is empty</p>
                                <p className="text-sm text-gray-500 mt-2">Add some Pokémon cards to get started!</p>
                            </div>
                        ) : (
                            items.map(item => (
                                <CartItem
                                    key={item.card.id}
                                    item={item}
                                    updateQuantity={updateQuantity}
                                />
                            ))
                        )}
                    </div>

                    {/* Cart Footer */}
                    {items.length > 0 && (
                        <div className="mt-6 pt-4 border-t border-gray-700 space-y-3">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-400">Total card amount</span>
                                <span>{totalItems}</span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-gray-400">Total price</span>
                                <span className="font-bold">$ {totalPrice.toFixed(2)}</span>
                            </div>

                            <button className="w-full bg-orange-400 hover:bg-orange-500 text-white py-3 rounded-md transition-colors font-medium mt-3">
                                Continue to Payment
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
