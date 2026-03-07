"use client";

import CustomerDashBoard from "@/components/customerDashBoard/CustomerDashBoard";
import { axiosJWTInstance } from "@/lib/http";
import { useEffect, useState } from "react";
import LoadingComponent from "@/components/loading/LoadingComponent";

export default function DashBoard() {
	const [data, setData] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchBookings = async () => {
			try {
				const response = await axiosJWTInstance.get("booking");
				setData(response.data);
			} catch (error) {
				console.error("Failed to fetch bookings:", error);
				setData([]);
			} finally {
				setIsLoading(false);
			}
		};

		fetchBookings();
	}, []);

	if (isLoading) {
		return <LoadingComponent />;
	}

	return <CustomerDashBoard booking={data} />;
}
