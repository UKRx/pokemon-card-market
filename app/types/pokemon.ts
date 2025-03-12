export interface SetOption {
    id: string;
    name: string;
}

export interface FilterOptions {
    types: string[];
    rarities: string[];
    sets: SetOption[];
}

export interface PokemonCard {
    id: string;
    name: string;
    supertype: string;
    subtypes?: string[];
    hp?: string;
    types?: string[];
    rarity?: string;
    images: {
        small: string;
        large: string;
    };
    cardmarket?: {
        prices: {
            averageSellPrice?: number;
            lowPrice?: number;
            trendPrice?: number;
        };
    };
    set: {
        total: number;
        name: string;
        id: string;
    };
}

export interface PokemonCardResponse {
    data: PokemonCard[];
    page: number;
    pageSize: number;
    count: number;
    totalCount: number;
}
