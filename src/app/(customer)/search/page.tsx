import { Product, PaginatedResponse } from "@/types";
import ProductListWithMap from "@/components/map/ProductListWithMap";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Browse Simulators",
    description: "Explore our collection of racing simulators",
};

export default async function Page({ params }: { params: Promise<{ page: number }> }) {
    const { page } = await params;

    const res = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "simulator?limit=30&page=" + page,
        {
            next: { revalidate: 300 }, // Revalidate every 5 minutes
        }
    );
    if (!res.ok) {
        throw new Error("Failed to fetch products");
    }
    const paginatedProducts: PaginatedResponse<Product> = await res.json();
    const products: Product[] = paginatedProducts.data;

    return (
        <main className="w-full">
            <ProductListWithMap products={products} title="All Simulators" />
        </main>
    );
}
