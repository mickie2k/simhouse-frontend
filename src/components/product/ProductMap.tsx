"use client";
import { Marker, APIProvider, Map } from "@vis.gl/react-google-maps";
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
				mapId={hostid.toString()}
				style={{ width: "100%", height: "50vh" }}
				defaultZoom={13}
				defaultCenter={{ lat: latitude, lng: longitude }}
			>
				<Marker
					clickable={true}
					position={{ lat: latitude, lng: longitude }}
				></Marker>
			</Map>
		</APIProvider>
	);
}
