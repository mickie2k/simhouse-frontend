import { useEffect, useState, useContext } from "react";
import { Schedule } from "@/utilities/type";
import { DateContext } from "../ProductDetail";

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
	const [startTimeHour, startTimeMinute] = schedule.StartTime.split(":");
	const { date, setDate } = useContext(DateContext);
	// const [startTime, PMorAM] = convertTo12HourFormatWithMinutes(
	// 	schedule.StartTime
	// );

	// function convertTo12HourFormatWithMinutes(time: string) {
	// 	const hours = time.split(":")[0];
	// 	let hour = parseInt(hours, 10);
	// 	const isPM = hour >= 12;
	// 	hour = hour % 12 || 12; // Convert to 12-hour format

	// 	// Construct the final time string
	// 	return [`${hour}`, `${isPM ? "PM" : "AM"}`];
	// }
	const [isClicked, setIsClicked] = useState<boolean>(false);
	useEffect(() => {
		if (bookList.find((item) => item === id)) {
			setIsClicked(true);
		} else {
			setIsClicked(false);
		}
	}, [bookList, id]);

	function handleClick() {
		if (schedule.Available === 0) return;
		if (date === "") {
			setDate(schedule.Date);
		}
		if (date === schedule.Date) {
			setIsClicked((prevIsClicked: boolean) => !prevIsClicked);
			addList(id);
		} else {
			if (bookList.length === 0) {
				setDate(schedule.Date);
				setIsClicked((prevIsClicked: boolean) => !prevIsClicked);
				addList(id);
			} else {
				alert("You can only book in the same date");
			}
		}
	}
	return (
		<button
			onClick={handleClick}
			className={`flex flex-col w-[74px] bg-transparent border-borderColor2 border text-black rounded-lg justify-center items-center py-3 cursor-pointer disabled:bg-neutral-300 disabled:opacity-40 disabled:cursor-default ${
				isClicked ? "border-primary1 text-primary1" : ""
			}`}
			disabled={schedule.Available === 0}
		>
			<h6 className="text-lg leading-5">
				{startTimeHour.startsWith("0") ? startTimeHour.slice(1) : startTimeHour}
				<span className="text-lg font-normal">:{startTimeMinute}</span>
			</h6>
			<h3
				className={`text-xs font-extralight  ${
					isClicked ? "text-primary1" : "text-neutral-500"
				}`}
			>
				{schedule.Available === 0 ? "Booked" : "Available"}
			</h3>
		</button>
	);
};

export default BookingTime;
