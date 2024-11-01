import { Product } from "@/utilities/type";
import ProductCard from "@/components/product/ProductCard";

export default async function TypePage({
	params,
}: {
	params: { page: number; type: string };
}) {
	let typeID = 0;
	if (params.type === "formula") {
		typeID = 1;
	} else if (params.type === "gt") {
		typeID = 2;
	}

	console.log(params.type);
	const res = await fetch(
		process.env.NEXT_PUBLIC_API_URL +
			`product/all?limit=30&page=${params.page}&type=${typeID}`,
		{
			cache: "no-store",
		}
	);
	if (res?.status !== 200) {
		console.error("Failed to fetch products");
		return;
	}
	const products = await res.json();

	return (
		<main className="min-h-full w-full relative ">
			<div className="grid grid-cols-1 gap-12 h-auto mt-6 px-20 2xl:max-w-[1920px] mx-auto">
				<section>
					<h2 className="text-3xl font-bold mb-6">
						{typeID == 1 ? "Formula" : "GT Racing"}
					</h2>
					<div className=" grid sm:grid-cols-2  lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5  gap-x-6 gap-y-10">
						{products.map((product: Product) => (
							<ProductCard key={product.SimID} product={product} />
						))}
					</div>
					{/* <div className="w-full flex flex-col items-center justify-center mt-12 gap-4">
						<p>Continue exploring amazing views</p>
						<button className="bg-black2 text-white px-6 py-3 text-base font-medium rounded-lg hover:bg-black">
							Show More
						</button>
					</div> */}
				</section>
			</div>
		</main>
	);
}
