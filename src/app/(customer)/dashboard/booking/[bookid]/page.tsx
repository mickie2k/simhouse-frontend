"use client";
import BookingDetail from "@/components/customerDashBoard/bookingDetail/BookingDetail";
import LoadingComponent from "@/components/loading/LoadingComponent";
import { BookingDetailSchedule } from "@/utilities/type";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
export default function BookingPage({
	params,
}: {
	params: { bookid: number };
}) {
	const [bookingDetail, setBookingDetail] = useState<BookingDetailSchedule[]>(
		[]
	);
	const [found, setFound] = useState(false);
	const [cancel, setCancel] = useState(false);
	const justbook = useSearchParams().get("justbook") || "0";

	useEffect(() => {
		const fetchBookingDetail = async () => {
			const bookingid = params.bookid;

			const res = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}user/booking/${bookingid}/schedule`,
				{
					method: "GET",
					credentials: "include",
				}
			);

			if (res.status == 200) {
				const data = await res.json();

				setBookingDetail(data);
				setFound(true);
			}
		};

		fetchBookingDetail();
	}, [params.bookid, cancel]);

	async function cancelBooking() {
		const userConfirmed = confirm("Are you want to cancellation?");
		if (userConfirmed) {
			// User clicked OK
			// Perform the action

			const res = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}user/booking/${bookingDetail[0].BookingID}`,
				{
					method: "DELETE",
					credentials: "include",
				}
			);
			if (res.status == 200) {
				const data = await res.json();
				if (data.status) {
					console.log("Booking canceled");
				} else {
					alert("Booking cancel failed");
				}
				setCancel(!cancel);
			}
		}
	}

	return (
		<div className="max-w-6xl mx-auto mt-6  ">
			{found ? (
				<BookingDetail
					bookingDetail={bookingDetail}
					cancelFunction={cancelBooking}
					justbook={justbook}
				/>
			) : (
				<LoadingComponent />
			)}
		</div>
	);
}
