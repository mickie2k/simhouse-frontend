import { Booking } from "@/utilities/type";
import Link from "next/link";
import Image from "next/image";
import { MdPending, MdCancel } from "react-icons/md";
import { IoIosCheckmarkCircle } from "react-icons/io";

export default async function BookingCard({ booking }: { booking: Booking }) {
	const res = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}product/id/${booking.SimID}`,
		{
			method: "GET",
		}
	);
	const product = await res.json();

	const options = {
		year: "numeric" as const,
		month: "short" as const, // 'short' gives you the abbreviated month name
		day: "numeric" as const,
		timeZone: "Asia/Bangkok", // Change to your desired timezone
	};

	function checkReservations() {
		if (booking.StatusID === 1) {
			return (
				<div className="text-lg flex gap-2 items-start bg-yellow-100 rounded-lg py-2 justify-center">
					<MdPending color="#FFD600" />
					<h1 className="leading-6">Your reservation is pending.</h1>
				</div>
			);
		} else if (booking.StatusID === 2) {
			return (
				<div className="text-lg flex gap-2 items-start bg-green-100 rounded-lg py-2 justify-center">
					<IoIosCheckmarkCircle color="#04CF00" />
					<h1 className="leading-6">Your reservation is confirmed.</h1>
				</div>
			);
		} else if (booking.StatusID === 0 || booking.StatusID === 3) {
			return (
				<div className="text-lg flex gap-2 items-start bg-neutral-100 text-neutral-500 rounded-lg py-2 justify-center">
					<MdCancel color="#737373" />
					<h1 className="leading-6">Your reservation is canceled.</h1>
				</div>
			);
		}
	}

	return (
		<div>
			<Link
				href={`/dashboard/booking/${booking.BookingID}`}
				className="flex flex-row  gap-4 cursor-pointer border-borderColor1 border rounded-xl p-4 hover:bg-zinc-50"
			>
				<div className="h-48 w-48 bg-slate-600 rounded-lg overflow-hidden">
					<Image
						src={`${process.env.NEXT_PUBLIC_API_URL}image/${product.firstimage}`}
						width={300}
						height={300}
						alt={product.SimID + "_image"}
						className="h-full w-full object-cover"
					/>
				</div>
				<div className="flex flex-col grow justify-between ">
					<div className="text-xl text-black2">
						<h3 className="text-xl">{product.SimListName}</h3>

						{/* <div className="text-secondText text-sm">
						<span>Ladkrabang</span>
						<span aria-hidden="true">, </span>
						<span>Bangkok</span>

						<span aria-hidden="true">, </span>
						<span>TH</span>
					</div> */}
					</div>
					<div>
						<div className="flex w-full">
							<span className="text-sm font-light">
								<strong>Booking id</strong> : {booking.BookingID}
							</span>
						</div>
						<div className="flex w-full">
							<span className="text-sm font-light">
								<strong>Price</strong> : ${product.PricePerHour}
							</span>
							<h4 className="text-sm font-light text-black2">
								<span className="font-light text-secondText text-sm">/hrs</span>
							</h4>
						</div>
						<div className="flex flex-wrap w-full">
							<span className="text-sm font-light">
								<strong>Date</strong> :{" "}
								{new Date(booking.BookingDate).toLocaleDateString(
									"en-US",
									options
								)}
							</span>
							<small className="w-full text-xs text-neutral-400 font-extralight">
								*This is the reservation date, not the play date.
							</small>
						</div>
					</div>

					<div>
						<h1 className="text-lg font-medium">
							<span className="text-base font-light">Totals</span> : $
							{booking.TotalPrice}
						</h1>
					</div>
					{checkReservations()}
				</div>
			</Link>
		</div>
	);
}
