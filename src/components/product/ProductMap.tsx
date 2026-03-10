"use client";
import { Marker, APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";
export default function ProductMap({
	lat,
	lng,
	hostid,
}: {
	lat: number;
	lng: number;
	hostid: number;
}) {
	const latitude = parseFloat(lat as unknown as string);
	const longitude = parseFloat(lng as unknown as string);
	return (
		<APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}>
			<Map
				mapId='5a706ca271cb9131ddb9311c'
				gestureHandling={'greedy'}
				className="h-[50vh] w-full border-0"
				defaultZoom={13}
				defaultCenter={{ lat: latitude, lng: longitude }}
			>
				<AdvancedMarker
					clickable={true}
					position={{ lat: latitude, lng: longitude }}
				></AdvancedMarker>
			</Map>
		</APIProvider>
	);
}
