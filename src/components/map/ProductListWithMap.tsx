"use client";

import { Product } from "@/types";
import ProductCard from "@/components/product/ProductCard";
import ProductsMap from "@/components/map/ProductsMap";
import { useState } from "react";
import PaginationSection from "../pagination/PaginationSection";

interface ProductListWithMapProps {
    products: Product[];
    title?: string;
    page?: number;
    totalPages?: number;
    lat?: number;
    lng?: number;
}

export default function ProductListWithMap({
    products,
    title = "All Simulators",
    page,
    totalPages,
    lat,
    lng,
}: ProductListWithMapProps) {
    const [hoveredProductId, setHoveredProductId] = useState<number | null>(null);

    return (
        <div className="flex h-[calc(100vh-80px)] w-full">
            {/* Left side - Product list */}
            <div className="w-1/2 px-12 py-6 overflow-y-auto no-scrollbar">
                <h2 className="text-3xl font-bold mb-6 relative top-0 bg-white z-10 py-2">
                    {title}
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            onMouseEnter={() => setHoveredProductId(product.id)}
                            onMouseLeave={() => setHoveredProductId(null)}
                            className="transition-transform hover:scale-[1.02]"
                        >
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
                {products.length === 0 && (
                    <div className="text-center text-gray-500 py-12">
                        <p>No simulators found</p>
                    </div>
                )}
                {page && totalPages && (
                    <PaginationSection currentPage={page} totalPages={totalPages} basePath="/page" />
                )}
            </div>

            {/* Right side - Map (sticky) */}
            <div className="w-1/2 sticky top-0 h-full overflow-hidden pr-12 py-6">
                <div className="rounded-xl overflow-hidden h-full w-full">
                    <ProductsMap
                        products={products}
                        hoveredProductId={hoveredProductId}
                        onMarkerHover={setHoveredProductId}
                        lat={lat}
                        lng={lng}
                    />
                </div>
            </div>
        </div>
    );
}
