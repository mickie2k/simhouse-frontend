"use client";

import { Map, AdvancedMarker, useMap, APIProvider } from "@vis.gl/react-google-maps";
import { useState, useEffect } from "react";
import { mapStyle } from "@/lib/simhouse-map-style";
import { useLocation } from "@/context/LocationContext";

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

interface LocationPickerProps {
    onLocationSelect: (location: {
        lat: number;
        lng: number;
        address: string;
        countryId?: number;
        stateId?: number;
        cityId?: number;
    }) => void;
    existingLat?: number;
    existingLng?: number;
    existingCountryId?: number;
    existingStateId?: number;
    existingCityId?: number;
}

export default function LocationPicker({
    onLocationSelect,
    existingLat = 13.7563,
    existingLng = 100.5018,
    existingCountryId,
    existingStateId,
    existingCityId,
}: LocationPickerProps) {
    const { countries, getStates, getCities, isLoading: countriesLoading } = useLocation();

    const [selectedLocation, setSelectedLocation] = useState<{
        lat: number;
        lng: number;
    } | null>(() => ({
        lat: existingLat,
        lng: existingLng,
    }));
    const [address, setAddress] = useState<string>("");
    const [loading, setLoading] = useState(false);

    // Country/State/City state
    const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
    const [states, setStates] = useState<State[]>([]);
    const [selectedState, setSelectedState] = useState<State | null>(null);
    const [cities, setCities] = useState<City[]>([]);
    const [selectedCity, setSelectedCity] = useState<City | null>(null);

    // Debug: Log countries when they load
    useEffect(() => {
        console.log('LocationPicker - Countries loaded:', countries);
    }, [countries]);

    // Pre-populate country/state/city based on existing IDs
    useEffect(() => {
        const populateLocationFromIds = async () => {
            if (existingCountryId && countries.length > 0) {
                const country = countries.find((c) => c.id === existingCountryId);
                if (country) {
                    setSelectedCountry(country);

                    // Fetch states for this country
                    try {
                        const fetchedStates = await getStates(country.id.toString());
                        setStates(fetchedStates);

                        // If we have an existing state, select it
                        if (existingStateId && fetchedStates.length > 0) {
                            const state = fetchedStates.find((s) => s.id === existingStateId);
                            if (state) {
                                setSelectedState(state);

                                // Fetch cities for this state
                                if (state.code) {
                                    try {
                                        const fetchedCities = await getCities(country.id.toString(), state.code);
                                        setCities(fetchedCities);

                                        // If we have an existing city, select it
                                        if (existingCityId && fetchedCities.length > 0) {
                                            const city = fetchedCities.find((c) => c.id === existingCityId);
                                            if (city) {
                                                setSelectedCity(city);
                                            }
                                        }
                                    } catch (error) {
                                        console.error("Failed to fetch cities:", error);
                                    }
                                }
                            }
                        }
                    } catch (error) {
                        console.error("Failed to fetch states:", error);
                    }
                }
            }
        };

        populateLocationFromIds();
    }, [existingCountryId, existingStateId, existingCityId, countries]);

    const handleCountryChange = async (countryId: string) => {
        const id = parseInt(countryId, 10);
        const country = countries.find((c) => c.id === id) || null;
        setSelectedCountry(country);
        setSelectedState(null);
        setSelectedCity(null);
        setCities([]);

        if (country) {
            try {
                const fetchedStates = await getStates(country.id.toString());
                setStates(fetchedStates);
            } catch (error) {
                console.error("Failed to fetch states:", error);
            }
        } else {
            setStates([]);
        }
    };

    const handleStateChange = async (stateId: string) => {
        const id = parseInt(stateId, 10);
        const state = states.find((s) => s.id === id) || null;
        setSelectedState(state);
        setSelectedCity(null);

        if (state && selectedCountry && state.code) {
            try {
                const fetchedCities = await getCities(selectedCountry.id.toString(), state.code);
                setCities(fetchedCities);
            } catch (error) {
                console.error("Failed to fetch cities:", error);
            }
        } else {
            setCities([]);
        }
    };

    const handleCityChange = (cityId: string) => {
        const id = parseInt(cityId, 10);
        const city = cities.find((c) => c.id === id) || null;
        setSelectedCity(city);
    };

    const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
        try {
            const response = await fetch(`/api/geocode?lat=${lat}&lng=${lng}`);
            if (!response.ok) {
                return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
            }
            const data = await response.json();
            return data.address ?? `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
        } catch (error) {
            console.error("Reverse geocoding error:", error);
            return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
        }
    };

    const handleMapClick = async (e: any) => {
        const lat = e.detail.latLng.lat;
        const lng = e.detail.latLng.lng;
        setSelectedLocation({ lat, lng });
        setAddress("");
    };

    const handleConfirm = async () => {
        if (selectedLocation && selectedCity && selectedCountry) {
            setLoading(true);
            const latitude = selectedLocation.lat;
            const longitude = selectedLocation.lng;

            // If no address, reverse geocode to get it
            const finalAddress =
                address ||
                (await reverseGeocode(latitude, longitude));

            onLocationSelect({
                lat: latitude,
                lng: longitude,
                address: finalAddress,
                countryId: selectedCountry.id,
                stateId: selectedState?.id,
                cityId: selectedCity.id,
            });
            setLoading(false);
        }
    };

    if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
        return (
            <div className="h-96 w-full flex items-center justify-center bg-gray-100 rounded-lg">
                <p className="text-gray-500">Map unavailable - API key not configured</p>
            </div>
        );
    }

    return (
        <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}>
            <div className="space-y-4">
                {/* Country and City Selection */}
                <div className="grid grid-cols-3 gap-3">
                    {/* Country Select */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">
                            Country <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={selectedCountry?.id || ""}
                            onChange={(e) => handleCountryChange(e.target.value)}
                            disabled={countriesLoading || countries.length === 0}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-600 disabled:bg-gray-100"
                        >
                            <option value="">
                                {countriesLoading ? "Loading countries..." : "Select Country"}
                            </option>
                            {countries && countries.length > 0 ? (
                                countries.map((country) => (
                                    <option key={country.id} value={country.id}>
                                        {country.name}
                                    </option>
                                ))
                            ) : (
                                <option disabled>No countries available</option>
                            )}
                        </select>
                    </div>

                    {/* State Select */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">
                            State/Province <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={selectedState?.id || ""}
                            onChange={(e) => handleStateChange(e.target.value)}
                            disabled={!selectedCountry}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-600 disabled:bg-gray-100"
                        >
                            <option value="">Select State</option>
                            {states.map((state) => (
                                <option key={state.id} value={state.id}>
                                    {state.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* City Select */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">
                            City <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={selectedCity?.id || ""}
                            onChange={(e) => handleCityChange(e.target.value)}
                            disabled={!selectedState}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-600 disabled:bg-gray-100"
                        >
                            <option value="">Select City</option>
                            {cities.map((city) => (
                                <option key={city.id} value={city.id}>
                                    {city.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="relative h-96 w-full rounded-lg overflow-hidden border border-gray-300">
                    <Map
                        mapId="5a706ca271cb9131ddb9311c"
                        defaultCenter={{
                            lat: selectedLocation?.lat || existingLat,
                            lng: selectedLocation?.lng || existingLng,
                        }}
                        defaultZoom={13}
                        gestureHandling={"greedy"}
                        disableDefaultUI={true}
                        onClick={handleMapClick}
                        className="h-full w-full"
                    >
                        {selectedLocation && (
                            <AdvancedMarker
                                position={selectedLocation}
                                title="Selected Location"
                            >
                                <div className="flex flex-col items-center">
                                    <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="w-5 h-5 text-white"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                        >
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                                        </svg>
                                    </div>
                                </div>
                            </AdvancedMarker>
                        )}
                        <MapPanner
                            center={
                                selectedLocation || {
                                    lat: existingLat,
                                    lng: existingLng,
                                }
                            }
                        />
                    </Map>
                </div>

                {/* Location Info */}
                {selectedLocation && (
                    <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div>
                            <p className="text-xs font-semibold text-gray-600 mb-1">
                                Coordinates
                            </p>
                            <p className="text-sm text-gray-800 font-mono">
                                {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                            </p>
                        </div>
                        {address && (
                            <div>
                                <p className="text-xs font-semibold text-gray-600 mb-1">
                                    Address
                                </p>
                                <p className="text-sm text-gray-800">{address}</p>
                            </div>
                        )}
                        {loading && (
                            <p className="text-xs text-gray-500 italic">Loading address...</p>
                        )}
                        <button
                            type="button"
                            onClick={handleConfirm}
                            disabled={!selectedCountry || !selectedCity || loading}
                            className="w-full px-4 py-2.5 bg-black hover:bg-zinc-800 text-white text-sm font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Loading..." : "Confirm Location"}
                        </button>
                    </div>
                )}

                {!selectedLocation && (
                    <p className="text-sm text-gray-600 text-center py-4">
                        Click on the map to select a location
                    </p>
                )}
            </div>
        </APIProvider>
    );
}

function MapPanner({ center }: { center: { lat: number; lng: number } }) {
    const map = useMap();

    useEffect(() => {
        if (map) {
            map.panTo(center);
        }
    }, [center, map]);

    return null;
}
