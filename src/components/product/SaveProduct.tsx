"use client";

import { useState, useEffect } from "react";
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";

const SaveProduct = ({ productID }: { productID: number }) => {
	const [isSave, Save] = useState(false);
	useEffect(() => {
		// Access localStorage only on the client-side
		const savedProducts = JSON.parse(localStorage.getItem("saved") || "[]");
		Save(savedProducts.includes(productID));
	}, [productID]);

	const handleSave = () => {
		const savedProducts = JSON.parse(localStorage.getItem("saved") || "[]");
		if (isSave) {
			const index = savedProducts.indexOf(productID);
			savedProducts.splice(index, 1);
			localStorage.setItem("saved", JSON.stringify(savedProducts));
			Save(false);
		} else {
			savedProducts.push(productID);
			localStorage.setItem("saved", JSON.stringify(savedProducts));
			Save(true);
		}
	};

	return (
		<button onClick={handleSave}>
			<div className="flex gap-1 items-start px-1 ">
				{isSave ? (
					<>
						<FaHeart size={14} className="overflow-visible" color="#FF385C" />
						<span className="text-sm underline font-medium leading-4">
							Saved
						</span>
					</>
				) : (
					<>
						<FaRegHeart size={14} className="overflow-visible" />
						<span className="text-sm underline font-medium leading-4">
							Save
						</span>
					</>
				)}
			</div>
		</button>
	);
};

export default SaveProduct;
