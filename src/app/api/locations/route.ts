import { NextResponse } from "next/server";
import { getCountries } from "@countrystatecity/countries";
import { getStatesOfCountry } from "@countrystatecity/countries";
import { getCitiesOfState } from "@countrystatecity/countries";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");
    const countryId = searchParams.get("countryId");
    const stateCode = searchParams.get("stateCode");

    try {
        if (action === "countries") {
            const countries = getCountries();
            const countriesArray = Array.isArray(countries)
                ? countries
                : Object.values(countries || {});
            return NextResponse.json(countriesArray);
        }

        if (action === "states" && countryId) {
            const states = getStatesOfCountry(countryId);
            const statesArray = Array.isArray(states)
                ? states
                : Object.values(states || {});
            return NextResponse.json(statesArray);
        }

        if (action === "cities" && countryId && stateCode) {
            const cities = getCitiesOfState(countryId, stateCode);
            const citiesArray = Array.isArray(cities)
                ? cities
                : Object.values(cities || {});
            return NextResponse.json(citiesArray);
        }

        return NextResponse.json(
            { error: "Invalid action or missing parameters" },
            { status: 400 },
        );
    } catch (error) {
        console.error("Location data error:", error);
        return NextResponse.json(
            { error: "Failed to fetch location data" },
            { status: 500 },
        );
    }
}
