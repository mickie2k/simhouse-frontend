"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, ChevronDown, Calendar, Flag, Car, List, ChevronLeft, ChevronRight } from "lucide-react";
import PlaceAutocomplete from "./PlaceAutocomplete";
import { CalendarCell, toLocalDateStr, isSameDay } from "@/components/ui/CalendarCell";
import type { SelectedPlace } from "@/types";

type SearchFormData = {
    selectedPlace: SelectedPlace | null;
    simTypeId: string;
    date: string;
};

interface SearchBoxProps {
    compact?: boolean;
}

const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];
const DAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

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

    // Calendar state
    const today = new Date();
    const [calYear, setCalYear] = useState(today.getFullYear());
    const [calMonth, setCalMonth] = useState(today.getMonth()); // 0-indexed

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

    // Calendar helpers
    const prevMonth = () => {
        if (calMonth === 0) {
            setCalYear((y) => y - 1);
            setCalMonth(11);
        } else {
            setCalMonth((m) => m - 1);
        }
    };

    const nextMonth = () => {
        if (calMonth === 11) {
            setCalYear((y) => y + 1);
            setCalMonth(0);
        } else {
            setCalMonth((m) => m + 1);
        }
    };

    // Generate calendar cells
    const firstDay = new Date(calYear, calMonth, 1).getDay();
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    const calCells: (number | null)[] = [
        ...Array(firstDay).fill(null),
        ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ];
    while (calCells.length % 7 !== 0) calCells.push(null);

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
                                {formData.date ? new Date(formData.date).toLocaleDateString("en-US", {
                                    year: "numeric" as const,
                                    month: "short" as const, // 'short' gives you the abbreviated month name
                                    day: "numeric" as const,
                                }) : "Add dates"}
                            </span>
                        </div>
                    </div>
                    {isDateOpen && (
                        <div className="absolute right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 p-4 w-80">
                            {/* Month Navigation */}
                            <div className="flex items-center justify-between mb-4">
                                <button
                                    onClick={prevMonth}
                                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                                    aria-label="Previous month"
                                >
                                    <ChevronLeft size={16} className="text-gray-600" />
                                </button>
                                <span className="text-sm font-semibold text-black2">
                                    {MONTH_NAMES[calMonth]} {calYear}
                                </span>
                                <button
                                    onClick={nextMonth}
                                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                                    aria-label="Next month"
                                >
                                    <ChevronRight size={16} className="text-gray-600" />
                                </button>
                            </div>

                            {/* Day Headers */}
                            <div className="grid grid-cols-7 mb-2">
                                {DAY_LABELS.map((d) => (
                                    <div key={d} className="text-center text-xs font-medium text-gray-500 py-2">
                                        {d}
                                    </div>
                                ))}
                            </div>

                            {/* Calendar Grid */}
                            <div className="grid grid-cols-7 gap-1">
                                {calCells.map((day, idx) => {
                                    const isPast = day !== null && new Date(calYear, calMonth, day) < new Date(today.getFullYear(), today.getMonth(), today.getDate());
                                    return (
                                        <CalendarCell
                                            key={day === null ? `empty-${idx}` : toLocalDateStr(new Date(calYear, calMonth, day))}
                                            day={day}
                                            idx={idx}
                                            year={calYear}
                                            month={calMonth}
                                            selectedDate={formData.date}
                                            today={today}
                                            size="md"
                                            disabled={isPast}
                                            onSelectDate={(dateStr) => {
                                                setFormData({ ...formData, date: dateStr });
                                                setIsDateOpen(false);
                                            }}
                                        />
                                    );
                                })}
                            </div>
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
                    <label className="block text-xs font-bold text-gray-900 mb-3">
                        Date
                    </label>

                    {/* Month Navigation */}
                    <div className="flex items-center justify-between mb-3">
                        <button
                            onClick={prevMonth}
                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                            aria-label="Previous month"
                        >
                            <ChevronLeft size={16} className="text-gray-600" />
                        </button>
                        <span className="text-sm font-semibold text-black2">
                            {MONTH_NAMES[calMonth]} {calYear}
                        </span>
                        <button
                            onClick={nextMonth}
                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                            aria-label="Next month"
                        >
                            <ChevronRight size={16} className="text-gray-600" />
                        </button>
                    </div>

                    {/* Day Headers */}
                    <div className="grid grid-cols-7 mb-2">
                        {DAY_LABELS.map((d) => (
                            <div key={d} className="text-center text-xs font-medium text-gray-500 py-2">
                                {d}
                            </div>
                        ))}
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-1">
                        {calCells.map((day, idx) => {
                            const isPast = day !== null && new Date(calYear, calMonth, day) < new Date(today.getFullYear(), today.getMonth(), today.getDate());
                            return (
                                <CalendarCell
                                    key={day === null ? `empty-${idx}` : toLocalDateStr(new Date(calYear, calMonth, day))}
                                    day={day}
                                    idx={idx}
                                    year={calYear}
                                    month={calMonth}
                                    selectedDate={formData.date}
                                    today={today}
                                    size="sm"
                                    disabled={isPast}
                                    onSelectDate={(dateStr) => {
                                        setFormData({ ...formData, date: dateStr });
                                    }}
                                />
                            );
                        })}
                    </div>
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
