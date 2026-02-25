import { NextRequest, NextResponse } from "next/server";
import { mockBookings } from "@/lib/mockData";
import { Booking } from "@/types";

export async function POST(request: NextRequest) {
    try {
        // Check authentication
        const isAuth = request.cookies.get("isAuth");
        if (!isAuth || isAuth.value !== "true") {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 },
            );
        }

        const body = await request.json();
        const { SimID, date, startTime, endTime, totalPrice } = body;

        // Validation
        if (!SimID || !date || !startTime || !endTime || !totalPrice) {
            return NextResponse.json(
                { success: false, error: "All booking details are required" },
                { status: 400 },
            );
        }

        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Create mock booking (note: Booking type doesn't store StartTime/EndTime separately)
        // These would typically be stored in Schedule records
        const newBooking: Booking = {
            BookingID: mockBookings.length + 1,
            SimID: parseInt(SimID),
            CustomerID: 1,
            BookingDate: date,
            StatusID: 1,
            Statusname: "Confirmed",
            TotalPrice: parseFloat(totalPrice),
            firstimage: "booking_placeholder.jpg",
        };

        // Return the new booking directly (matching frontend expectations)
        return NextResponse.json(newBooking);
    } catch (error) {
        console.error("Mock API Error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to create booking" },
            { status: 500 },
        );
    }
}
