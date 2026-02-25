"use client";

import { APIProvider, Map, AdvancedMarker, Pin } from "@vis.gl/react-google-maps";
import { Product } from "@/types";
import { useState } from "react";

interface ProductMapProps {
    products: Product[];
    hoveredProductId: number | null;
    onMarkerHover: (productId: number | null) => void;
}

export default function ProductMap({
    products,
    hoveredProductId,
    onMarkerHover
}: ProductMapProps) {
    const [selectedProduct, setSelectedProduct] = useState<number | null>(null);

    // Calculate center point from all products
    const center = products.length > 0
        ? {
            lat: products.reduce((sum, p) => sum + p.Lat, 0) / products.length,
            lng: products.reduce((sum, p) => sum + p.Long, 0) / products.length,
        }
        : { lat: 13.7563, lng: 100.5018 }; // Default to Bangkok

    if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
        return (
            <div className="h-full w-full flex items-center justify-center bg-gray-100">
                <p className="text-gray-500">Map unavailable - API key not configured</p>
            </div>
        );
    }

    return (
        <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
            <Map
                mapId="simhouse-map"
                defaultCenter={center}
                defaultZoom={12}
                gestureHandling="greedy"
                disableDefaultUI={false}
                className="h-full w-full"
            >
                {products.map((product) => {
                    const isHovered = hoveredProductId === product.SimID;
                    const isSelected = selectedProduct === product.SimID;

                    return (
                        <AdvancedMarker
                            key={product.SimID}
                            position={{ lat: product.Lat, lng: product.Long }}
                            onClick={() => setSelectedProduct(product.SimID)}
                            onMouseEnter={() => onMarkerHover(product.SimID)}
                            onMouseLeave={() => onMarkerHover(null)}
                        >
                            <div className="relative">
                                <Pin
                                    background={isHovered || isSelected ? "#000000" : "#6366f1"}
                                    borderColor={isHovered || isSelected ? "#000000" : "#4f46e5"}
                                    glyphColor="#ffffff"
                                    scale={isHovered || isSelected ? 1.4 : 1.2}
                                />
                                {/* Price badge */}
                                <div
                                    className={`absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${isHovered || isSelected
                                            ? 'bg-black text-white scale-110'
                                            : 'bg-white text-gray-800 shadow-md'
                                        }`}
                                >
                                    ฿{product.PricePerHour}/hr
                                </div>
                            </div>
                        </AdvancedMarker>
                    );
                })}
            </Map>
        </APIProvider>
    );
}
