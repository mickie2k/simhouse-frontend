import { useEffect, useState } from "react";
import BookingDate from "./bookingDate";
import { Schedule } from "@/utilities/type";

export default function BookingSchedule({
	addList,
	bookList,
	id,
}: {
	addList: (id: number) => void;
	bookList: number[];
	id: number;
}) {
	const [dataSchedule, setDataSchedule] = useState<
		{ Date: string; Data: Schedule[] }[]
	>([]);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		fetch(`${process.env.NEXT_PUBLIC_API_URL}product/id/${id}/booking`)
			.then((res) => {
				if (!res.ok) {
					console.log(`HTTP error! Status: ${res.status}`);
				}
				return res.json();
			})
			.then((data) => {
				if (data === undefined) return;
				setLoading(false);
				const groupedData = data.reduce(
					(
						acc: { [date: string]: { Date: string; Data: Schedule[] } },
						item: Schedule
					) => {
						const options = {
							year: "numeric" as const,
							month: "2-digit" as const,
							day: "2-digit" as const,
							timeZone: "Asia/Bangkok", // Change to your desired timezone
						};

						item.Date = new Date(item.Date).toLocaleDateString(
							"en-CA",
							options
						);

						const date = new Date(item.Date).toISOString().split("T")[0];
						if (!acc[date]) {
							acc[date] = { Date: date, Data: [] };
						}
						acc[date].Data.push(item);
						return acc;
					},
					{} as { [key: string]: { Date: string; Data: Schedule[] } }
				);
				const resultArray = Object.values(groupedData) as {
					Date: string;
					Data: Schedule[];
				}[];
				setDataSchedule(resultArray);
			});
	}, [id]);

	return (
		<div className="flex-col flex gap-4 h-2/5 overflow-y-scroll">
			{loading ? (
				<h1>Loading...</h1>
			) : (
				dataSchedule.map((item) => (
					<>
						<BookingDate
							key={item.Date}
							addList={addList}
							bookList={bookList}
							date={item.Date}
							data={item.Data}
						/>
						<hr />
					</>
				))
			)}
			{dataSchedule.length === 0 && !loading && (
				<h1 className="">No available schedule</h1>
			)}
			{/* <BookingDate addList={addList} bookList={bookList} /> */}

			{/* <BookingDate />
			<hr />
			<BookingDate />
			<hr />
			<BookingDate />
			<hr />
			<BookingDate />
			<hr />
			<BookingDate />
			<hr />
			<BookingDate />
			<hr /> */}
		</div>
	);
}
