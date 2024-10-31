import CustomerDashBoard from "@/components/customerDashBoard/CustomerDashBoard";
import { headers } from "next/headers";

export default async function DashBoard() {
	let data = [];
	const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}user/booking`, {
		method: "GET",
		credentials: "include",
		headers: headers(),
		cache: "default",
	});
	if (res.status == 200) {
		data = await res.json();
	}
	return <CustomerDashBoard booking={data} />;
}
