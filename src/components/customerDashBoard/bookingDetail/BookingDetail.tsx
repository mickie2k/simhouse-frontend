import { BookingDetail as BookingDetailType } from "@/types";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { MdCancel, MdPending } from "react-icons/md";
import { RiExternalLinkLine } from "react-icons/ri";
import ProductMap from "@/components/product/ProductMap";
import Image from "next/image";
import { FaUserCircle } from "react-icons/fa";
import Link from "next/link";
import CancelBookingButton from "./CancelBookingButton";

export default function BookingDetail({
	bookingDetail,
	justbook,
}: {
	bookingDetail: BookingDetailType[];
	justbook: string;
}) {
	if (!bookingDetail || bookingDetail.length === 0) {
		return <div className="text-center">No booking detail found</div>;
	}

	// The backend returns an array but we only need the first booking
	const booking = bookingDetail[0];
	const { simulator, bookingList } = booking;
	const host = simulator.host;

	// Sort schedule slots by date then start time
	const sortedSlots = [...bookingList].sort((a, b) => {
		const dateA = new Date(a.schedule.date).getTime();
		const dateB = new Date(b.schedule.date).getTime();
		if (dateA !== dateB) return dateA - dateB;
		return a.schedule.startTime.localeCompare(b.schedule.startTime);
	});

	const firstSlot = sortedSlots[0]?.schedule;

	const options = {
		year: "numeric" as const,
		month: "short" as const,
		day: "numeric" as const,
		timeZone: "Asia/Bangkok",
	};

	const date = firstSlot
		? new Date(firstSlot.date).toLocaleDateString("en-US", options)
		: "";

	const weekday = [
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
	];
	const day = firstSlot ? new Date(firstSlot.date).getDay() : 0;
	const formattedTel = host?.phone
		? host.phone.replace(/(\d{3})(\d{7})/, "$1-$2")
		: "";

	function bookingStatus() {
		if (booking.statusId === 1) {
			return (
				<div className="text-lg flex gap-2 items-start bg-yellow-50 rounded-lg py-3 justify-center w-full">
					<MdPending color="#FFD600" />
					<h1 className="leading-6">Your reservation is pending.</h1>
				</div>
			);
		} else if (booking.statusId === 2) {
			return (
				<div className="text-lg flex gap-2 items-start bg-green-50 rounded-lg py-3 justify-center">
					<IoIosCheckmarkCircle color="#04CF00" />
					<h1 className="leading-6">Your reservation is confirmed.</h1>
				</div>
			);
		} else if (booking.statusId === 0 || booking.statusId === 3) {
			return (
				<div className="text-lg flex gap-2 items-start bg-neutral-100 text-neutral-500 rounded-lg py-3 justify-center">
					<MdCancel color="#737373" />
					<h1 className="leading-6">
						Your reservation is canceled
						{booking.statusId === 0 && " by host"}.
					</h1>
				</div>
			);
		}
	}

	return (
		<div className="py-2">
			{bookingStatus()}

			<div className="grid grid-cols-3 gap-x-20 gap-y-8 mt-10">
				<div className="flex flex-col gap-6 col-span-2 overflow-hidden">
					<Image
						src={simulator.firstImage}
						width={400}
						height={400}
						alt={simulator.id + "_image"}
						className=" w-full object-cover rounded-2xl"
					/>
					<div className="flex flex-row justify-start gap-4">
						<div className="mr-auto">
							<h1 className="text-xl font-medium ">
								{simulator.simListName}
							</h1>
							<Link
								href={`/product/${simulator.id}`}
								className="flex gap-1 text-blue-600 underline"
								target="_blank"
							>
								Simulator Detail <RiExternalLinkLine />
							</Link>
						</div>
						<div>
							<FaUserCircle size={48} />
						</div>
						<div className="flex flex-col gap-2">
							<h1
								className="text-base font-normal flex gap-2 items-start leading-5"
							>
								Host by {host?.firstName}
							</h1>
							<p className="text-sm text-secondText font-light">
								Tel: {formattedTel}
							</p>
						</div>
					</div>
				</div>
				<div className="flex flex-col gap-6">
					{justbook === "1" && (
						<>
							<h1 className="text-xl font-medium">
								Thank you for your reservation.
							</h1>
							<hr />
						</>
					)}
					<div className="flex flex-col gap-2">
						<h1 className="text-xl font-medium">Address</h1>

						<a
							href={`https://www.google.com/maps/search/?api=1&query=${simulator.latitude}%2C${simulator.longitude}`}
							target="_blank"
							className="text-base font-base underline text-blue-600"
						>
							{simulator.addressDetail}
						</a>
					</div>
					<hr />
					<div className="flex flex-col gap-2">
						<h1 className="text-xl font-medium">Date/Time</h1>
						<div className="flex-row flex justify-between">
							<div className="text-base font-normal h-full flex flex-col">
								<p>{weekday[day]}</p>
								<p>{date}</p>
								<p className="mt-auto text-xs text-secondText pb-1">
									Please check in at least 10 minutes prior.
								</p>
							</div>
							<ul className="text-right font-light w-1/3">
								{sortedSlots.map((item) => (
									<li key={item.scheduleId}>
										{item.schedule.startTime.slice(0, 5)}-
										{item.schedule.endTime.slice(0, 5)}
									</li>
								))}
							</ul>
						</div>
					</div>
					<hr />
					<div className="flex flex-col gap-2">
						<h1 className="text-xl font-medium">Amount</h1>
						<div className="flex-row flex text-base justify-between">
							<ul className="text-left font-light w-1/2">
								<li>
									${simulator.pricePerHour} x {sortedSlots.length}{" "}
									hrs
								</li>
							</ul>
							<ul className="text-right font-light w-1/2">
								<li>${booking.totalPrice}</li>
							</ul>
						</div>
					</div>
					<hr />
					<div className="flex flex-col gap-1">
						{booking.statusId === 0 || booking.statusId === 3 ? (
							<>
								<small className="w-full text-xs text-neutral-400 font-extralight">
									We&apos;re sorry, but your reservation has been canceled{" "}
									{booking.statusId === 0 && "by host"}.
								</small>
								<Link href={`/product/${simulator.id}`}>
									<div className="w-full text-white bg-primary1 hover:bg-primary1_hover  font-medium rounded-lg text-base px-5 py-3.5 text-center  ">
										Find a New Reservation
									</div>
								</Link>
							</>
						) : (
							<>
								<small className="w-full text-xs text-neutral-400 font-extralight">
									{booking.statusId === 1
										? "Your reservation will be canceled immediately."
										: "You can't cancelling because it's confirmed."}
								</small>
								{booking.statusId === 1 ? (
									<CancelBookingButton
										bookingId={booking.id}
									/>
								) : (
									<button
										className="w-full text-neutral-400 bg-white border-borderColor2 border hover:border-neutral-500 hover:text-neutral-800 focus:ring-4 focus:outline-none font-light rounded-lg text-base px-5 py-3.5 text-center disabled:opacity-50 disabled:bg-borderColor2 disabled:text-neutral-800 disabled:hover:border-borderColor2 disabled:hover:text-neutral-800"
										disabled
									>
										Cancellations
									</button>
								)}
							</>
						)}
					</div>
				</div>
				<hr className="col-span-3" />
				<div className="w-full col-span-3">
					<h1 className="text-[22px] font-medium mb-6">Where you'll play</h1>
					<div className=" rounded-2xl overflow-hidden">
						<ProductMap
							hostid={simulator.hostId}
							lat={simulator.latitude}
							lng={simulator.longitude}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
