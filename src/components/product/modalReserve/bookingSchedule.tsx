import { useEffect, useState } from "react";
import BookingDate from "./bookingDate";
import { Schedule } from "@/types";
import { axiosInstance } from "@/lib/http";

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
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchSchedule = async () => {
			try {
				setLoading(true);
				setError(null);
				
				const response = await axiosInstance.get<Schedule[]>(
					`product/id/${id}/booking`
				);
				const data = response.data;

				if (!data || data.length === 0) {
					setDataSchedule([]);
					setLoading(false);
					return;
				}

				const groupedData = data.reduce(
					(
						acc: { [date: string]: { Date: string; Data: Schedule[] } },
						item: Schedule
					) => {
						const options = {
							year: "numeric" as const,
							month: "2-digit" as const,
							day: "2-digit" as const,
							timeZone: "Asia/Bangkok",
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
			} catch (err) {
				console.error("Failed to fetch schedule:", err);
				setError("Failed to load schedule. Please try again.");
			} finally {
				setLoading(false);
			}
		};

		if (id) {
			fetchSchedule();
		}
	}, [id]);

	return (
		<div className="flex-col flex gap-4 h-2/5 overflow-y-scroll">
			{loading && <h1>Loading...</h1>}
			{error && <h1 className="text-red-500">{error}</h1>}
			{!loading && !error && dataSchedule.length > 0 && (
				dataSchedule.map((item) => (
					<div key={item.Date}>
						<BookingDate
							addList={addList}
							bookList={bookList}
							date={item.Date}
							data={item.Data}
						/>
						<hr />
					</div>
				))
			)}
			{!loading && !error && dataSchedule.length === 0 && (
				<h1>No available schedule</h1>
			)}
		</div>
	);
}
