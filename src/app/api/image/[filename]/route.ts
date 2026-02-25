import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ filename: string }> },
) {
    try {
        const { filename } = await params;

        // For mock API, return a placeholder image URL from a public service
        // In production, you would serve actual images
        const placeholderUrl = `https://placehold.co/800x600/4F46E5/FFFFFF/png?text=${encodeURIComponent(filename)}`;

        // Redirect to placeholder image
        return NextResponse.redirect(placeholderUrl);
    } catch (error) {
        console.error("Mock API Error:", error);
        return NextResponse.json(
            { success: false, error: "Image not found" },
            { status: 404 },
        );
    }
}
