
"use client";
import { useEffect, useRef, useState } from "react";
import {
	APIProvider,
	useMapsLibrary,
	useMap,

} from '@vis.gl/react-google-maps';
interface PlaceAutocompleteProps {
	onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
}

export default function PlaceAutocomplete({ onPlaceSelect }: PlaceAutocompleteProps) {
	const [placeAutocomplete, setPlaceAutocomplete] =
		useState<google.maps.places.Autocomplete | null>(null);
	const places = useMapsLibrary('places');
	const inputRef = useRef<HTMLInputElement>(null);
	const map = useMap();

	useEffect(() => {
		if (!places || !inputRef.current) return;

		const options = {
			fields: ['geometry', 'name', 'formatted_address']
		};

		setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options));
		console.log(placeAutocomplete)
	}, [places, map]);

	useEffect(() => {
		if (!placeAutocomplete) return;

		placeAutocomplete.addListener('place_changed', () => {
			onPlaceSelect(placeAutocomplete.getPlace());
		});

	}, [onPlaceSelect, placeAutocomplete]);
	// Create the input HTML element and append it.

	return (
		<div className="autocomplete-container">
			<input type="text" ref={inputRef} />
		</div>
	);
};