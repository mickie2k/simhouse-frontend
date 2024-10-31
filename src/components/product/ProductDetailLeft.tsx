import ProductMap from "./ProductMap";
import { Product } from "@/utilities/type";
export default function ProductDetailLeft({ product }: { product: Product }) {
	return (
		<div className="w-7/12 flex-col flex gap-8">
			<div>
				<h1 className="text-[22px] font-medium">Sim Host by {product.FName}</h1>
				<div className="text-gray-500 text-sm mt-1">
					<span>{product.ModelName}</span>

					<span aria-hidden="true">&nbsp;· &nbsp;</span>
					<span>{product.BrandName}</span>
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
			<div className="w-full rounded-xl overflow-hidden ">
				<h1 className="text-[22px] font-medium mb-6">Where you’ll play</h1>
				<ProductMap
					lat={product.Lat}
					lng={product.Long}
					hostid={product.HostID}
				/>
			</div>
			<hr className="my-4" />
			<div>
				<p className="text-sm">{product.ListDescription}</p>
			</div>
			<hr className="my-4" />
			<div>
				<h1 className="text-[22px] font-medium">Host by {product.FName}</h1>
				<div className="text-gray-500 text-sm mt-1">
					<span>{product.FName + " " + product.LName}</span>
				</div>
			</div>
		</div>
	);
}
