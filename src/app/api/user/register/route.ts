import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password, firstName, lastName } = body;

        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Mock validation
        if (!email || !password || !firstName || !lastName) {
            return NextResponse.json(
                { success: false, error: "All fields are required" },
                { status: 400 },
            );
        }

        // Check if email is already "registered" (for demo, reject specific emails)
        if (email === "existing@example.com") {
            return NextResponse.json(
                { success: false, error: "Email already exists" },
                { status: 409 },
            );
        }

        // Mock successful registration
        const mockUser = {
            id: Math.floor(Math.random() * 10000),
            email,
            firstName,
            lastName,
            role: "customer",
        };

        return NextResponse.json({
            success: true,
            message: "Registration successful",
            data: {
                user: mockUser,
            },
        });
    } catch (error) {
        console.error("Mock API Error:", error);
        return NextResponse.json(
            { success: false, error: "Registration failed" },
            { status: 500 },
        );
    }
}
