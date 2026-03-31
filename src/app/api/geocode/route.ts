import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");

    if (!lat || !lng) {
        return NextResponse.json(
            { error: "lat and lng are required" },
            { status: 400 },
        );
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
        return NextResponse.json(
            { error: "Geocoding not configured" },
            { status: 500 },
        );
    }

    const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`,
    );

    const data = await response.json();

    if (data.results && data.results.length > 0) {
        return NextResponse.json({
            address: data.results[0].formatted_address,
        });
    }

    return NextResponse.json({
        address: `${parseFloat(lat).toFixed(6)}, ${parseFloat(lng).toFixed(6)}`,
    });
}
