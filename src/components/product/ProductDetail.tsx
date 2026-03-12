"use client";
import { Product } from "@/types";
import { createContext, useEffect, useState } from "react";
import Image from "next/image";
import SaveProduct from "./SaveProduct";
import ProductDetailLeft from "./ProductDetailLeft";
import ProductDetailRight from "./ProductDetailRight";
import ModalReserve from "./modalReserve/modalReserve";
import Modal from "react-modal";
export interface DateContextType {
	date: string;
	setDate: React.Dispatch<React.SetStateAction<string>>;
}

export const DateContext = createContext<DateContextType>({
	date: "",
	setDate: () => { },
});
export default function ProductDetail({ product }: { product: Product }) {
	const [modal, setModal] = useState(false);
	const [bookList, setBookList] = useState<number[]>([]);
	const [date, setDate] = useState<string>("");

	useEffect(() => {
		Modal.setAppElement("body");
	}, []);

	const customStyles = {
		overlay: {
			backgroundColor: "rgba(0, 0, 0, 0.65)",
			zIndex: 1000,
		},
		content: {
			top: "50%",
			left: "50%",
			right: "auto",
			bottom: "auto",
			marginRight: "-50%",
			transform: "translate(-50%, -50%)",
			padding: "28px",
			width: "min(72rem, 90vw)",
			height: "min(600px, 90vh)",
			border: "none",
			borderRadius: "16px",
			boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
			overflow: "hidden",
			display: "flex",
			flexDirection: "column" as const,
		},
	};
	function afterOpenModal() {
		// references are now sync'd and can be accessed.

		document.body.classList.add("no-scroll");
	}

	function closeModal() {
		document.body.classList.remove("no-scroll");
		setModal(false);
	}

	return (
		<DateContext.Provider value={{ date, setDate }}>
			<div className="max-w-6xl mx-auto mt-6" id="productDetail">
				<Modal
					isOpen={modal}
					onAfterOpen={afterOpenModal}
					onRequestClose={closeModal}
					style={customStyles}
					contentLabel="Reserve Modal"
				>
					<ModalReserve
						onClose={closeModal}
						bookList={bookList}
						setBookList={setBookList}
						product={product}
					/>
				</Modal>
				<div>
					<div className="flex flex-row flex-wrap justify-between items-center    ">
						<h1 className="text-[1.625rem] font-semibold ">
							{product.simListName}
						</h1>

						<SaveProduct productID={product.id} />
					</div>
					<a
						href={`https://www.google.com/maps/search/?api=1&query=${product.latitude}%2C${product.longitude}`}
						target="_blank"
						className="text-secondText text-sm underline"
					>
						{product.addressDetail}, {product.city}, {product.country}
					</a>
				</div>

				<div
					className="
                mt-6
                grid
                grid-cols-3
                grid-rows-2
			w-full
			h-[58vh]
			overflow-hidden 
			rounded-xl
			relative
			gap-2
			"
				>
					<Image
						src={product.firstImage}
						width={400}
						height={400}
						alt={product.id + "_image"}
						className="h-full w-full object-cover col-span-2 row-span-2"
					/>
					<Image
						src={product.secondImage}
						width={400}
						height={400}
						alt={product.id + "_image"}
						className="h-full w-full object-cover col-span-1 row-span-1"
					/>
					<Image
						src={product.thirdImage}
						width={400}
						height={400}
						alt={product.id + "_image"}
						className="h-full w-full object-cover col-span-1 row-span-1"
					/>
				</div>
				<div className="py-8 flex justify-between h-full relative">
					<ProductDetailLeft product={product} />
					<ProductDetailRight
						product={product}
						setModal={setModal}
						bookList={bookList}
					/>
				</div>
			</div>
		</DateContext.Provider>
	);
}
