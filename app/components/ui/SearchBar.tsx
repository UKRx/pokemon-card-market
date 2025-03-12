import React from 'react';

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    className?: string;
}

export default function SearchBar({ value, onChange, className = '' }: SearchBarProps) {
    return (
        <div className={`relative ${className}`}>
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
            <input
                type="text"
                className="py-2 pl-10 pr-4 bg-gray-800 text-white rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search by Name"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}
