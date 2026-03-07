import { Product } from "@/types";
import Image from "next/image";
import Link from "next/link";
type ProductCardProps = {
	product: Product;
};
const ProductCard = ({ product }: ProductCardProps) => {
	return (
		<Link
			href={`/product/${product.id}`}
			className="flex flex-col  h-96  gap-2 cursor-pointer"
		>
			<div className="h-72 w-full bg-slate-600 rounded-xl overflow-hidden">
				<Image
					src={product.firstImage}
					width={400}
					height={400}
					alt={product.id + "_image"}
					className="h-full w-full object-cover"
				/>
			</div>
			<div className="flex flex-col grow justify-between ">
				<div className="text-base text-black2">
					<h3 className="text-base">{product.simListName}</h3>
					<div className="text-secondText text-sm">
						<span>{product.mod?.modelName}</span>

						<span aria-hidden="true">&nbsp;· &nbsp;</span>
						<span>{product.mod?.brand?.brandName}</span>
					</div>
				</div>
				<div className="">
					<h4 className="text-xl font-bold text-black2">
						${product.pricePerHour}
						<span className="font-light text-secondText text-base">/hrs</span>
					</h4>
				</div>
			</div>
		</Link>
	);
};

export default ProductCard;
