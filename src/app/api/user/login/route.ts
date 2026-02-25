import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password } = body;

        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Mock validation - accept any email/password for demo
        if (!email || !password) {
            return NextResponse.json(
                { success: false, error: "Email and password are required" },
                { status: 400 },
            );
        }

        // Mock successful login
        const mockUser = {
            id: 1,
            email: email,
            firstName: "John",
            lastName: "Doe",
            role: "customer",
        };

        const mockToken = "mock_jwt_token_" + Date.now();
        const mockRefreshToken = "mock_refresh_token_" + Date.now();

        // Set HTTP-only cookies
        const response = NextResponse.json({
            success: true,
            message: "Login successful",
            data: {
                user: mockUser,
            },
        });

        // Set cookies (simulating the backend behavior)
        response.cookies.set("accessToken", mockToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 15 * 60, // 15 minutes
        });

        response.cookies.set("refreshToken", mockRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60, // 7 days
        });

        response.cookies.set("isAuth", "true", {
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60,
        });

        return response;
    } catch (error) {
        console.error("Mock API Error:", error);
        return NextResponse.json(
            { success: false, error: "Login failed" },
            { status: 500 },
        );
    }
}
