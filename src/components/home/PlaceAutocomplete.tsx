"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { MapPin, Navigation } from "lucide-react";
import { useAutocompleteSuggestions } from "@/hooks/use-autocomplete-suggestion";
import type { SelectedPlace } from "@/types";

interface PlaceAutocompleteProps {
	onPlaceSelect: (place: SelectedPlace | null) => void;
	placeholder?: string;
	initialValue?: string;
}

export default function PlaceAutocomplete({
	onPlaceSelect,
	placeholder = "Search destinations",
	initialValue = "",
}: PlaceAutocompleteProps) {
	const places = useMapsLibrary("places");
	const [inputValue, setInputValue] = useState(initialValue);
	const [isOpen, setIsOpen] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);

	// Update input value when initialValue prop changes
	useEffect(() => {
		setInputValue(initialValue);
	}, [initialValue]);

	const { suggestions, resetSession } = useAutocompleteSuggestions(inputValue);

	// Close dropdown on outside click
	useEffect(() => {
		function handleClickOutside(e: MouseEvent) {
			if (
				containerRef.current &&
				!containerRef.current.contains(e.target as Node)
			) {
				setIsOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleNearbyClick = useCallback(() => {
		if (!navigator.geolocation) return;
		navigator.geolocation.getCurrentPosition(
			(pos) => {
				setInputValue("Nearby");
				setIsOpen(false);
				resetSession();
				onPlaceSelect({
					name: "Nearby",
					lat: pos.coords.latitude,
					lng: pos.coords.longitude,
				});
			},
			() => {
				setInputValue("Nearby");
				setIsOpen(false);
				resetSession();
				onPlaceSelect(null);
			}
		);
	}, [onPlaceSelect, resetSession]);

	const handleSuggestionClick = useCallback(
		async (suggestion: google.maps.places.AutocompleteSuggestion) => {
			if (!places || !suggestion.placePrediction) return;
			const place = suggestion.placePrediction.toPlace();
			await place.fetchFields({
				fields: ["location", "displayName", "formattedAddress"],
			});
			const lat = place.location?.lat();
			const lng = place.location?.lng();
			if (lat == null || lng == null) return;
			const name =
				place.displayName ??
				suggestion.placePrediction.mainText?.text ??
				suggestion.placePrediction.text.text;
			const address = place.formattedAddress ?? "";
			setInputValue(suggestion.placePrediction.text.text);
			setIsOpen(false);
			resetSession();
			onPlaceSelect({ name: name + ", " + address, lat, lng, address });
		},
		[places, onPlaceSelect, resetSession]
	);

	return (
		<div ref={containerRef} className="relative w-full">
			<input
				type="text"
				value={inputValue}
				onChange={(e) => {
					setInputValue(e.target.value);
					setIsOpen(true);
				}}
				onFocus={() => setIsOpen(true)}
				placeholder={placeholder}
				className="w-full text-sm text-gray-700 bg-transparent border-none outline-none focus:ring-0 placeholder:text-gray-400"
			/>

			{isOpen && inputValue === "" && (
				<ul className="absolute left-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 py-2">
					<li className="px-4 pt-2 pb-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">
						Suggested destinations
					</li>
					<li
						onMouseDown={(e) => e.preventDefault()}
						onClick={handleNearbyClick}
						className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer"
					>
						<div className="flex-shrink-0 w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
							<Navigation size={18} className="text-blue-500" />
						</div>
						<div className="flex flex-col min-w-0">
							<span className="text-sm font-semibold text-gray-900">Nearby</span>
							<span className="text-xs text-gray-500">Find what&apos;s around you</span>
						</div>
					</li>
				</ul>
			)}

			{isOpen && suggestions.length > 0 && (
				<ul className="absolute left-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 py-2">
					{suggestions.map((suggestion, index) => {
						const prediction = suggestion.placePrediction;
						if (!prediction) return null;
						return (
							<li
								key={index}
								onMouseDown={(e) => e.preventDefault()}
								onClick={() => handleSuggestionClick(suggestion)}
								className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer"
							>
								<div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
									<MapPin size={18} className="text-gray-600" />
								</div>
								<div className="flex flex-col min-w-0">
									<span className="text-sm font-semibold text-gray-900 truncate">
										{prediction.mainText?.text ?? prediction.text.text}
									</span>
									{prediction.secondaryText?.text && (
										<span className="text-xs text-gray-500 truncate">
											{prediction.secondaryText.text}
										</span>
									)}
								</div>
							</li>
						);
					})}
				</ul>
			)}
		</div>
	);
}
