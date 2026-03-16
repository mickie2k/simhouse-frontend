"use client";

import { useEffect, useState } from "react";
import PlaceAutocomplete from "./PlaceAutocomplete";
import { APIProvider } from "@vis.gl/react-google-maps";
export default function TestSearch() {
    const [selectedPlace, setSelectedPlace] =
        useState<google.maps.places.PlaceResult | null>(null);

    useEffect(() => {
        console.log("Selected place:", selectedPlace);
    }, [selectedPlace]);

    return (
        <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}>
            <PlaceAutocomplete onPlaceSelect={setSelectedPlace} />
        </APIProvider>
    )

}