import { Product } from "@/utilities/type";
import Image from "next/image";
import Link from "next/link";
type ProductCardProps = {
	product: Product;
};
const ProductCard = ({ product }: ProductCardProps) => {
	return (
		<Link
			href={`/product/${product.SimID}`}
			className="flex flex-col  h-96  gap-2 cursor-pointer"
		>
			<div className="h-72 w-full bg-slate-600 rounded-xl overflow-hidden">
				<Image
					src={`${process.env.NEXT_PUBLIC_API_URL}image/${product.firstimage}`}
					width={400}
					height={400}
					alt={product.SimID + "_image"}
					className="h-full w-full object-cover"
				/>
			</div>
			<div className="flex flex-col grow justify-between ">
				<div className="text-base text-black2">
					<h3 className="text-base">{product.SimListName}</h3>
					<div className="text-secondText text-sm">
						<span>{product.ModelName}</span>

						<span aria-hidden="true">&nbsp;· &nbsp;</span>
						<span>{product.BrandName}</span>
					</div>
					{/* <div className="text-secondText text-sm">
						<span>Ladkrabang</span>
						<span aria-hidden="true">, </span>
						<span>Bangkok</span>

						<span aria-hidden="true">, </span>
						<span>TH</span>
					</div> */}
				</div>
				<div className="">
					<h4 className="text-xl font-bold text-black2">
						${product.PricePerHour}
						<span className="font-light text-secondText text-base">/hrs</span>
					</h4>
				</div>
			</div>
		</Link>
	);
};

export default ProductCard;
