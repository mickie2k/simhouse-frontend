"use client";

import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";
import { Product } from "@/types";
import { useState } from "react";
import { mapStyle } from "@/lib/simhouse-map-style";

interface ProductsMapProps {
    products: Product[];
    hoveredProductId: number | null;
    onMarkerHover: (productId: number | null) => void;
}

export default function ProductsMap({
    products,
    hoveredProductId,
    onMarkerHover
}: ProductsMapProps) {
    const [selectedProduct, setSelectedProduct] = useState<number | null>(null);

    // Calculate center point from all products
    const center = products.length > 0
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
        <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
            <Map
                mapId='5a706ca271cb9131ddb9311c'
                defaultCenter={center}
                defaultZoom={11}
                gestureHandling={'greedy'}
                disableDefaultUI={true}
                className="h-full w-full border-0"
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
                            onClick={() => setSelectedProduct(product.id)}
                            onMouseEnter={() => onMarkerHover(product.id)}
                            onMouseLeave={() => onMarkerHover(null)}
                            zIndex={isHovered || isSelected ? 1000 : 1}
                        >
                            <div
                                className={`px-2.5 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all cursor-pointer border 
                                focus:text-white hover:shadow-lg hover:scale-110 
                                bg-white text-gray-900 shadow-md border-gray-200'
                                ${isSelected ? 'bg-gray-900 text-white border-gray-900' : ''}`}
                            >
                                ${product.pricePerHour.toLocaleString()}
                            </div>
                        </AdvancedMarker>
                    );
                })}
            </Map>
        </APIProvider>
    );
}
