import { Product, PaginatedResponse } from "@/types";
import type { Metadata } from "next";
import ProductCard from "@/components/product/ProductCard";
import PaginationSection from "@/components/pagination/PaginationSection";
import { normalizePaginatedProducts, ProductApiResponse } from "@/lib/products";
import ProductListWithMap from "@/components/map/ProductListWithMap";

export const metadata: Metadata = {
	title: "Browse Simulators",
	description: "Explore our collection of racing simulators",
};

type PageProps = {
	params: Promise<{ page: number }>;
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Page({ params, searchParams }: PageProps) {
	const { page } = await params;
	const search = await searchParams;
	let res: Response;

	// Build query parameters
	const queryParams = new URLSearchParams();
	queryParams.set("limit", "30");
	queryParams.set("page", page.toString());

	// Add search filters if present
	if (!search.useSpecific) {

		if (search.cityId) {
			queryParams.set("cityId", search.cityId.toString());
		}
		if (search.simTypeIds) {
			queryParams.set("simTypeIds", search.simTypeIds.toString());
		}
		if (search.startDate) {
			queryParams.set("startDate", search.startDate.toString());
		}
		if (search.search) {
			queryParams.set("search", search.search.toString());
		}
		res = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}simulator/search?${queryParams.toString()}`,
			{
				next: { revalidate: 300 }, // Revalidate every 5 minutes
			}
		);

	} else {
		if (search.lat) {
			queryParams.set("lat", search.lat.toString());
		}
		if (search.lng) {
			queryParams.set("lng", search.lng.toString());
		}
		queryParams.set("radiusKm", "50"); // Default radius of 50 km

		console.log("Fetching nearby simulators with params:", queryParams.toString());
		res = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}simulator/nearest?${queryParams.toString()}`,
			{
				next: { revalidate: 1 }, // Revalidate every 5 minutes
			}
		);
		console.log(res)
	}

	if (!res.ok) {
		throw new Error("Failed to fetch products");
	}
	const payload: PaginatedResponse<ProductApiResponse> = await res.json();
	const { data, meta }: PaginatedResponse<Product> = normalizePaginatedProducts(payload);


	// Determine title based on filters
	let title = "All Simulators";
	if (search.simTypeIds === "1") {
		title = "Formula 1 Simulators";
	} else if (search.simTypeIds === "2") {
		title = "GT Racing Simulators";
	}

	const centerLat = search.lat ? parseFloat(search.lat.toString()) : undefined;
	const centerLng = search.lng ? parseFloat(search.lng.toString()) : undefined;

	return (
		<main className="w-full">
			<ProductListWithMap products={data} title={title} page={meta.page} totalPages={meta.totalPages || 15} lat={centerLat} lng={centerLng} />
		</main>
	);
}
