import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 300));

        // Clear authentication cookies
        const response = NextResponse.json({
            success: true,
            message: "Logout successful",
        });

        response.cookies.delete("accessToken");
        response.cookies.delete("refreshToken");
        response.cookies.delete("isAuth");

        return response;
    } catch (error) {
        console.error("Mock API Error:", error);
        return NextResponse.json(
            { success: false, error: "Logout failed" },
            { status: 500 },
        );
    }
}
