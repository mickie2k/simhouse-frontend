import { NextRequest, NextResponse } from "next/server";
import { mockProducts, generateMockProducts } from "@/lib/mockData";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const limit = parseInt(searchParams.get("limit") || "30");
        const page = parseInt(searchParams.get("page") || "1");

        // Generate enough products to handle pagination
        const allProducts = generateMockProducts(100);

        // Calculate pagination
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedProducts = allProducts.slice(startIndex, endIndex);

        // Simulate network delay for realism
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
