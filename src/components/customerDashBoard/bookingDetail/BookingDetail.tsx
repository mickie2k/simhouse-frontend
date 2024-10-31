import { BookingDetailSchedule } from "@/utilities/type";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { MdCancel, MdPending } from "react-icons/md";
import { RiExternalLinkLine } from "react-icons/ri";
import Image from "next/image";
import { FaUserCircle } from "react-icons/fa";
import Link from "next/link";
export default function BookingDetail({
	bookingDetail,
}: {
	bookingDetail: BookingDetailSchedule[];
}) {
	const options = {
		year: "numeric" as const,
		month: "short" as const, // 'short' gives you the abbreviated month name
		day: "numeric" as const,
		timeZone: "Asia/Bangkok", // Change to your desired timezone
	};
	const date = new Date(bookingDetail[0].Date).toLocaleDateString(
		"en-US",
		options
	);
	const weekday = [
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
	];
	const day = new Date(bookingDetail[0].Date).getDay();
	const formattedTel = bookingDetail[0].HTel.replace(/(\d{3})(\d{7})/, "$1-$2");

	function bookingStatus() {
		if (bookingDetail[0].StatusID === 1) {
			return (
				<div className="text-lg flex gap-2 items-start bg-yellow-50 rounded-lg py-3 justify-center">
					<MdPending color="#FFD600" />
					<h1 className="leading-6">Your reservation is pending.</h1>
				</div>
			);
		} else if (bookingDetail[0].StatusID === 2) {
			return (
				<div className="text-lg flex gap-2 items-start bg-green-50 rounded-lg py-3 justify-center">
					<IoIosCheckmarkCircle color="#04CF00" />
					<h1 className="leading-6">Your reservation is confirmed.</h1>
				</div>
			);
		} else if (bookingDetail[0].StatusID === 0) {
			return (
				<div className="text-lg flex gap-2 items-start bg-neutral-100 text-neutral-500 rounded-lg py-3 justify-center">
					<MdCancel color="#737373" />
					<h1 className="leading-6">Your reservation is canceled.</h1>
				</div>
			);
		}
	}

	if (bookingDetail.length === 0) {
		return <div className="text-center">No booking detail found</div>;
	} else {
		return (
			<div className="py-2">
				{bookingStatus()}
				<div className="grid grid-cols-3 gap-20 mt-10">
					<div className="flex flex-col gap-6 col-span-2 overflow-hidden">
						<Image
							src="https://simracingcockpit.gg/wp-content/uploads/2021/10/my-sim-racing-setup.jpg"
							width={400}
							height={400}
							alt={bookingDetail[0].SimID + "_image"}
							className=" w-full object-cover rounded-2xl"
						/>
						<div className="flex flex-row justify-start gap-4">
							<div className="mr-auto">
								<h1 className="text-xl font-medium ">
									{bookingDetail[0].SimListName}
								</h1>
								<Link
									href={`/product/${bookingDetail[0].SimID}`}
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
									className="text-base font-normal flex gap-2 items-start leading-5
								"
								>
									Host by {bookingDetail[0].FName}
								</h1>
								<p className="text-sm text-secondText font-light">
									Tel: {formattedTel}
								</p>
							</div>
						</div>
					</div>
					<div className="flex flex-col gap-6">
						<div className="flex flex-col gap-2">
							<h1 className="text-xl font-medium">Address</h1>

							<a
								href={`https://www.google.com/maps/search/?api=1&query=${bookingDetail[0].Lat}%2C${bookingDetail[0].Long}`}
								target="_blank"
								className="text-base font-base underline text-blue-600"
							>
								{bookingDetail[0].AddressDetail}
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
									{bookingDetail.map((booking) => (
										<li key={booking.ScheduleID}>
											{booking.StartTime.slice(0, -3)}-
											{booking.EndTime.slice(0, -3)}
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
										${bookingDetail[0].PricePerHour} x {bookingDetail.length}{" "}
										hrs
									</li>
								</ul>
								<ul className="text-right font-light w-1/2">
									<li>${bookingDetail[0].TotalPrice}</li>
								</ul>
							</div>
						</div>
						<hr />
						<div className="flex flex-col gap-1">
							{bookingDetail[0].StatusID === 0 ? (
								<>
									<small className="w-full text-xs text-neutral-400 font-extralight">
										We're sorry, but your reservation has been canceled by host.
									</small>
									<Link href={`/product/${bookingDetail[0].SimID}`}>
										<div className="w-full text-white bg-primary1 hover:bg-primary1_hover  font-medium rounded-lg text-base px-5 py-3.5 text-center  ">
											Find a New Reservation
										</div>
									</Link>
								</>
							) : (
								<>
									<small className="w-full text-xs text-neutral-400 font-extralight">
										{bookingDetail[0].StatusID === 1
											? "Your reservation will be canceled immediately."
											: "You can't cancelling because it's confirmed."}
									</small>
									<button
										type="submit"
										className="w-full text-neutral-400 bg-white border-borderColor2 border hover:border-neutral-500 hover:text-neutral-800 focus:ring-4 focus:outline-none  font-light rounded-lg text-base px-5 py-3.5 text-center 
										disabled:opacity-50 disabled:bg-borderColor2 disabled:text-neutral-800 disabled:hover:border-borderColor2 disabled:hover:text-neutral-800 "
										disabled={bookingDetail[0].StatusID === 2}
									>
										Cancellations
									</button>
								</>
							)}
						</div>
					</div>
				</div>
			</div>
		);
	}
}
