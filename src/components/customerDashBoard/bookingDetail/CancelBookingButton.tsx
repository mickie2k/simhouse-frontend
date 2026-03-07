"use client";

import { useState } from "react";
import { axiosJWTInstance } from "@/lib/http";

export default function CancelBookingButton({
	bookingId,
}: {
	bookingId: number;
}) {
	const [isLoading, setIsLoading] = useState(false);

	async function cancelBooking() {
		const userConfirmed = confirm("Are you want to cancellation?");
		if (userConfirmed) {
			setIsLoading(true);
			try {
			const response = await axiosJWTInstance.delete<{ status: boolean }>(
				`booking/${bookingId}`
			);
				const data = response.data;
				if (data.status) {
					window.location.reload();
				} else {
					alert("Booking cancel failed");
				}
			} catch (error) {
				console.error("Error canceling booking:", error);
				alert("An error occurred while canceling the booking");
			} finally {
				setIsLoading(false);
			}
		}
	}

	return (
		<button
			onClick={cancelBooking}
			disabled={isLoading}
			className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
		>
			{isLoading ? "Canceling..." : "Cancel Booking"}
		</button>
	);
}
