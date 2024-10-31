import { Product } from "@/utilities/type";
import {
	Dispatch,
	SetStateAction,
	useContext,
	useEffect,
	useState,
} from "react";
import { DateContext } from "./ProductDetail";
import { checkisLoginByCookie } from "@/utilities/auth";

export default function ProductDetailRight({
	product,
	setModal,
	bookList,
}: {
	product: Product;
	setModal: Dispatch<SetStateAction<boolean>>;
	bookList: number[];
}) {
	const [total, setTotal] = useState<number>(0);
	const { date, setDate } = useContext(DateContext);

	const options = {
		year: "numeric" as const,
		month: "short" as const, // 'short' gives you the abbreviated month name
		day: "numeric" as const,
	};

	const formattedDate = new Date(date).toLocaleDateString("en-US", options);
	useEffect(() => {
		setTotal(product.PricePerHour * bookList.length);
		if (bookList.length === 0) {
			setDate("");
		}
	}, [bookList, product.PricePerHour]);

	function onClickDate() {
		setModal(true);
	}

	async function onSubmit() {
		console.log(checkisLoginByCookie());
		if (checkisLoginByCookie() === false) {
			alert("Please login first");
			return;
		}
		const request = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}user/booking`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json", // Set the content type to JSON
				},
				credentials: "include",
				body: JSON.stringify({
					simid: product.SimID,
					scheduleid: bookList,
				}),
			}
		);

		const data = await request.json();

		if (request.status == 200 && data.message) {
			alert(data.message);
			return;
		} else if (request.status == 400) {
			alert(data.message);
			return;
		} else if (request.status !== 200) {
			alert("Booking failed");
			return;
		}
	}
	return (
		<div className="w-1/3 sticky h-fit  top-28">
			<div className="rounded-xl border p-6 items-center border-gray-200 flex flex-col gap-4 shadow-[0px_6px_16px_rgba(0,0,0,0.1)]">
				<h4 className="text-xl text-start w-full font-medium text-black2">
					${product.PricePerHour}
					<span className="font-light text-secondText text-base"> / hrs</span>
				</h4>
				<button
					className="w-full text-start text-sm group border font-normal text-gray-500 border-gray-300 rounded-lg grid grid-cols-2  hover:border-black2"
					onClick={onClickDate}
				>
					<div className="flex flex-col col-span-2 border-b border-gray-300 p-3   group-hover:border-black2">
						<label className="text-xs font-bold text-black" htmlFor="">
							DATE
						</label>
						<span> {date == "" ? "Add date" : formattedDate}</span>
					</div>
					<div className="flex flex-col  border-r border-gray-300  group-hover:border-black2 p-3">
						<label className="text-xs font-bold text-black" htmlFor="">
							START TIME
						</label>
						<span>2:00 PM</span>
					</div>
					<div className="flex flex-col  p-3">
						<label className="text-xs font-bold text-black" htmlFor="">
							END TIME
						</label>
						<span>5:00 PM</span>
					</div>
				</button>
				<div className="min-h-[52px] w-full text-center">
					<button
						disabled={bookList.length === 0}
						onClick={onSubmit}
						type="submit"
						className="w-full text-white bg-primary1 hover:bg-primary1_hover focus:bg-primary1_hover focus:outline-none disabled:opacity-45 disabled:hover:bg-primary1  font-medium rounded-lg text-base px-5 py-3.5 text-center focus:py-3 focus:w-[97%]"
					>
						Reserve
					</button>
				</div>
				<div className="text-black2 font-normal text-base justify-between flex w-full">
					<span>${product.PricePerHour} x 1 hours</span>
					<span>${product.PricePerHour}</span>
				</div>
				<hr className="w-full" />
				<div className="text-black2 font-bold text-base justify-between flex w-full">
					<span>Total</span>
					<span>${total}</span>
				</div>
			</div>
		</div>
	);
}
