import AllProduct from "./AllProduct";
import Trending from "./Trending";

export default function LandingBody() {
	return (
		<div className="grid grid-cols-1 gap-12 h-auto mt-12 px-20">
			<Trending />
			<hr />
			<Trending />
			<hr />
			<AllProduct />
			<hr />
			<Trending />
		</div>
	);
}
