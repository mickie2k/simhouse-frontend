import { NextRequest, NextResponse } from "next/server";
import { mockBookings } from "@/lib/mockData";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const { id } = await params;
        const bookingId = parseInt(id);

        // Check authentication
        const isAuth = request.cookies.get("isAuth");
        if (!isAuth || isAuth.value !== "true") {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 },
            );
        }

        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 300));

        // Find booking
        const booking = mockBookings.find((b) => b.BookingID === bookingId);

        if (!booking) {
            return NextResponse.json(
                { success: false, error: "Booking not found" },
                { status: 404 },
            );
        }

        // Return booking directly (matching frontend expectations)
        return NextResponse.json(booking);
    } catch (error) {
        console.error("Mock API Error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch booking" },
            { status: 500 },
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const { id } = await params;
        const bookingId = parseInt(id);

        // Check authentication
        const isAuth = request.cookies.get("isAuth");
        if (!isAuth || isAuth.value !== "true") {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 },
            );
        }

        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 400));

        // Find booking
        const bookingIndex = mockBookings.findIndex(
            (b) => b.BookingID === bookingId,
        );

        if (bookingIndex === -1) {
            return NextResponse.json(
                { success: false, error: "Booking not found" },
                { status: 404 },
            );
        }

        // Update status to cancelled (StatusID: 4 = Cancelled)
        mockBookings[bookingIndex].StatusID = 4;
        mockBookings[bookingIndex].Statusname = "Cancelled";

        return NextResponse.json({
            success: true,
            message: "Booking cancelled successfully",
            data: mockBookings[bookingIndex],
        });
    } catch (error) {
        console.error("Mock API Error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to cancel booking" },
            { status: 500 },
        );
    }
}
