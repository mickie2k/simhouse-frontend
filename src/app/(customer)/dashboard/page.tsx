import CustomerDashBoard from "@/components/customerDashBoard/CustomerDashBoard";
import { headers } from "next/headers";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "My Dashboard",
	description: "View and manage your simulator bookings",
};

export default async function DashBoard() {
	let data = [];

	const headersList = await headers();

	const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}user/booking`, {
		method: "GET",
		credentials: "include",
		headers: headersList,
		cache: "no-store",
	});

	if (res.status === 200) {
		data = await res.json();
	}

	return <CustomerDashBoard booking={data} />;
}
