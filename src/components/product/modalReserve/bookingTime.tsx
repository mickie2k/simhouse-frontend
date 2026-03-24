"use client";
import { useEffect, useState, useContext } from "react";
import { toast } from "sonner";
import { Schedule } from "@/types";
import { HiArrowLongRight } from "react-icons/hi2";

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
	startTime,
	setStartTime,
	endTime,
	setEndTime,
}: {
	addList: (id: number) => void;
	id: number;
	bookList: number[];
	schedule: Schedule;
	startTime?: string;
	setStartTime?: React.Dispatch<React.SetStateAction<string>>;
	endTime?: string;
	setEndTime?: React.Dispatch<React.SetStateAction<string>>;
}) => {
	const { date, setDate } = useContext(DateContext);
	const [isSelected, setIsSelected] = useState(false);

	useEffect(() => {
		setIsSelected(bookList.includes(id));
	}, [bookList, id]);

	function handleClick() {
		// If selecting a slot on a different date while others are already booked
		if (date !== "" && date !== schedule.date && bookList.length > 0) {
			toast.error("You can only book slots on the same date.");
			return;
		}
		if (date === "" || (date !== schedule.date && bookList.length === 0)) {
			setDate(schedule.date);
		}
		if (startTime && setStartTime && schedule.startTime <= startTime) {
			setStartTime(schedule.startTime);
		}
		if (endTime && setEndTime && schedule.endTime >= endTime) {
			setEndTime(schedule.endTime);
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
			<span className="font-semibold text-sm ">{start}</span>
			<span className="text-base"><HiArrowLongRight /></span>
			<span className="font-semibold text-sm">{end}</span>
		</button>
	);
};

export default BookingTime;
