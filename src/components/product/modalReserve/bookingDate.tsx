import BookingTime from "./bookingTime";
import { Schedule } from "@/types";
export default function BookingDate({
	addList,
	bookList,
	date,
	data,
}: {
	addList: (id: number) => void;
	bookList: number[];
	date: string;
	data: Schedule[];
}) {
	 
	const [year, month, day] = date.split("-").map(Number);

	// Array of month names
	const monthNames = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];

	// Get the full month name
	const fullMonthName = monthNames[month - 1];
	return (
		<div className="flex  gap-2">
			<div className="flex flex-col w-32 bg-black2 text-white rounded-lg justify-center items-center py-3 gap-1">
				<h6 className="text-xs font-extralight">{fullMonthName}</h6>
				<h3 className="text-lg font-semibold leading-5">{day}</h3>
			</div>
			<div className="flex flex-row flex-wrap  gap-2 w-full">
			{data.map((item: Schedule) => (
				<BookingTime
					key={item.id}
					id={item.id}
					addList={addList}
					schedule={item}
					bookList={bookList}
				/>
			))}
			</div>
		</div>
	);
}
