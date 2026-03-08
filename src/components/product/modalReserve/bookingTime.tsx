"use client";
import { useEffect, useState, useContext } from "react";
import { Schedule } from "@/types";
import { DateContext } from "../ProductDetail";

// Format "HH:MM:SS" → "H:MM AM/PM"
function formatTime(timeStr: string): string {
	const [hourStr, minStr] = timeStr.split(":");
	let hour = parseInt(hourStr, 10);
	const min = minStr ?? "00";
	const period = hour >= 12 ? "PM" : "AM";
	hour = hour % 12 || 12;
	return `${hour}:${min} ${period}`;
}

const BookingTime = ({
	addList,
	id,
	bookList,
	schedule,
}: {
	addList: (id: number) => void;
	id: number;
	bookList: number[];
	schedule: Schedule;
}) => {
	const { date, setDate } = useContext(DateContext);
	const [isSelected, setIsSelected] = useState(false);

	useEffect(() => {
		setIsSelected(bookList.includes(id));
	}, [bookList, id]);

	function handleClick() {
		// If selecting a slot on a different date while others are already booked
		if (date !== "" && date !== schedule.date && bookList.length > 0) {
			alert("You can only book slots on the same date.");
			return;
		}
		if (date === "" || (date !== schedule.date && bookList.length === 0)) {
			setDate(schedule.date);
		}
		addList(id);
	}

	const start = formatTime(schedule.startTime);
	const end = formatTime(schedule.endTime);

	return (
		<button
			type="button"
			onClick={handleClick}
			className={[
				"flex items-center justify-between w-full px-4 py-3 rounded-xl border text-sm font-medium transition-all",
				isSelected
					? "border-primary1 bg-orange-50 text-primary1"
					: "border-gray-200 bg-white text-black2 hover:border-gray-400",
			].join(" ")}
		>
			<span className="font-semibold">{start}</span>
			<span className="text-xs text-secondText mx-1">→</span>
			<span className="font-semibold">{end}</span>
			{isSelected && (
				<span className="ml-2 w-4 h-4 flex items-center justify-center rounded-full bg-primary1 text-white text-[10px] shrink-0">
					✓
				</span>
			)}
		</button>
	);
};

export default BookingTime;
