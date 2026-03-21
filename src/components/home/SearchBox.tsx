"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import PlaceAutocomplete from "./PlaceAutocomplete";
import type { SelectedPlace } from "@/types";

type SearchFormData = {
    selectedPlace: SelectedPlace | null;
    simTypeId: string;
    date: string;
};

interface SearchBoxProps {
    compact?: boolean;
}

export default function SearchBox({ compact = false }: SearchBoxProps) {
    const router = useRouter();
    const [formData, setFormData] = useState<SearchFormData>({
        selectedPlace: null,
        simTypeId: "",
        date: "",
    });


    const splitAddressToArray = (name: string) => {
        return name.split(",").map((part) => part.trim()) || [];
    }



    const handleSearch = () => {
        // Build query parameters
        const params = new URLSearchParams();

        // Handle location data
        if (formData.selectedPlace) {
            console.log("Selected place:", formData.selectedPlace);
            if (formData.selectedPlace.address) {
                const arr = splitAddressToArray(formData.selectedPlace.address);
                const length = arr.length;
                if (arr && length > 3) {
                    params.set("useSpecific", "true");
                }
                arr[length - 1] ? params.set("country", arr[length - 1]) : null;
                arr[length - 2] ? params.set("province", arr[length - 2]) : null;
                arr[length - 3] ? params.set("city", arr[length - 3]) : null;

            }
            params.set("lat", formData.selectedPlace.lat.toString());
            params.set("lng", formData.selectedPlace.lng.toString());
            params.set("locationName", formData.selectedPlace.name);
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



    const fieldPadding = compact ? "px-4 py-2" : "px-6 py-4";

    return (
        <div className={compact ? "w-full" : "w-full max-w-4xl mt-8 mx-auto sm:mx-0"}>
            <div className="hidden bg-white rounded-full shadow-xl border border-gray-200 md:flex items-center hover:shadow-2xl transition-shadow">
                {/* Where (Location) Field */}
                <div className={`flex-1 ${fieldPadding} border-r border-gray-200 min-w-0`}>
                    {!compact && (
                        <label className="block text-xs font-bold text-gray-900 mb-1">Where</label>
                    )}
                    <div className="autocomplete-control">
                        <PlaceAutocomplete
                            onPlaceSelect={(place) =>
                                setFormData((prev) => ({ ...prev, selectedPlace: place }))
                            }
                        />
                    </div>
                </div>

                {/* Type Field */}
                <div className={`flex-1 ${fieldPadding} border-r border-gray-200 min-w-0`}>
                    {!compact && (
                        <label className="block text-xs font-bold text-gray-900 mb-1">Type</label>
                    )}
                    <select
                        value={formData.simTypeId}
                        onChange={(e) =>
                            setFormData({ ...formData, simTypeId: e.target.value })
                        }
                        className="w-full text-sm text-gray-700 bg-transparent border-none outline-none focus:ring-0 cursor-pointer"
                    >
                        <option value="">All Types</option>
                        <option value="1">Formula 1</option>
                        <option value="2">GT Racing</option>
                    </select>
                </div>

                {/* Date Field */}
                <div className={`flex-1 ${fieldPadding} min-w-0`}>
                    {!compact && (
                        <label className="block text-xs font-bold text-gray-900 mb-1">Date</label>
                    )}
                    <input
                        type="date"
                        value={formData.date}
                        onChange={(e) =>
                            setFormData({ ...formData, date: e.target.value })
                        }
                        min={new Date().toISOString().split("T")[0]}
                        className="w-full text-sm text-gray-700 bg-transparent border-none outline-none focus:ring-0 cursor-pointer [color-scheme:light]"
                        placeholder="Add dates"
                    />
                </div>

                {/* Search Button */}
                <button
                    onClick={handleSearch}
                    className={`${compact ? "m-1 p-3" : "m-2 p-4"} bg-primary1 hover:bg-primary1_hover text-white rounded-full transition-all`}
                    aria-label="Search"
                >
                    <Search size={compact ? 16 : 20} />
                </button>
            </div>

            {/* Mobile responsive version */}
            <div className="md:hidden mt-4 space-y-2">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
                    <label className="block text-xs font-bold text-gray-900 mb-2">
                        Where
                    </label>
                    <PlaceAutocomplete
                        onPlaceSelect={(place) =>
                            setFormData((prev) => ({ ...prev, selectedPlace: place }))
                        }
                    />
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
