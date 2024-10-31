"use client";
import BookingDetail from "@/components/customerDashBoard/bookingDetail/BookingDetail";

import { useEffect, useState } from "react";
export default function BookingPage({
	params,
}: {
	params: { bookid: number };
}) {
	const [bookingDetail, setBookingDetail] = useState([]);
	const [found, setFound] = useState(false);

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
	}, [params.bookid]);
	return (
		<div className="max-w-6xl mx-auto mt-6">
			{found ? (
				<BookingDetail bookingDetail={bookingDetail} />
			) : (
				<div className="text-center">Loading...</div>
			)}
		</div>
	);
}
