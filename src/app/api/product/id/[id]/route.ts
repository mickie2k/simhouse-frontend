import { NextRequest, NextResponse } from "next/server";
import { generateMockProducts } from "@/lib/mockData";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const { id } = await params;
        const productId = parseInt(id);

        // Get all products
        const allProducts = generateMockProducts(100);

        // Find the specific product
        const product = allProducts.find((p) => p.SimID === productId);

        if (!product) {
            return NextResponse.json(
                { success: false, error: "Product not found" },
                { status: 404 },
            );
        }

        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 200));

        // Return product directly (matching frontend expectations)
        return NextResponse.json(product);
    } catch (error) {
        console.error("Mock API Error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch product" },
            { status: 500 },
        );
    }
}
