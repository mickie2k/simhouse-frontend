'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getStates as fetchStates, getCities as fetchCities } from '@/lib/location-api';

interface Country {
    id: number;
    name: string;
}

interface State {
    id: number;
    name: string;
    code?: string;
}

interface City {
    id: number;
    name: string;
}

interface LocationContextType {
    countries: Country[];
    getStates: (countryId: string) => Promise<State[]>;
    getCities: (countryId: string, stateCode: string) => Promise<City[]>;
    isLoading: boolean;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({
    children,
    initialCountries = [],
}: {
    children: React.ReactNode;
    initialCountries?: Country[];
}) {
    const [countries, setCountries] = useState<Country[]>(initialCountries);
    const [isLoading, setIsLoading] = useState(() => !initialCountries || initialCountries.length === 0);

    return (
        <LocationContext.Provider
            value={{
                countries,
                getStates: fetchStates,
                getCities: fetchCities,
                isLoading,
            }}
        >
            {children}
        </LocationContext.Provider>
    );
}

export function useLocation() {
    const context = useContext(LocationContext);
    if (!context) {
        throw new Error('useLocation must be used within a LocationProvider');
    }
    return context;
}
