import { Product, PaginatedResponse } from "@/types";
import ProductListWithMap from "@/components/map/ProductListWithMap";
import type { Metadata } from "next";
import { normalizePaginatedProducts } from "@/lib/products";

export const metadata: Metadata = {
    title: "Browse Simulators",
    description: "Explore our collection of racing simulators",
};

export default async function Page() {

    const res = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "simulator?limit=30",
        {
            next: { revalidate: 300 }, // Revalidate every 5 minutes
        }
    );
    if (!res.ok) {
        throw new Error("Failed to fetch products");
    }
    const payload: PaginatedResponse<Product> = await res.json();
    const products: Product[] = normalizePaginatedProducts(payload).data;

    return (
        <main className="w-full">
            <ProductListWithMap products={products} title="All Simulators" />
        </main>
    );
}
