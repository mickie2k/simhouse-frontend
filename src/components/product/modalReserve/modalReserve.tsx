import { Product } from "@/utilities/type";
import BookingSchedule from "./bookingSchedule";
import { useContext, useEffect, useState } from "react";
import { DateContext } from "../ProductDetail";

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
	const { setDate } = useContext(DateContext);

	useEffect(() => {
		setTotal(product.PricePerHour * bookList.length);
	}, [bookList, product.PricePerHour]);

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
		<>
			<div className="flex flex-col w-full  overflow-hidden  gap-4">
				<div className="flex w-full justify-between h-1/5">
					<h1 className="text-xl font-medium">
						$100{" "}
						<span className="text-base font-normal text-secondText">/ hrs</span>
						<span className="text-base font-normal">
							<span aria-hidden="true">&nbsp;· &nbsp;</span> Moza R9 lnw
						</span>
					</h1>
					<div>
						<button
							type="button"
							className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
							data-modal-hide="default-modal"
							onClick={onClose}
						>
							<svg
								className="w-3 h-3"
								aria-hidden="true"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 14 14"
							>
								<path
									stroke="currentColor"
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
								/>
							</svg>
							<span className="sr-only">Close modal</span>
						</button>
					</div>
				</div>
				{/* <h1 className="text-xl font-medium">Pick Date/Time</h1> */}
				<BookingSchedule
					addList={addList}
					bookList={bookList}
					id={product.SimID}
				/>
				<div className="flex justify-between h-1/5">
					<h6 className="text-base font-medium">
						Total
						<span className="ml-1 text-sm font-normal text-secondText">
							100 hrs x 3
						</span>
					</h6>

					<h6 className=" font-medium">฿{total}</h6>
				</div>
				<button
					type="submit"
					className="h-1/5 w-full text-white bg-primary1 hover:bg-primary1_hover  font-medium rounded-lg text-base px-5 py-3.5 text-center "
					onClick={onClose}
				>
					Confirm
				</button>
			</div>
		</>
	);
}
