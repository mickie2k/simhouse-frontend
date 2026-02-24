"use client";

import { Product } from "@/types";
import SimulatorHostCard from "./SimulatorHostCard";
import Link from "next/link";
import { FiPlus } from "react-icons/fi";
import { useState } from "react";

type MySimulatorsProps = {
    simulators: Product[];
};

type FilterType = "all" | "active" | "offline" | "drafts";

const MySimulators = ({ simulators }: MySimulatorsProps) => {
    const [activeFilter, setActiveFilter] = useState<FilterType>("all");

    const filters: { id: FilterType; label: string }[] = [
        { id: "all", label: "All Rigs" },
        { id: "active", label: "Active" },
        { id: "offline", label: "Offline" },
        { id: "drafts", label: "Drafts" },
    ];

    // Filter simulators based on active filter
    const filteredSimulators =
        activeFilter === "all"
            ? simulators
            : simulators.filter((sim) => {
                // TODO: Add actual status filtering when backend supports it
                // For now, show all simulators for any filter
                return true;
            });

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Header */}
                <h1 className="text-3xl font-bold text-black2 mb-6">My Simulators</h1>

                {/* Filter Tabs */}
                <div className="flex gap-3 mb-8">
                    {filters.map((filter) => (
                        <button
                            key={filter.id}
                            onClick={() => setActiveFilter(filter.id)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeFilter === filter.id
                                    ? "bg-black text-white"
                                    : "bg-white border border-borderColor1 text-secondText hover:border-black"
                                }`}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>

                {/* Simulators Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {/* Add New Simulator Card */}
                    <Link
                        href="/hosting/simulator/new"
                        className="flex flex-col items-center justify-center border-2 border-dashed border-borderColor1 rounded-xl hover:border-black transition-colors bg-gray-50 hover:bg-gray-100 min-h-[320px]"
                    >
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                            <FiPlus className="w-8 h-8 text-gray-600" />
                        </div>
                        <h3 className="text-base font-semibold text-black2 mb-1">
                            Add New Simulator
                        </h3>
                        <p className="text-sm text-secondText text-center px-4">
                            List a new simulator to earn more.
                        </p>
                    </Link>

                    {/* Simulator Cards */}
                    {filteredSimulators.map((simulator) => (
                        <SimulatorHostCard key={simulator.SimID} product={simulator} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MySimulators;
