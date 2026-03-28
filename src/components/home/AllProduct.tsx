import Link from "next/link";
import ProductCard from "../product/ProductCard";
import { PaginatedResponse, Product } from "@/types";
import { ProductApiResponse, normalizeProduct } from "@/lib/products";

function AllProductFallback() {
	return (
		<section>
			<h2 className="text-3xl font-bold mb-6">All</h2>
			<div className="px-6 py-10 text-center flex flex-col items-center justify-center gap-1">
				<p className="text-xl font-medium text-gray-900">Products are temporarily unavailable</p>
				<p className="text-neutral-500">Please try again in a few minutes.</p>
				<Link
					href="/"
					className="bg-black2 mt-3 text-white px-6 py-3 text-base font-medium rounded-lg hover:bg-black"
				>
					Try Again
				</Link>
			</div>
		</section>
	);
}

export default async function AllProduct() {
	let products: ProductApiResponse[] | null = null;
	let error: Error | null = null;

	try {
		const requestUrl = `${process.env.NEXT_PUBLIC_API_URL}simulator`;
		const res = await fetch(requestUrl, {
			next: { revalidate: 300 },
		});

		if (!res.ok) {
			const responseBody = await res.text();
			console.error("Failed to fetch products", {
				url: requestUrl,
				status: res.status,
				statusText: res.statusText,
				body: responseBody,
			});
		} else {
			products = await res.json();
		}
	} catch (err) {
		error = err instanceof Error ? err : new Error("Unknown error");
		console.error("Unexpected error while fetching products", error);
	}

	if (error || !products) {
		return <AllProductFallback />;
	}

	const normalizedProducts = products.map((product) => normalizeProduct(product));

	return (
		<section>
			<h2 className="text-3xl font-bold mb-6">All</h2>
			<div className="grid sm:grid-cols-2  lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5  gap-x-6 gap-y-10">
				{normalizedProducts.map((product) => (
					<ProductCard key={product.id} product={product} />
				))}
			</div>
			<div className="w-full flex flex-col items-center justify-center mt-12 gap-4">
				<p>Continue exploring amazing views</p>
				<Link
					href="/page/1"
					className="bg-black2 text-white px-6 py-3 text-base font-medium rounded-lg hover:bg-black"
				>
					Show More
				</Link>
			</div>
		</section>
	);
}
