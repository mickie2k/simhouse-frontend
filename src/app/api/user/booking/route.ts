import { NextRequest, NextResponse } from "next/server";
import { mockBookings } from "@/lib/mockData";

export async function GET(request: NextRequest) {
    try {
        // Check for authentication cookie
        const isAuth = request.cookies.get("isAuth");

        if (!isAuth || isAuth.value !== "true") {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 },
            );
        }

        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 400));

        // Return mock bookings for the authenticated user
        return NextResponse.json(mockBookings);
    } catch (error) {
        console.error("Mock API Error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch bookings" },
            { status: 500 },
        );
    }
}
