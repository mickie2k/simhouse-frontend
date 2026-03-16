"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import PlaceAutocomplete from "./PlaceAutocomplete";


type SearchFormData = {
    location: string | null;
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
    const [selectedPlace, setSelectedPlace] =
        useState<google.maps.places.PlaceResult | null>(null);

    useEffect(() => {
        console.log("Selected place:", selectedPlace);
    }, [selectedPlace]);



    const handleSearch = () => {
        // Build query parameters
        const params = new URLSearchParams();

        // Handle location data
        if (formData.location) {
            params.set("location", formData.location);
        }

        if (formData.simTypeId) {
            params.set("simTypeIds", formData.simTypeId);
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



    return (
        <div className="w-full max-w-4xl mt-8 mx-auto sm:mx-0">
            <div className="hidden bg-white rounded-full shadow-xl border border-gray-200 md:flex items-center overflow-hidden hover:shadow-2xl transition-shadow">
                {/* Where (Location) Field */}
                <div className="flex-1 px-6 py-4 border-r border-gray-200 min-w-0">
                    <label className="block text-xs font-bold text-gray-900 mb-1">
                        Where
                    </label>
                    <div className="autocomplete-control">
                        <PlaceAutocomplete onPlaceSelect={setSelectedPlace} />
                    </div>
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
