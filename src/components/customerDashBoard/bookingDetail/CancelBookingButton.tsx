"use client";

import { useState } from "react";
import { axiosJWTInstance } from "@/lib/http";
import { toast } from "sonner";

export default function CancelBookingButton({
	bookingId,
}: {
	bookingId: number;
}) {
	const [isLoading, setIsLoading] = useState(false);

	async function cancelBooking() {
		setIsLoading(true);
		try {
			const response = await axiosJWTInstance.delete<{ status: boolean }>(
				`booking/${bookingId}`
			);
			const data = response.data;
			if (data.status) {
				window.location.reload();
			} else {
				toast.error("Booking cancel failed");
			}
		} catch (error) {
			console.error("Error canceling booking:", error);
			toast.error("An error occurred while canceling the booking");
		} finally {
			setIsLoading(false);
		}

	}

	return (
		<button
			onClick={() => toast("Are you want to cancellation?", {
				description: "This action cannot be undone.",
				action: {
					label: "Yes",
					onClick: () => cancelBooking(),
				},
				cancel: {
					label: "No",
					onClick: () => toast.dismiss(),
				},
			})}
			disabled={isLoading}
			className="w-full text-neutral-400 bg-white border-borderColor2 border hover:border-neutral-500 hover:text-neutral-800 focus:ring-4 focus:outline-none font-light rounded-lg text-base px-5 py-3.5 text-center disabled:opacity-50 disabled:bg-borderColor2 disabled:text-neutral-800 disabled:hover:border-borderColor2 disabled:hover:text-neutral-800"
		>
			{isLoading ? "Canceling..." : "Cancel Booking"}
		</button>
	);
}
