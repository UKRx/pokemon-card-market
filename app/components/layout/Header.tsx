import React from 'react';
import SearchBar from '@/components/ui/SearchBar';

interface HeaderProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    cartItemCount: number;
    onCartClick: () => void;
}

export default function Header({ searchTerm, onSearchChange, cartItemCount, onCartClick }: HeaderProps) {
    return (
        <div className="flex items-center justify-between mb-10">
            <h1 className="text-3xl font-bold">Pokemon market</h1>

            <div className="flex items-center gap-4">
                <SearchBar value={searchTerm} onChange={onSearchChange} className="w-64" />

                <button
                    className="bg-orange-400 p-3 rounded-lg relative"
                    onClick={onCartClick}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    {cartItemCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {cartItemCount}
                        </span>
                    )}
                </button>
            </div>
        </div>
    );
}
