import axios from 'axios';
import { PokemonCard, PokemonCardResponse, FilterOptions } from '../types/pokemon';

const api = axios.create({
    baseURL: 'https://api.pokemontcg.io/v2',
});

// lib/api.ts
export const getCards = async (
    page = 1,
    pageSize = 20,
    search = '',
    filters: { types: string[], rarities: string[], sets: string[] } = { types: [], rarities: [], sets: [] }
): Promise<{
    cards: PokemonCard[];
    totalCount: number;
    totalPages: number;
}> => {
    // Build query string based on filters
    let query = search ? `name:"*${search}*"` : '';

    if (filters.types.length > 0) {
        const typesQuery = `types:${filters.types.join(' OR types:')}`;
        console.log("Types query:", typesQuery);
        query += (query ? ' AND ' : '') + typesQuery;
    }

    if (filters.rarities.length > 0) {
        const raritiesQuery = `rarity:${filters.rarities.join(' OR rarity:')}`;
        console.log("Rarities query:", raritiesQuery);
        query += (query ? ' AND ' : '') + raritiesQuery;
    }

    if (filters.sets.length > 0) {
        const setsQuery = `set.id:${filters.sets.join(' OR set.id:')}`;
        console.log("Sets query:", setsQuery);
        query += (query ? ' AND ' : '') + setsQuery;
    }

    console.log("Final query:", query);

    const response = await api.get<PokemonCardResponse>('/cards', {
        params: {
            page,
            pageSize,
            q: query,
        },
    });

    console.log("API response status:", response.status);
    console.log("API response total count:", response.data.totalCount);

    return {
        cards: response.data.data,
        totalCount: response.data.totalCount,
        totalPages: Math.ceil(response.data.totalCount / pageSize),
    };
};

export const getFilterOptions = async (): Promise<FilterOptions> => {
    const [typesRes, raritiesRes, setsRes] = await Promise.all([
        api.get('/types'),
        api.get('/rarities'),
        api.get('/sets'),
    ]);

    return {
        types: typesRes.data.data,
        rarities: raritiesRes.data.data,
        sets: setsRes.data.data.map((set: any) => ({ id: set.id, name: set.name })),
    };
};
