/**
 * My Simulators (Light) page route
 * Displays all simulators owned by the host
 */
import MySimulators from "@/components/hostDashboard/MySimulators";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "My Simulators",
    description: "Manage your simulator listings and schedules",
};

export default async function HostingPage() {
    // Get user session
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    if (!token) {
        redirect("/login");
    }

    // Fetch host's simulators
    // TODO: Replace with actual API endpoint for host's simulators (e.g., /product/host/:id)
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}product/host/:id`, {
        method: "GET",
        cache: "no-store",
    });

    if (!res.ok) {
        // Throw error to trigger error boundary
        throw new Error("Failed to fetch simulators");
    }

    const simulators = await res.json();

    return <MySimulators simulators={simulators} />;
}
