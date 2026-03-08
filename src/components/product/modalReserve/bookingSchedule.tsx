"use client";
import { useEffect, useState, useContext } from "react";
import { Schedule } from "@/types";
import { axiosInstance } from "@/lib/http";
import { DateContext } from "../ProductDetail";
import BookingTime from "./bookingTime";

// ─── Calendar helpers ─────────────────────────────────────────────────────────

const MONTH_NAMES = [
	"January", "February", "March", "April", "May", "June",
	"July", "August", "September", "October", "November", "December",
];
const DAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function isSameDay(a: Date, b: Date) {
	return (
		a.getFullYear() === b.getFullYear() &&
		a.getMonth() === b.getMonth() &&
		a.getDate() === b.getDate()
	);
}

function toLocalDateStr(d: Date) {
	// Returns "YYYY-MM-DD" in local time
	const y = d.getFullYear();
	const m = String(d.getMonth() + 1).padStart(2, "0");
	const day = String(d.getDate()).padStart(2, "0");
	return `${y}-${m}-${day}`;
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function BookingSchedule({
	addList,
	bookList,
	id,
}: {
	addList: (id: number) => void;
	bookList: number[];
	id: number;
}) {
	// Raw schedule data grouped by date string "YYYY-MM-DD"
	const [scheduleMap, setScheduleMap] = useState<Record<string, Schedule[]>>({});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Calendar state
	const [calYear, setCalYear] = useState(new Date().getFullYear());
	const [calMonth, setCalMonth] = useState(new Date().getMonth()); // 0-indexed

	// Selected date (local date string "YYYY-MM-DD")
	const { date: selectedDate, setDate: setSelectedDate } = useContext(DateContext);

	// ── Fetch schedule ──────────────────────────────────────────────────────────
	useEffect(() => {
		if (!id) return;
		const fetchSchedule = async () => {
			try {
				setLoading(true);
				setError(null);
				const response = await axiosInstance.get<Schedule[]>(
					`simulator/${id}/schedule`
				);
				const data = response.data;
				console.log(data)
				const map: Record<string, Schedule[]> = {};
				for (const item of data) {
					// Normalise date to "YYYY-MM-DD" in Bangkok timezone
					const normalised = new Date(item.date).toLocaleDateString("en-CA", {
						year: "numeric",
						month: "2-digit",
						day: "2-digit",
						timeZone: "Asia/Bangkok",
					});
					item.date = normalised;
					if (!map[normalised]) map[normalised] = [];
					map[normalised].push(item);
				}
				setScheduleMap(map);

				// Auto-navigate calendar to first available month
				const firstKey = Object.keys(map).sort()[0];
				if (firstKey) {
					const [y, m] = firstKey.split("-").map(Number);
					setCalYear(y);
					setCalMonth(m - 1);
				}
			} catch {
				setError("Failed to load schedule. Please try again.");
			} finally {
				setLoading(false);
			}
		};
		fetchSchedule();
	}, [id]);

	// ── Calendar grid ───────────────────────────────────────────────────────────
	const firstDay = new Date(calYear, calMonth, 1).getDay(); // 0=Sun
	const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
	const today = new Date();

	const calCells: (number | null)[] = [
		...Array(firstDay).fill(null),
		...Array.from({ length: daysInMonth }, (_, i) => i + 1),
	];
	// Pad to complete last row
	while (calCells.length % 7 !== 0) calCells.push(null);

	function prevMonth() {
		if (calMonth === 0) { setCalYear(y => y - 1); setCalMonth(11); }
		else setCalMonth(m => m - 1);
	}
	function nextMonth() {
		if (calMonth === 11) { setCalYear(y => y + 1); setCalMonth(0); }
		else setCalMonth(m => m + 1);
	}

	function handleDayClick(day: number) {
		const d = new Date(calYear, calMonth, day);
		const key = toLocalDateStr(d);
		if (!scheduleMap[key]) return; // no availability
		// If different date selected, clear bookList context
		if (selectedDate !== key) {
			setSelectedDate(key);
		}
	}

	// Slots for selected date
	const selectedSlots = selectedDate ? (scheduleMap[selectedDate] ?? []) : [];

	// ── Render ──────────────────────────────────────────────────────────────────
	if (loading) {
		return (
			<div className="flex items-center justify-center h-full">
				<div className="flex flex-col items-center gap-3 text-secondText">
					<div className="w-8 h-8 border-2 border-primary1 border-t-transparent rounded-full animate-spin" />
					<span className="text-sm">Loading availability…</span>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex items-center justify-center h-full">
				<p className="text-sm text-red-500">{error}</p>
			</div>
		);
	}

	const availableDates = new Set(Object.keys(scheduleMap));

	return (
		<div className="flex gap-6 h-full">
			{/* ── Left: Calendar ─────────────────────────────────────────────── */}
			<div className="flex flex-col w-72 shrink-0">
				{/* Month navigation */}
				<div className="flex items-center justify-between mb-4">
					<button
						onClick={prevMonth}
						className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
						aria-label="Previous month"
					>
						<svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
							<path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
						</svg>
					</button>
					<span className="text-sm font-semibold text-black2">
						{MONTH_NAMES[calMonth]} {calYear}
					</span>
					<button
						onClick={nextMonth}
						className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
						aria-label="Next month"
					>
						<svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
							<path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
						</svg>
					</button>
				</div>

				{/* Day-of-week headers */}
				<div className="grid grid-cols-7 mb-1">
					{DAY_LABELS.map(d => (
						<div key={d} className="text-center text-xs font-medium text-secondText py-1">
							{d}
						</div>
					))}
				</div>

				{/* Calendar cells */}
				<div className="grid grid-cols-7 gap-y-1">
					{calCells.map((day, idx) => {
						if (day === null) {
							return <div key={`empty-${idx}`} />;
						}
						const cellDate = new Date(calYear, calMonth, day);
						const key = toLocalDateStr(cellDate);
						const hasSlots = availableDates.has(key);
						const isToday = isSameDay(cellDate, today);
						const isSelected = selectedDate === key;
						const isPast = cellDate < new Date(today.getFullYear(), today.getMonth(), today.getDate());

						return (
							<div key={key} className="flex flex-col items-center">
								<button
									onClick={() => handleDayClick(day)}
									disabled={!hasSlots || isPast}
									className={[
										"w-9 h-9 rounded-full text-sm font-medium transition-colors",
										isSelected
											? "bg-primary1 text-white"
											: hasSlots && !isPast
												? "hover:bg-orange-50 text-black2 cursor-pointer"
												: "text-gray-300 cursor-default",
										isToday && !isSelected ? "ring-1 ring-primary1 text-primary1" : "",
									].join(" ")}
								>
									{day}
								</button>
								{/* Availability dot */}
								{hasSlots && !isPast && (
									<div className={`w-1 h-1 rounded-full mt-0.5 ${isSelected ? "bg-white" : "bg-primary1"}`} />
								)}
							</div>
						);
					})}
				</div>

				{/* Legend */}
				<div className="mt-4 flex items-center gap-3 text-xs text-secondText">
					<span className="flex items-center gap-1">
						<span className="w-2 h-2 rounded-full bg-primary1 inline-block" />
						Available
					</span>
					<span className="flex items-center gap-1">
						<span className="w-2 h-2 rounded-full bg-gray-200 inline-block" />
						Unavailable
					</span>
				</div>
			</div>

			{/* Divider */}
			<div className="w-px bg-gray-200 shrink-0" />

			{/* ── Right: Time slots ──────────────────────────────────────────── */}
			<div className="flex-1 flex flex-col overflow-hidden">
				{!selectedDate ? (
					<div className="flex flex-col items-center justify-center h-full text-center">
						<svg className="w-12 h-12 text-gray-200 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
							<path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
						</svg>
						<p className="text-sm font-medium text-black2">Select a date</p>
						<p className="text-xs text-secondText mt-1">
							Choose a highlighted date to see available time slots
						</p>
					</div>
				) : (
					<>
						<div className="mb-3">
							<h3 className="text-sm font-semibold text-black2">
								{new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", {
									weekday: "long",
									month: "long",
									day: "numeric",
								})}
							</h3>
							<p className="text-xs text-secondText mt-0.5">
								{selectedSlots.length} slot{selectedSlots.length !== 1 ? "s" : ""} available
							</p>
						</div>
						<div className="overflow-y-auto flex-1 pr-1">
							{selectedSlots.length === 0 ? (
								<p className="text-sm text-secondText">No slots available for this date.</p>
							) : (
								<div className="grid grid-cols-2 gap-2">
									{selectedSlots.map((slot) => (
										<BookingTime
											key={slot.id}
											id={slot.id}
											addList={addList}
											schedule={slot}
											bookList={bookList}
										/>
									))}
								</div>
							)}
						</div>
					</>
				)}
			</div>
		</div>
	);
}
