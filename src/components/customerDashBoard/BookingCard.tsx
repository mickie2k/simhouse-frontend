import { Booking, Product } from "@/types";
import Link from "next/link";
import Image from "next/image";
import { MdPending, MdCancel } from "react-icons/md";
import { IoIosCheckmarkCircle } from "react-icons/io";

export default async function BookingCard({ booking }: { booking: Booking }) {
	let product: Product | null = null;

	try {
		const res = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}simulator/${booking.simId}`,
			{
				next: { revalidate: 600 }, // Cache for 10 minutes
			}
		);
		if (res.ok) {
			product = await res.json();
		}
	} catch (error) {
		console.error("Failed to fetch product:", error);
	}

	// Fallback if product fetch fails
	if (!product) {
		return (
			<div className="flex flex-row gap-4 border-borderColor1 border rounded-xl p-4 bg-gray-50">
				<div className="h-48 w-48 bg-gray-300 rounded-lg flex items-center justify-center">
					<span className="text-gray-500">Image unavailable</span>
				</div>
				<div className="flex flex-col grow justify-between">
					<h3 className="text-xl">Booking #{booking.id}</h3>
					<p className="text-sm text-gray-500">Product details unavailable</p>
					<StatusBadge statusId={booking.statusId} />
				</div>
			</div>
		);
	}

	const options = {
		year: "numeric" as const,
		month: "short" as const,
		day: "numeric" as const,
		timeZone: "Asia/Bangkok",
	};

	return (
		<div>
			<Link
				href={`/dashboard/booking/${booking.id}`}
				className="flex flex-row  gap-4 cursor-pointer border-borderColor1 border rounded-xl p-4 hover:bg-zinc-50"
			>
				<div className="h-48 w-48 bg-slate-600 rounded-lg overflow-hidden">
					<Image
						src={product.firstImage}
						width={300}
						height={300}
						alt={product.id + "_image"}
						className="h-full w-full object-cover"
					/>
				</div>
				<div className="flex flex-col grow justify-between ">
					<div className="text-xl text-black2">
						<h3 className="text-xl">{product.simListName}</h3>
					</div>
					<div>
						<div className="flex w-full">
							<span className="text-sm font-light">
								<strong>Booking id</strong> : {booking.id}
							</span>
						</div>
						<div className="flex w-full">
							<span className="text-sm font-light">
								<strong>Price</strong> : ${product.pricePerHour}
							</span>
							<h4 className="text-sm font-light text-black2">
								<span className="font-light text-secondText text-sm">/hrs</span>
							</h4>
						</div>
						<div className="flex flex-wrap w-full">
							<span className="text-sm font-light">
								<strong>Date</strong> :{" "}
								{new Date(booking.bookingDate).toLocaleDateString(
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
							{booking.totalPrice}
						</h1>
					</div>
					<StatusBadge statusId={booking.statusId} />
				</div>
			</Link>
		</div>
	);
}

// Extract status badge to separate component for cleaner code
function StatusBadge({ statusId }: { statusId: number }) {
	if (statusId === 1) {
		return (
			<div className="text-lg flex gap-2 items-start bg-yellow-100 rounded-lg py-2 justify-center">
				<MdPending color="#FFD600" />
				<h1 className="leading-6">Your reservation is pending.</h1>
			</div>
		);
	} else if (statusId === 2) {
		return (
			<div className="text-lg flex gap-2 items-start bg-green-100 rounded-lg py-2 justify-center">
				<IoIosCheckmarkCircle color="#04CF00" />
				<h1 className="leading-6">Your reservation is confirmed.</h1>
			</div>
		);
	} else if (statusId === 0 || statusId === 3) {
		return (
			<div className="text-lg flex gap-2 items-start bg-neutral-100 text-neutral-500 rounded-lg py-2 justify-center">
				<MdCancel color="#737373" />
				<h1 className="leading-6">Your reservation is canceled.</h1>
			</div>
		);
	}
	return null;
}
