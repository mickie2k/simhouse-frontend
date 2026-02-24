import BookingDetail from "@/components/customerDashBoard/bookingDetail/BookingDetail";
import { BookingDetailSchedule } from "@/types";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Booking Details",
	description: "View your booking details and schedule",
};

export default async function BookingPage({
	params,
	searchParams,
}: {
	params: Promise<{ bookid: string }>;
	searchParams: Promise<{ justbook?: string }>;
}) {
	const { bookid } = await params;
	const { justbook = "0" } = await searchParams;

	const headersList = await headers();
	const cookie = (await headersList).get("cookie") || "";

	const res = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}user/booking/${bookid}/schedule`,
		{
			method: "GET",
			credentials: "include",
			headers: {
				Cookie: cookie,
			},
			cache: "no-store",
		}
	);

	if (res.status !== 200) {
		notFound();
	}

	const bookingDetail: BookingDetailSchedule[] = await res.json();

	if (!bookingDetail || bookingDetail.length === 0) {
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
