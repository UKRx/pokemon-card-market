import React from 'react';

interface EmptyStateProps {
    title: string;
    message: string;
    icon?: React.ReactNode;
}

export default function EmptyState({ title, message, icon }: EmptyStateProps) {
    const defaultIcon = (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-blue-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );

    return (
        <div className="bg-blue-900/30 border border-blue-500 p-8 rounded-lg text-center">
            {icon || defaultIcon}
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <p className="text-gray-400">{message}</p>
        </div>
    );
}
