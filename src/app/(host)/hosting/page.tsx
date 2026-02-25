"use client";
import MySimulators from "@/components/hostDashboard/MySimulators";
import { axiosJWTInstance } from "@/lib/http";
import { useEffect, useState } from "react";
import LoadingComponent from "@/components/loading/LoadingComponent";
import type { Product } from "@/types";

export default function HostingPage() {
    const [simulators, setSimulators] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSimulators = async () => {
            try {
                // TODO: Replace with actual API endpoint for host's simulators (e.g., /product/host/:id)
                const response = await axiosJWTInstance.get<Product[]>("product/host/:id");
                setSimulators(response.data);
            } catch (error) {
                console.error("Failed to fetch simulators:", error);
                setSimulators([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSimulators();
    }, []);

    if (isLoading) {
        return <LoadingComponent />;
    }

    return <MySimulators simulators={simulators} />;
}
