import ProductMap from "./ProductMap";
import { Product } from "@/types";
export default function ProductDetailLeft({ product }: { product: Product }) {
	return (
		<div className="w-7/12 flex-col flex gap-8">
			<div>
				<h1 className="text-[22px] font-medium">Sim Host by {product.host?.firstName}</h1>
				<div className="text-gray-500 text-sm mt-1">
					<span>{product.mod?.modelName}</span>

					<span aria-hidden="true">&nbsp;· &nbsp;</span>
					<span>{product.mod?.brand?.brandName}</span>
				</div>
			</div>
			<hr className="mb-4" />
			<div>
				<ul className="gap-4 flex-col flex">
					<li>
						<h6>Check-in with host</h6>
						<span>Your host will be home</span>
					</li>
					<li>
						<h6>Many Steering Wheels</h6>
						<span>You can try different steering wheels</span>
					</li>
				</ul>
			</div>
			<hr className="my-4" />
			<div className="w-full overflow-hidden ">
				<h1 className="text-[22px] font-medium mb-6">Where you'll play</h1>
				<div className="rounded-xl overflow-hidden w-full ">
					<ProductMap
						lat={product.latitude}
						lng={product.longitude}
						hostid={product.hostId}
					/>
				</div>
			</div>
			<hr className="my-4" />
			<div>
				<p className="text-sm">{product.listDescription}</p>
			</div>
			<hr className="my-4" />
			<div>
				<h1 className="text-[22px] font-medium">Host by {product.host?.firstName}</h1>
				<div className="text-gray-500 text-sm mt-1">
					<span>{product.host?.firstName + " " + product.host?.lastName}</span>
				</div>
			</div>
		</div>
	);
}
