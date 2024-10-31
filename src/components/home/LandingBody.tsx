import AllProduct from "./AllProduct";
import ProductType from "./ProductType";
// import Trending from "./Trending";

export default function LandingBody() {
	return (
		<div className="grid grid-cols-1 gap-12 h-auto mt-12 px-20 2xl:max-w-[1920px] mx-auto">
			<AllProduct />
			<hr />
			<ProductType />
			<hr />

			<hr />
			{/* <Trending /> */}
		</div>
	);
}
