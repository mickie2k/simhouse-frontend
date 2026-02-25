"use client";

import BookingDetail from "@/components/customerDashBoard/bookingDetail/BookingDetail";
import { BookingDetailSchedule } from "@/types";
import { axiosJWTInstance } from "@/lib/http";
import { useParams, useSearchParams, notFound } from "next/navigation";
import { useEffect, useState } from "react";
import LoadingComponent from "@/components/loading/LoadingComponent";

export default function BookingPage() {
	const params = useParams();
	const searchParams = useSearchParams();
	const bookid = params.bookid as string;
	const justbook = searchParams.get("justbook") || "0";

	const [bookingDetail, setBookingDetail] = useState<BookingDetailSchedule[] | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [notFoundError, setNotFoundError] = useState(false);

	useEffect(() => {
		const fetchBookingDetail = async () => {
			try {
				const response = await axiosJWTInstance.get<BookingDetailSchedule[]>(
					`user/booking/${bookid}/schedule`
				);
				
				if (!response.data || response.data.length === 0) {
					setNotFoundError(true);
				} else {
					setBookingDetail(response.data);
				}
			} catch (error) {
				console.error("Failed to fetch booking details:", error);
				setNotFoundError(true);
			} finally {
				setIsLoading(false);
			}
		};

		if (bookid) {
			fetchBookingDetail();
		}
	}, [bookid]);

	if (isLoading) {
		return <LoadingComponent />;
	}

	if (notFoundError || !bookingDetail) {
		notFound();
	}

	return (
		<div className="max-w-6xl mx-auto mt-6">
			<BookingDetail
				bookingDetail={bookingDetail}
				justbook={justbook}
			/>
		</div>
	);
}
