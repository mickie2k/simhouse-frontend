
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
	getAllCitiesOfCountry,
	getCountries,
	getStatesOfCountry,
	type ICity,
	type ICountry,
	type IState,
} from "@countrystatecity/countries";

type SuggestionType = "city" | "state" | "country";

type Suggestion = {
	id: string;
	type: SuggestionType;
	name: string;
	subtitle: string;
	latitude: number | null;
	longitude: number | null;
};

type PlaceAutocompleteProps = {
	onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
	placeholder?: string;
};

const MAX_SUGGESTIONS = 8;
const MAX_COUNTRIES_TO_EXPAND = 6;

function toNumber(value: string | null | undefined): number | null {
	if (!value) return null;
	const parsed = Number(value);
	return Number.isFinite(parsed) ? parsed : null;
}

function normalize(value: string): string {
	return value.trim().toLowerCase();
}

export default function PlaceAutocomplete({
	onPlaceSelect,
	placeholder = "Search by city, state, or country",
}: PlaceAutocompleteProps) {
	const rootRef = useRef<HTMLDivElement>(null);
	const [query, setQuery] = useState("");
	const [isOpen, setIsOpen] = useState(false);
	const [highlightedIndex, setHighlightedIndex] = useState(-1);
	const [countries, setCountries] = useState<ICountry[]>([]);
	const [statesCache, setStatesCache] = useState<Record<string, IState[]>>({});
	const [citiesCache, setCitiesCache] = useState<Record<string, ICity[]>>({});
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		let mounted = true;

		const loadCountries = async () => {
			const allCountries = await getCountries();
			if (!mounted) return;

			const sorted = [...allCountries].sort((a, b) =>
				a.name.localeCompare(b.name)
			);
			setCountries(sorted);
		};

		void loadCountries();

		return () => {
			mounted = false;
		};
	}, []);

	const normalizedQuery = useMemo(() => normalize(query), [query]);

	const matchedCountries = useMemo(() => {
		if (!normalizedQuery) return [];

		return countries
			.filter((country) => normalize(country.name).includes(normalizedQuery))
			.slice(0, MAX_COUNTRIES_TO_EXPAND);
	}, [countries, normalizedQuery]);

	useEffect(() => {
		if (!normalizedQuery || matchedCountries.length === 0) return;

		let cancelled = false;

		const loadCountryDetails = async () => {
			setLoading(true);

			const missingStates = matchedCountries.filter(
				(country) => !statesCache[country.iso2]
			);
			const missingCities = matchedCountries.filter(
				(country) => !citiesCache[country.iso2]
			);

			const [statesEntries, citiesEntries] = await Promise.all([
				Promise.all(
					missingStates.map(async (country) => {
						const states = await getStatesOfCountry(country.iso2);
						return [country.iso2, states] as const;
					})
				),
				Promise.all(
					missingCities.map(async (country) => {
						const cities = await getAllCitiesOfCountry(country.iso2);
						return [country.iso2, cities] as const;
					})
				),
			]);

			if (cancelled) return;

			if (statesEntries.length > 0) {
				setStatesCache((prev) => {
					const next = { ...prev };
					for (const [countryCode, states] of statesEntries) {
						next[countryCode] = states;
					}
					return next;
				});
			}

			if (citiesEntries.length > 0) {
				setCitiesCache((prev) => {
					const next = { ...prev };
					for (const [countryCode, cities] of citiesEntries) {
						next[countryCode] = cities;
					}
					return next;
				});
			}

			setLoading(false);
		};

		void loadCountryDetails();

		return () => {
			cancelled = true;
		};
	}, [citiesCache, matchedCountries, normalizedQuery, statesCache]);

	const suggestions = useMemo(() => {
		if (!normalizedQuery) return [];

		const countrySuggestions: Suggestion[] = countries
			.filter((country) => normalize(country.name).includes(normalizedQuery))
			.map((country) => ({
				id: `country-${country.iso2}`,
				type: "country",
				name: country.name,
				subtitle: `Country (${country.iso2})`,
				latitude: toNumber(country.latitude),
				longitude: toNumber(country.longitude),
			}));

		const stateSuggestions: Suggestion[] = matchedCountries.flatMap((country) => {
			const states = statesCache[country.iso2] ?? [];
			return states
				.filter((state) => normalize(state.name).includes(normalizedQuery))
				.map((state) => ({
					id: `state-${country.iso2}-${state.iso2}`,
					type: "state",
					name: state.name,
					subtitle: `${country.name}`,
					latitude: toNumber(state.latitude),
					longitude: toNumber(state.longitude),
				}));
		});

		const citySuggestions: Suggestion[] = matchedCountries.flatMap((country) => {
			const stateByCode = new Map(
				(statesCache[country.iso2] ?? []).map((state) => [state.iso2, state])
			);
			const cities = citiesCache[country.iso2] ?? [];
			return cities
				.filter((city) => normalize(city.name).includes(normalizedQuery))
				.map((city) => ({
					id: `city-${country.iso2}-${city.state_code}-${city.id}`,
					type: "city",
					name: city.name,
					subtitle: `${stateByCode.get(city.state_code)?.name ?? city.state_code}, ${country.name}`,
					latitude: toNumber(city.latitude),
					longitude: toNumber(city.longitude),
				}));
		});

		return [...citySuggestions, ...stateSuggestions, ...countrySuggestions].slice(
			0,
			MAX_SUGGESTIONS
		);
	}, [citiesCache, countries, matchedCountries, normalizedQuery, statesCache]);

	useEffect(() => {
		setHighlightedIndex(suggestions.length > 0 ? 0 : -1);
	}, [suggestions]);

	useEffect(() => {
		const handleOutsideClick = (event: MouseEvent) => {
			if (!rootRef.current?.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleOutsideClick);
		return () => {
			document.removeEventListener("mousedown", handleOutsideClick);
		};
	}, []);

	const selectSuggestion = (suggestion: Suggestion) => {
		setQuery(suggestion.name);
		setIsOpen(false);

		const latLng =
			suggestion.latitude !== null &&
				suggestion.longitude !== null &&
				globalThis.google?.maps
				? new google.maps.LatLng(suggestion.latitude, suggestion.longitude)
				: undefined;

		onPlaceSelect({
			place_id: suggestion.id,
			name: suggestion.name,
			formatted_address: suggestion.subtitle,
			geometry: latLng ? { location: latLng } : undefined,
		});
	};

	return (
		<div ref={rootRef} className="relative w-full">
			<input
				type="text"
				value={query}
				onFocus={() => setIsOpen(true)}
				onChange={(event) => {
					const value = event.target.value;
					setQuery(value);
					setIsOpen(true);

					if (value.trim() === "") {
						onPlaceSelect(null);
					}
				}}
				onKeyDown={(event) => {
					if (!isOpen || suggestions.length === 0) return;

					if (event.key === "ArrowDown") {
						event.preventDefault();
						setHighlightedIndex((prev) =>
							prev < suggestions.length - 1 ? prev + 1 : prev
						);
					}

					if (event.key === "ArrowUp") {
						event.preventDefault();
						setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
					}

					if (event.key === "Enter" && highlightedIndex >= 0) {
						event.preventDefault();
						selectSuggestion(suggestions[highlightedIndex]);
					}

					if (event.key === "Escape") {
						setIsOpen(false);
					}
				}}
				placeholder={placeholder}
				className="w-full text-sm text-gray-700 bg-transparent border-none outline-none focus:ring-0"
			/>

			{isOpen && (suggestions.length > 0 || loading) && (
				<div className="absolute z-20 mt-2 w-full rounded-xl border border-gray-200 bg-white shadow-xl overflow-hidden">
					{loading && suggestions.length === 0 && (
						<div className="px-3 py-2 text-xs text-gray-500">
							Loading locations...
						</div>
					)}

					{suggestions.map((suggestion, index) => (
						<button
							key={suggestion.id}
							type="button"
							onClick={() => selectSuggestion(suggestion)}
							className={`w-full text-left px-3 py-2 hover:bg-gray-50 ${
								highlightedIndex === index ? "bg-gray-50" : ""
							}`}
						>
							<div className="text-sm text-gray-900">{suggestion.name}</div>
							<div className="text-xs text-gray-500">
								{suggestion.type.toUpperCase()} - {suggestion.subtitle}
							</div>
						</button>
					))}
				</div>
			)}
		</div>
	);

}