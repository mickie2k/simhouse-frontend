import { PaginatedResponse, Product } from "@/types";
import ProductListWithMap from "@/components/map/ProductListWithMap";
import type { Metadata } from "next";
import { normalizePaginatedProducts, ProductApiResponse } from "@/lib/products";

type Props = { params: Promise<{ page: number; type: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { type } = await params;
	const title = type === "formula" ? "Formula Simulators" : "GT Racing Simulators";
	return {
		title,
		description: `Browse our collection of ${title.toLowerCase()}`,
	};
}

export default async function TypePage({ params }: Props) {
	const { page, type } = await params;

	let typeID = 0;
	if (type === "formula") {
		typeID = 1;
	} else if (type === "gt") {
		typeID = 2;
	}

	const res = await fetch(
		process.env.NEXT_PUBLIC_API_URL +
		`product/all?limit=30&page=${page}&type=${typeID}`,
		{
			next: { revalidate: 300 }, // Revalidate every 5 minutes
		}
	);
	if (!res.ok) {
		throw new Error("Failed to fetch products");
	}
	const payload: PaginatedResponse<ProductApiResponse> = await res.json();
	const products: Product[] = normalizePaginatedProducts(payload).data;

	const title = typeID === 1 ? "Formula Simulators" : "GT Racing Simulators";

	return (
		<main className="w-full">
			<ProductListWithMap products={products} title={title} />
		</main>
	);
}
