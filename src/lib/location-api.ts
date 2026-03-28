import { unstable_cache } from "next/cache";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

// Cache countries for 1 hour (3600 seconds)
export const getCachedCountries = unstable_cache(
    async () => {
        try {
            const response = await fetch(`${BACKEND_URL}location/countries`, {
                next: { revalidate: 3600 }, // Revalidate every hour
            });

            if (!response.ok) {
                throw new Error(
                    `Failed to fetch countries: ${response.status}`,
                );
            }

            return await response.json();
        } catch (error) {
            console.error("Error fetching countries:", error);
            return [];
        }
    },
    ["location-countries"],
    { revalidate: 3600, tags: ["countries"] },
);

// Client-side functions for dynamic fetches (states/cities)
export async function getStates(countryId: string) {
    try {
        const response = await fetch(
            `${BACKEND_URL}location/states?countryId=${countryId}`,
            { next: { revalidate: 3600 } },
        );

        if (!response.ok) {
            throw new Error(`Failed to fetch states: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching states:", error);
        return [];
    }
}

export async function getCities(countryId: string, stateCode: string) {
    try {
        const response = await fetch(
            `${BACKEND_URL}location/cities?countryId=${countryId}&stateCode=${stateCode}`,
            { next: { revalidate: 3600 } },
        );

        if (!response.ok) {
            throw new Error(`Failed to fetch cities: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching cities:", error);
        return [];
    }
}
