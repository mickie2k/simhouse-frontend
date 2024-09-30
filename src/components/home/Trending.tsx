import ProductCard from "../product/ProductCard";

export default function Trending() {
	return (
		<section>
			<h2 className="text-3xl font-bold mb-6">Trending</h2>
			<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
				<ProductCard />
				<ProductCard />
				<ProductCard />
				<ProductCard />
				<ProductCard />
				<ProductCard />
			</div>
		</section>
	);
}
