"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import PlaceAutocomplete from "./PlaceAutocomplete";


type LocationData = {
    type: "city" | "coordinates";
    cityId?: string;
    lat?: number;
    lng?: number;
};

type SearchFormData = {
    location: LocationData | null;
    simTypeId: string;
    date: string;
};

export default function SearchBox() {
    const router = useRouter();
    const [formData, setFormData] = useState<SearchFormData>({
        location: null,
        simTypeId: "",
        date: "",
    });
    const handlePlaceSelect = (place: google.maps.places.PlaceResult | null) => {
        const location = place?.geometry?.location;
        if (!location) {
            setFormData((prev) => ({ ...prev, location: null }));
            return;
        }

        const lat = typeof location.lat === "function" ? location.lat() : location.lat;
        const lng = typeof location.lng === "function" ? location.lng() : location.lng;

        if (typeof lat === "number" && typeof lng === "number") {
            setFormData((prev) => ({
                ...prev,
                location: {
                    type: "coordinates",
                    lat,
                    lng,
                },
            }));
            return;
        }

        setFormData((prev) => ({ ...prev, location: null }));
    };



    const handleSearch = () => {
        // Build query parameters
        const params = new URLSearchParams();

        // Handle location data
        if (formData.location) {
            if (formData.location.type === "city" && formData.location.cityId) {
                params.set("cityId", formData.location.cityId);
            } else if (formData.location.type === "coordinates") {
                if (formData.location.lat !== undefined) {
                    params.set("lat", formData.location.lat.toString());
                }
                if (formData.location.lng !== undefined) {
                    params.set("lng", formData.location.lng.toString());
                }
            }
        }

        if (formData.simTypeId) {
            params.set("simTypeIds", formData.simTypeId);
        }

        if (formData.date) {
            params.set("startDate", formData.date);
        }

        // Navigate to paginated list page with search params
        router.push(`/page/1?${params.toString()}`);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <div className="w-full max-w-4xl mt-8 mx-auto sm:mx-0">
            <div className="hidden bg-white rounded-full shadow-xl border border-gray-200 md:flex items-center overflow-hidden hover:shadow-2xl transition-shadow">
                {/* Where (Location) Field */}
                <div className="flex-1 px-6 py-4 border-r border-gray-200 min-w-0">
                    <label className="block text-xs font-bold text-gray-900 mb-1">
                        Where
                    </label>
                    <PlaceAutocomplete onPlaceSelect={handlePlaceSelect} />
                </div>

                {/* Type Field */}
                <div className="flex-1 px-6 py-4 border-r border-gray-200 min-w-0">
                    <label className="block text-xs font-bold text-gray-900 mb-1">
                        Type
                    </label>
                    <select
                        value={formData.simTypeId}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                simTypeId: e.target.value,
                            })
                        }
                        onKeyPress={handleKeyPress}
                        className="w-full text-sm text-gray-700 bg-transparent border-none outline-none focus:ring-0 cursor-pointer"
                    >
                        <option value="">All Types</option>
                        <option value="1">Formula 1</option>
                        <option value="2">GT Racing</option>
                    </select>
                </div>

                {/* Date Field */}
                <div className="flex-1 px-6 py-4 min-w-0">
                    <label className="block text-xs font-bold text-gray-900 mb-1">
                        Date
                    </label>
                    <input
                        type="date"
                        value={formData.date}
                        onChange={(e) =>
                            setFormData({ ...formData, date: e.target.value })
                        }
                        onKeyPress={handleKeyPress}
                        min={new Date().toISOString().split("T")[0]}
                        className="w-full text-sm text-gray-700 bg-transparent border-none outline-none focus:ring-0 cursor-pointer [color-scheme:light]"
                        placeholder="Add dates"
                    />
                </div>

                {/* Search Button - Airbnb style */}
                <button
                    onClick={handleSearch}
                    className="m-2  bg-primary1 hover:bg-primary1_hover  text-white rounded-full p-4 transition-all "
                    aria-label="Search"
                >
                    <Search size={20} />
                </button>
            </div>

            {/* Mobile responsive version */}
            <div className="md:hidden mt-4 space-y-2">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
                    <label className="block text-xs font-bold text-gray-900 mb-2">
                        Where
                    </label>
                    <PlaceAutocomplete onPlaceSelect={handlePlaceSelect} />

                </div>

                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
                    <label className="block text-xs font-bold text-gray-900 mb-2">
                        Type
                    </label>
                    <select
                        value={formData.simTypeId}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                simTypeId: e.target.value,
                            })
                        }
                        className="w-full text-sm text-gray-700 bg-transparent border-none outline-none focus:ring-0"
                    >
                        <option value="">All Types</option>
                        <option value="1">Formula 1</option>
                        <option value="2">GT Racing</option>
                    </select>
                </div>

                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
                    <label className="block text-xs font-bold text-gray-900 mb-2">
                        Date
                    </label>
                    <input
                        type="date"
                        value={formData.date}
                        onChange={(e) =>
                            setFormData({ ...formData, date: e.target.value })
                        }
                        min={new Date().toISOString().split("T")[0]}
                        className="w-full text-sm text-gray-700 bg-transparent border-none outline-none focus:ring-0 [color-scheme:light]"
                    />
                </div>

                <button
                    onClick={handleSearch}
                    className="w-full bg-primary1 hover:bg-primary1_hover text-white rounded-full py-4 px-6 font-semibold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                    <Search size={20} />
                    Search
                </button>
            </div>
        </div>
    );
}
