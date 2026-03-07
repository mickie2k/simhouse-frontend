import { useEffect, useState, useContext } from "react";
import { Schedule } from "@/types";
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
	const [startTimeHour, startTimeMinute] = schedule.startTime.split(":");
	const { date, setDate } = useContext(DateContext);

	const [isClicked, setIsClicked] = useState<boolean>(false);
	useEffect(() => {
		if (bookList.find((item) => item === id)) {
			setIsClicked(true);
		} else {
			setIsClicked(false);
		}
	}, [bookList, id]);

	function handleClick() {
		if (date === "") {
			setDate(schedule.date);
		}
		if (date === schedule.date) {
			setIsClicked((prevIsClicked: boolean) => !prevIsClicked);
			addList(id);
		} else {
			if (bookList.length === 0) {
				setDate(schedule.date);
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
			className={`flex flex-col w-[74px] bg-transparent border-borderColor2 border text-black rounded-lg justify-center items-center py-3 cursor-pointer ${
				isClicked ? "border-primary1 text-primary1" : ""
			}`}
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
				Available
			</h3>
		</button>
	);
};

export default BookingTime;
