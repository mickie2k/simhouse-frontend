import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        // Check for refresh token
        const refreshToken = request.cookies.get("refreshToken");

        if (!refreshToken) {
            return NextResponse.json(
                { success: false, error: "No refresh token" },
                { status: 401 },
            );
        }

        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 300));

        // Generate new tokens
        const newAccessToken = "mock_jwt_token_" + Date.now();
        const newRefreshToken = "mock_refresh_token_" + Date.now();

        const response = NextResponse.json({
            success: true,
            message: "Token refreshed",
        });

        // Set new cookies
        response.cookies.set("accessToken", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 15 * 60,
        });

        response.cookies.set("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60,
        });

        return response;
    } catch (error) {
        console.error("Mock API Error:", error);
        return NextResponse.json(
            { success: false, error: "Token refresh failed" },
            { status: 500 },
        );
    }
}
