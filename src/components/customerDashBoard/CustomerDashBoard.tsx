import { Booking } from "@/utilities/type";
import React from "react";
import BookingCard from "./BookingCard";
interface CustomerDashBoardProps {
	booking: Booking[];
}

const CustomerDashBoard: React.FC<CustomerDashBoardProps> = ({ booking }) => {
	return (
		<div className=" h-auto mt-12 max-w-6xl px-8 mx-auto xl:px-0">
			<div>
				<h2 className="text-3xl font-bold mb-6">Your Booking</h2>
			</div>
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4  ">
				{booking.map((book) => (
					<BookingCard key={book.BookingID} booking={book} />
				))}
			</div>
		</div>
	);
};

export default CustomerDashBoard;
