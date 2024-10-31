import { Product } from "@/utilities/type";
import ProductDetail from "@/components/product/ProductDetail";
export default async function ProductPage({
	params,
}: {
	params: { id: number };
}) {
	const id = params.id;
	const res = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}product/id/${id}`,
		{
			cache: "no-store",
			// next: { revalidate: 3600 },
		}
	);
	if (res.status !== 200) {
		console.error("Failed to fetch product");
		return;
	}
	const productPromise: Promise<Product> = await res.json();
	const [product] = await Promise.all([productPromise]);

	return (
		<>
			<ProductDetail product={product} />
		</>
	);
}
