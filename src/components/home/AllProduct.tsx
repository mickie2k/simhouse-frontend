import Link from "next/link";
import ProductCard from "../product/ProductCard";
import { Product } from "@/utilities/type";

export default async function AllProduct() {
	const res = await fetch(
		process.env.NEXT_PUBLIC_API_URL + "product/all?limit=15",
		{
			cache: "no-store",
		}
	);
	if (res.status !== 200) {
		console.error("Failed to fetch products");
		return;
	}
	const products = await res.json();
	// console.log(products);

	return (
		<section>
			<h2 className="text-3xl font-bold mb-6">All</h2>
			<div className="grid sm:grid-cols-2  lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5  gap-x-6 gap-y-10">
				{products.map((product: Product) => (
					<ProductCard key={product.SimID} product={product} />
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
