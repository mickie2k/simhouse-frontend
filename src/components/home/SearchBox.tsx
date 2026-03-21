"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, ChevronDown, Calendar, Flag, Car, List } from "lucide-react";
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
    const searchParams = useSearchParams();

    const [formData, setFormData] = useState<SearchFormData>(() => ({
        selectedPlace: null,
        simTypeId: searchParams.get("simTypeIds") ?? "",
        date: searchParams.get("startDate") ?? "",
    }));

    // Keep form in sync when URL params change (e.g. after navigation)
    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            simTypeId: searchParams.get("simTypeIds") ?? "",
            date: searchParams.get("startDate") ?? "",
        }));
    }, [searchParams]);

    const [isTypeOpen, setIsTypeOpen] = useState(false);
    const [isDateOpen, setIsDateOpen] = useState(false);
    const typeRef = useRef<HTMLDivElement>(null);
    const dateRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (typeRef.current && !typeRef.current.contains(e.target as Node)) {
                setIsTypeOpen(false);
            }
            if (dateRef.current && !dateRef.current.contains(e.target as Node)) {
                setIsDateOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const typeOptions = [
        { value: "", label: "All Types", icon: <List size={18} className="text-gray-600" /> },
        { value: "1", label: "Formula 1", icon: <Flag size={18} className="text-red-500" /> },
        { value: "2", label: "GT Racing", icon: <Car size={18} className="text-blue-500" /> },
    ];


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



    const fieldPadding = compact ? "px-3 py-1.5" : "px-6 py-4";

    return (
        <div className={compact ? "w-full" : "w-full max-w-4xl mt-8 mx-auto sm:mx-0"}>
            <div className="hidden bg-white rounded-full  border border-gray-200 md:flex items-center hover:shadow-2xl transition-shadow">
                {/* Where (Location) Field */}
                <div className={`flex-1 ${fieldPadding} border-r border-gray-200 min-w-0`}>
                    <div className="ml-3">
                        {!compact && (
                            <label className="block text-xs font-bold text-gray-900 mb-1">Where</label>
                        )}
                        <PlaceAutocomplete
                            onPlaceSelect={(place) =>
                                setFormData((prev) => ({ ...prev, selectedPlace: place }))
                            }
                            initialValue={searchParams.get("locationName") ?? ""}
                        />
                    </div>
                </div>

                {/* Type Field */}
                <div ref={typeRef} className="relative flex-1 border-r border-gray-200 min-w-0">
                    <div
                        className={`${fieldPadding} cursor-pointer`}
                        onClick={() => setIsTypeOpen((o) => !o)}
                    >
                        {!compact && (
                            <label className="block text-xs font-bold text-gray-900 mb-1 cursor-pointer">Type</label>
                        )}
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">
                                {typeOptions.find((o) => o.value === formData.simTypeId)?.label ?? "All Types"}
                            </span>
                            <ChevronDown size={14} className="text-gray-400 ml-2 flex-shrink-0" />
                        </div>
                    </div>
                    {isTypeOpen && (
                        <ul className="absolute left-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 py-2">
                            <li className="px-4 pt-2 pb-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                Simulator type
                            </li>
                            {typeOptions.map((opt) => (
                                <li
                                    key={opt.value}
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={() => {
                                        setFormData({ ...formData, simTypeId: opt.value });
                                        setIsTypeOpen(false);
                                    }}
                                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer"
                                >
                                    <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                                        {opt.icon}
                                    </div>
                                    <span className="text-sm font-semibold text-gray-900">{opt.label}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Date Field */}
                <div ref={dateRef} className="relative flex-1 min-w-0">
                    <div
                        className={`${fieldPadding} cursor-pointer`}
                        onClick={() => setIsDateOpen((o) => !o)}
                    >
                        {!compact && (
                            <label className="block text-xs font-bold text-gray-900 mb-1 cursor-pointer">Date</label>
                        )}
                        <div className="flex items-center justify-between">
                            <span className={`text-sm ${formData.date ? "text-gray-700" : "text-gray-400"}`}>
                                {formData.date || "Add dates"}
                            </span>
                            <Calendar size={14} className="text-gray-400 ml-2 flex-shrink-0" />
                        </div>
                    </div>
                    {isDateOpen && (
                        <div className="absolute right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 p-4 min-w-[220px]">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Pick a date</p>
                            <input
                                type="date"
                                value={formData.date}
                                onChange={(e) => {
                                    setFormData({ ...formData, date: e.target.value });
                                    setIsDateOpen(false);
                                }}
                                min={new Date().toISOString().split("T")[0]}
                                className="w-full text-sm text-gray-700 border border-gray-200 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-primary1 [color-scheme:light]"
                                autoFocus
                            />
                        </div>
                    )}
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
                        initialValue={searchParams.get("locationName") ?? ""}
                    />
                </div>

                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
                    <label className="block text-xs font-bold text-gray-900 mb-2">
                        Type
                    </label>
                    <div className="space-y-1">
                        {typeOptions.map((opt) => (
                            <button
                                key={opt.value}
                                onClick={() => setFormData({ ...formData, simTypeId: opt.value })}
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors ${formData.simTypeId === opt.value
                                    ? "bg-orange-50 text-primary1"
                                    : "hover:bg-gray-50 text-gray-700"
                                    }`}
                            >
                                <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                                    {opt.icon}
                                </div>
                                <span className="text-sm font-medium">{opt.label}</span>
                                {formData.simTypeId === opt.value && (
                                    <div className="ml-auto w-2 h-2 rounded-full bg-primary1" />
                                )}
                            </button>
                        ))}
                    </div>
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
