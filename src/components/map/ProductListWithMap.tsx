"use client";

import { Product } from "@/types";
import ProductCard from "@/components/product/ProductCard";
import ProductMap from "@/components/map/ProductMap";
import { useState } from "react";

interface ProductListWithMapProps {
    products: Product[];
    title?: string;
}

export default function ProductListWithMap({
    products,
    title = "All Simulators"
}: ProductListWithMapProps) {
    const [hoveredProductId, setHoveredProductId] = useState<number | null>(null);

    return (
        <div className="flex h-[calc(100vh-64px)] w-full">
            {/* Left side - Product list */}
            <div className="w-1/2 overflow-y-auto px-8 py-6">
                <h2 className="text-3xl font-bold mb-6 sticky top-0 bg-white z-10 py-2">
                    {title}
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
                    {products.map((product) => (
                        <div
                            key={product.SimID}
                            onMouseEnter={() => setHoveredProductId(product.SimID)}
                            onMouseLeave={() => setHoveredProductId(null)}
                            className="transition-transform hover:scale-105"
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
            </div>

            {/* Right side - Map (sticky) */}
            <div className="w-1/2 sticky top-0 h-full">
                <ProductMap
                    products={products}
                    hoveredProductId={hoveredProductId}
                    onMarkerHover={setHoveredProductId}
                />
            </div>
        </div>
    );
}
