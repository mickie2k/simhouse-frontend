import { NextRequest, NextResponse } from "next/server";
import { mockSchedules } from "@/lib/mockData";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const { id } = await params;
        const searchParams = request.nextUrl.searchParams;
        const date = searchParams.get("date");
        const simId = parseInt(id);

        if (!date) {
            return NextResponse.json(
                { success: false, error: "Date parameter is required" },
                { status: 400 },
            );
        }

        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 300));

        // Find schedule for the specific simulator and date
        const schedule = mockSchedules.find(
            (s) => s.SimID === simId && s.date === date,
        );

        if (!schedule) {
            // Return empty schedule if not found
            return NextResponse.json({
                SimID: simId,
                date: date,
                availableSlots: [],
            });
        }

        // Return schedule directly (matching frontend expectations)
        return NextResponse.json(schedule);
    } catch (error) {
        console.error("Mock API Error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch schedule" },
            { status: 500 },
        );
    }
}
