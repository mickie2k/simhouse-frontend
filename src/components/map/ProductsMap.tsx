"use client";

import { Map, AdvancedMarker } from "@vis.gl/react-google-maps";
import { Product } from "@/types";
import { useState } from "react";
import { mapStyle } from "@/lib/simhouse-map-style";
import Image from "next/image";
import Link from "next/link";

interface ProductsMapProps {
    products: Product[];
    hoveredProductId: number | null;
    onMarkerHover: (productId: number | null) => void;
    lat?: number;
    lng?: number;
}

export default function ProductsMap({
    products,
    hoveredProductId,
    onMarkerHover,
    lat,
    lng,
}: ProductsMapProps) {
    const [selectedProduct, setSelectedProduct] = useState<number | null>(null);

    // Use provided lat/lng params, otherwise calculate center from products, then fall back to Bangkok
    const center = (lat !== undefined && lng !== undefined)
        ? { lat, lng }
        : products.length > 0
            ? {
                lat: products.reduce((sum, p) => sum + p.latitude, 0) / products.length,
                lng: products.reduce((sum, p) => sum + p.longitude, 0) / products.length,
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
        <Map
            mapId='5a706ca271cb9131ddb9311c'
            defaultCenter={center}
            defaultZoom={11}
            gestureHandling={'greedy'}
            disableDefaultUI={true}
            className="h-full w-full border-0"
            onClick={() => setSelectedProduct(null)}
        >
            {products.map((product) => {
                const isHovered = hoveredProductId === product.id;
                const isSelected = selectedProduct === product.id;
                const lat = product.latitude;
                const lng = product.longitude;
                return (
                    <AdvancedMarker
                        key={product.id}
                        position={{ lat, lng } as google.maps.LatLngLiteral}
                        onClick={() => setSelectedProduct(isSelected ? null : product.id)}
                        onMouseEnter={() => onMarkerHover(product.id)}
                        onMouseLeave={() => onMarkerHover(null)}
                        zIndex={isSelected ? 2000 : isHovered ? 1000 : 1}
                    >
                        <div className="relative flex flex-col items-center">
                            {/* Popover card */}
                            {isSelected && (
                                <div
                                    className="absolute bottom-12 left-1/2 -translate-x-1/2 w-56 bg-white rounded-2xl shadow-2xl overflow-hidden"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <Link href={`/product/${product.id}`}>
                                        {/* Image */}
                                        <div className="relative h-36 w-full">
                                            <Image
                                                src={product.firstImage}
                                                fill
                                                alt={product.simListName}
                                                className="object-cover"
                                                sizes="224px"
                                            />
                                            {/* Close button */}
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    setSelectedProduct(null);
                                                }}
                                                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:scale-110 transition-transform"
                                                aria-label="Close"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <line x1="18" y1="6" x2="6" y2="18" />
                                                    <line x1="6" y1="6" x2="18" y2="18" />
                                                </svg>
                                            </button>
                                        </div>
                                        {/* Details */}
                                        <div className="p-3">
                                            <p className="font-semibold text-sm text-gray-900 truncate">{product.simListName}</p>
                                            {product.mod && (
                                                <p className="text-xs text-gray-500 truncate mt-0.5">
                                                    {product.mod.modelName}&nbsp;·&nbsp;{product.mod.brand?.brandName}
                                                </p>
                                            )}
                                            <p className="font-bold text-sm text-gray-900 mt-1.5">
                                                ฿{product.pricePerHour.toLocaleString()}
                                                <span className="font-normal text-gray-500 text-xs">/hr</span>
                                            </p>
                                        </div>
                                    </Link>
                                </div>
                            )}
                            {/* Price pill marker */}
                            <div
                                className={`px-2.5 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all cursor-pointer border ${isSelected
                                    ? 'bg-gray-900 text-white border-gray-900 shadow-lg'
                                    : isHovered
                                        ? 'bg-gray-900 text-white border-gray-900 shadow-lg scale-110'
                                        : 'bg-white text-gray-900 shadow-md hover:shadow-lg border-gray-200 hover:scale-110'
                                    }`}
                            >
                                ฿{product.pricePerHour.toLocaleString()}
                            </div>
                        </div>
                    </AdvancedMarker>
                );
            })}
        </Map>
    );
}
