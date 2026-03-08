"use client";
import { Product } from "@/types";
import BookingSchedule from "./bookingSchedule";
import { useEffect, useState } from "react";

export default function ModalReserve({
	onClose,
	bookList,
	setBookList,
	product,
}: {
	onClose: () => void;
	bookList: number[];
	setBookList: React.Dispatch<React.SetStateAction<number[]>>;
	product: Product;
}) {
	const [total, setTotal] = useState<number>(0);

	useEffect(() => {
		setTotal(product.pricePerHour * bookList.length);
	}, [bookList, product.pricePerHour]);

	function addList(id: number) {
		if (bookList.find((item) => item === id)) {
			removeList(id);
		} else {
			setBookList([...bookList, id]);
		}
	}
	function removeList(id: number) {
		setBookList(bookList.filter((item) => item !== id));
	}

	return (
		<div className="flex flex-col h-full">
			{/* Header */}
			<div className="flex items-center justify-between pb-4 border-b border-gray-200">
				<div>
					<h2 className="text-xl font-semibold text-black2">
						{product.simListName}
					</h2>
					<p className="text-sm text-secondText mt-0.5">
						<span className="font-medium text-black2">
							${product.pricePerHour}
						</span>{" "}
						/ hr
					</p>
				</div>
				<button
					type="button"
					onClick={onClose}
					className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-900"
					aria-label="Close"
				>
					<svg
						className="w-4 h-4"
						aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 14 14"
					>
						<path
							stroke="currentColor"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
						/>
					</svg>
				</button>
			</div>

			{/* Schedule picker */}
			<div className="flex-1 overflow-hidden mt-4">
				<BookingSchedule
					addList={addList}
					bookList={bookList}
					id={product.id}
				/>
			</div>

			{/* Footer */}
			<div className="border-t border-gray-200 pt-4 mt-4 flex items-center justify-between gap-4">
				<div className="text-sm text-black2">
					{bookList.length > 0 ? (
						<>
							<span className="font-medium">
								${product.pricePerHour} × {bookList.length}{" "}
								{bookList.length === 1 ? "hr" : "hrs"}
							</span>
							<span className="ml-3 text-secondText">
								Total:{" "}
								<span className="font-semibold text-black2">${total}</span>
							</span>
						</>
					) : (
						<span className="text-secondText">Select time slots to continue</span>
					)}
				</div>
				<button
					type="button"
					disabled={bookList.length === 0}
					onClick={onClose}
					className="px-6 py-2.5 bg-primary1 hover:bg-primary1_hover disabled:opacity-40 disabled:hover:bg-primary1 text-white font-medium rounded-lg text-sm transition-colors whitespace-nowrap"
				>
					Confirm{bookList.length > 0 ? ` (${bookList.length} hr${bookList.length > 1 ? "s" : ""})` : ""}
				</button>
			</div>
		</div>
	);
}
