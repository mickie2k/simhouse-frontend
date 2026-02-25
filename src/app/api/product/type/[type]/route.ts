import { NextRequest, NextResponse } from "next/server";
import { generateMockProducts } from "@/lib/mockData";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ type: string }> },
) {
    try {
        const { type } = await params;
        const searchParams = request.nextUrl.searchParams;
        const limit = parseInt(searchParams.get("limit") || "30");
        const page = parseInt(searchParams.get("page") || "1");
        const modId = parseInt(type);

        // Get all products and filter by ModID (using ModID as type identifier)
        const allProducts = generateMockProducts(100);
        const filteredProducts = allProducts.filter((p) => p.ModID === modId);

        // Calculate pagination
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 300));

        // Return products array directly (matching frontend expectations)
        return NextResponse.json(paginatedProducts);
    } catch (error) {
        console.error("Mock API Error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch products" },
            { status: 500 },
        );
    }
}
