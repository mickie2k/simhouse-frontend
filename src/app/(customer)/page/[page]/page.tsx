import { Product, PaginatedResponse } from "@/types";
import type { Metadata } from "next";
import ProductCard from "@/components/product/ProductCard";
import PaginationSection from "@/components/pagination/PaginationSection";

export const metadata: Metadata = {
	title: "Browse Simulators",
	description: "Explore our collection of racing simulators",
};

export default async function Page({ params }: { params: Promise<{ page: number }> }) {
	const { page } = await params;

	const res = await fetch(
		process.env.NEXT_PUBLIC_API_URL + "simulator?limit=30&page=" + page,
		{
			next: { revalidate: 300 }, // Revalidate every 5 minutes
		}
	);
	if (!res.ok) {
		throw new Error("Failed to fetch products");
	}
	const paginatedProducts: PaginatedResponse<Product> = await res.json();
	const products: Product[] = paginatedProducts.data;

	return (
		<main className="min-h-full w-full relative ">
			<div className="grid grid-cols-1 gap-12 h-auto mt-6 px-20 2xl:max-w-[1920px] mx-auto">
				<section>
					<h2 className="text-3xl font-bold mb-6">All</h2>
					<div className=" grid sm:grid-cols-2  lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5  gap-x-6 gap-y-10">
						{products.map((product: Product) => (
							<ProductCard key={product.SimID} product={product} />
						))}
					</div>
					<PaginationSection currentPage={page} totalPages={15} basePath="/page" />
				</section>
			</div>
		</main>
	);
}
