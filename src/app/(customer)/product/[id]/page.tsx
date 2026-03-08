import { Product } from "@/types";
import ProductDetail from "@/components/product/ProductDetail";
import type { Metadata } from "next";
import { normalizeProduct } from "@/lib/products";

type Props = { params: Promise<{ id: number }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { id } = await params;

	try {
		const res = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}simulator/${id}`,
			{ next: { revalidate: 600 } } // Revalidate every 10 minutes
		);
		if (res.ok) {
			const product: Product = normalizeProduct(await res.json());
			return {
				title: product.simListName,
				description: product.listDescription,
			};
		}
	} catch (error) {
		// Fallback metadata if fetch fails
	}

	return {
		title: "Simulator Details",
		description: "View simulator details and book your session",
	};
}

export default async function ProductPage({ params }: Props) {
	const { id } = await params;

	const res = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}simulator/${id}`,
		{
			next: { revalidate: 600 }, // Revalidate every 10 minutes
		}
	);
	if (!res.ok) {
		throw new Error("Failed to fetch product");
	}

	const product: Product = normalizeProduct(await res.json());

	return (
		<>
			<ProductDetail product={product} />
		</>
	);
}
