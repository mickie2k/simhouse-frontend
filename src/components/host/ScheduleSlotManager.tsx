"use client";
import { useEffect, useState } from "react";
import { axiosJWTInstance } from "@/lib/http";
import { toast } from "sonner";
import { CalendarCell, toLocalDateStr, isSameDay } from "@/components/ui/CalendarCell";

interface ScheduleSlot {
    id: number;
    date: string; // ISO string
    startTime: string; // HH:MM format
    endTime: string; // HH:MM format
    pricePerHour: number;
    isAvailable: boolean;
}

const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];
const DAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

interface ScheduleSlotManagerProps {
    simulatorId: number;
}

export default function ScheduleSlotManager({ simulatorId }: ScheduleSlotManagerProps) {
    const [scheduleMap, setScheduleMap] = useState<Record<string, ScheduleSlot[]>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Calendar state
    const [calYear, setCalYear] = useState(new Date().getFullYear());
    const [calMonth, setCalMonth] = useState(new Date().getMonth());

    // Selected date for viewing/editing
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    // Edit state for currently editing slot
    const [editingSlotId, setEditingSlotId] = useState<number | null>(null);
    const [editingPrice, setEditingPrice] = useState<string>("");
    const [editingAvailable, setEditingAvailable] = useState<boolean>(true);
    const [saving, setSaving] = useState(false);

    // Ad-hoc slot creation state
    const [isCreatingSlot, setIsCreatingSlot] = useState(false);
    const [newSlotDate, setNewSlotDate] = useState<string>("");
    const [newSlotStartTime, setNewSlotStartTime] = useState<string>("09:00");
    const [newSlotEndTime, setNewSlotEndTime] = useState<string>("10:00");
    const [newSlotPrice, setNewSlotPrice] = useState<string>("");
    const [creatingSlot, setCreatingSlot] = useState(false);
    const [createErrors, setCreateErrors] = useState<Record<string, string>>({});

    // Fetch schedule slots for current month view
    useEffect(() => {
        if (!simulatorId) return;

        const fetchScheduleSlots = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await axiosJWTInstance.get(
                    `host/schedule/${simulatorId}/slots`
                );

                const slots = response.data.data || response.data;
                console.log("Schedule slots response:", slots);
                const map: Record<string, ScheduleSlot[]> = {};

                for (const slot of slots) {
                    const normalised = new Date(slot.date).toLocaleDateString("en-CA", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        timeZone: "Asia/Bangkok",
                    });

                    if (!map[normalised]) map[normalised] = [];

                    // Use pricePerHour from response, fallback to price if needed
                    const pricePerHour = typeof slot.pricePerHour === 'number'
                        ? slot.pricePerHour
                        : (typeof slot.price === 'number'
                            ? slot.price
                            : parseFloat(slot.price) || 0);

                    map[normalised].push({
                        ...slot,
                        date: normalised,
                        pricePerHour: pricePerHour,
                        isAvailable: slot.isAvailable ?? true, // Default to true if not provided
                    });
                }

                // Sort slots by time
                Object.keys(map).forEach((key) => {
                    map[key].sort((a, b) => a.startTime.localeCompare(b.startTime));
                });

                setScheduleMap(map);
            } catch (err) {
                console.error("Error loading schedule slots:", err);
                setError("Failed to load schedule slots. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchScheduleSlots();
    }, [simulatorId]);

    // Calendar navigation
    const firstDay = new Date(calYear, calMonth, 1).getDay();
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    const today = new Date();

    const calCells: (number | null)[] = [
        ...Array(firstDay).fill(null),
        ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ];
    while (calCells.length % 7 !== 0) calCells.push(null);

    function prevMonth() {
        if (calMonth === 0) {
            setCalYear((y) => y - 1);
            setCalMonth(11);
        } else {
            setCalMonth((m) => m - 1);
        }
    }

    function nextMonth() {
        if (calMonth === 11) {
            setCalYear((y) => y + 1);
            setCalMonth(0);
        } else {
            setCalMonth((m) => m + 1);
        }
    }

    function handleDayClick(day: number) {
        const d = new Date(calYear, calMonth, day);
        const key = toLocalDateStr(d);
        if (scheduleMap[key]) {
            setSelectedDate(key);
        }
    }

    function startEditSlot(slot: ScheduleSlot) {
        setEditingSlotId(slot.id);
        setEditingPrice(slot.pricePerHour.toString());
        setEditingAvailable(slot.isAvailable);
    }

    function cancelEdit() {
        setEditingSlotId(null);
        setEditingPrice("");
        setEditingAvailable(true);
    }

    async function saveSlotEdit(slot: ScheduleSlot) {
        if (!editingPrice || parseFloat(editingPrice) < 0) {
            toast.error("Please enter a valid price");
            return;
        }

        try {
            setSaving(true);
            const response = await axiosJWTInstance.patch(
                `/host/schedule/${simulatorId}/slot/${slot.id}`,
                {
                    price: parseFloat(editingPrice),
                    available: editingAvailable,
                }
            );

            if (response.status !== 200) {
                throw new Error("Failed to update slot");
            }
            // Update local state
            setScheduleMap((prevMap) => {
                const updated = { ...prevMap };
                if (selectedDate && updated[selectedDate]) {
                    updated[selectedDate] = updated[selectedDate].map((s) =>
                        s.id === slot.id
                            ? {
                                ...s,
                                pricePerHour: parseFloat(editingPrice),
                                isAvailable: editingAvailable,
                            }
                            : s
                    );
                }
                return updated;
            });

            toast.success("Slot updated successfully");
            setEditingSlotId(null);
        } catch (err) {
            console.error("Error saving slot:", err);
            toast.error("Failed to update slot. Please try again.");
        } finally {
            setSaving(false);
        }
    }

    function validateNewSlot(): boolean {
        const errors: Record<string, string> = {};

        if (!newSlotDate) errors.date = "Please select a date";
        if (!newSlotStartTime) errors.startTime = "Please select start time";
        if (!newSlotEndTime) errors.endTime = "Please select end time";
        if (!newSlotPrice) errors.price = "Please enter a price";

        // Check if date is in the past
        if (newSlotDate) {
            const slotDate = new Date(newSlotDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (slotDate < today) {
                errors.date = "Cannot create slots in the past";
            }
        }

        // Check if start time is before end time
        if (newSlotStartTime && newSlotEndTime) {
            if (newSlotStartTime >= newSlotEndTime) {
                errors.endTime = "End time must be after start time";
            }
        }

        // Check for time conflicts
        if (newSlotDate && scheduleMap[newSlotDate]) {
            const existingSlots = scheduleMap[newSlotDate];
            for (const slot of existingSlots) {
                if (newSlotStartTime < slot.endTime && newSlotEndTime > slot.startTime) {
                    errors.time = "This time slot overlaps with an existing slot";
                    break;
                }
            }
        }

        if (parseFloat(newSlotPrice) <= 0) {
            errors.price = "Price must be greater than 0";
        }

        setCreateErrors(errors);
        return Object.keys(errors).length === 0;
    }

    async function createAdHocSlot() {
        if (!validateNewSlot()) return;

        try {
            setCreatingSlot(true);
            const response = await axiosJWTInstance.post(
                `/host/schedule/${simulatorId}/slot`,
                {
                    date: newSlotDate,
                    startTime: newSlotStartTime,
                    endTime: newSlotEndTime,
                    price: parseFloat(newSlotPrice),
                }
            );

            const createdSlot = response.data.data || response.data;

            // Add the new slot to the schedule map
            setScheduleMap((prevMap) => {
                const updated = { ...prevMap };
                if (!updated[newSlotDate]) updated[newSlotDate] = [];

                updated[newSlotDate].push({
                    id: createdSlot.id,
                    date: newSlotDate,
                    startTime: newSlotStartTime,
                    endTime: newSlotEndTime,
                    pricePerHour: parseFloat(newSlotPrice),
                    isAvailable: true,
                });

                // Re-sort slots
                updated[newSlotDate].sort((a, b) => a.startTime.localeCompare(b.startTime));
                return updated;
            });

            toast.success("Ad-hoc slot created successfully");
            resetCreateForm();
        } catch (err) {
            console.error("Error creating ad-hoc slot:", err);
            toast.error("Failed to create slot. Please try again.");
        } finally {
            setCreatingSlot(false);
        }
    }

    function resetCreateForm() {
        setIsCreatingSlot(false);
        setNewSlotDate("");
        setNewSlotStartTime("09:00");
        setNewSlotEndTime("10:00");
        setNewSlotPrice("");
        setCreateErrors({});
    }

    const selectedSlots = selectedDate ? (scheduleMap[selectedDate] ?? []) : [];
    const availableDates = new Set(Object.keys(scheduleMap));

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="flex flex-col items-center gap-3 text-gray-500">
                    <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm">Loading schedule slots…</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-96">
                <p className="text-sm text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col sm:flex-row gap-6 h-full p-6">
            {/* Left: Calendar */}
            <div className="flex flex-col w-72 shrink-0 justify-center mx-auto">
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
                    <span className="text-sm font-semibold text-gray-900">
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

                <div className="grid grid-cols-7 mb-1">
                    {DAY_LABELS.map((d) => (
                        <div key={d} className="text-center text-xs font-medium text-gray-500 py-1">
                            {d}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-y-1">
                    {calCells.map((day, idx) => {
                        const cellDate = new Date(calYear, calMonth, day ?? 1);
                        const key = day !== null ? toLocalDateStr(cellDate) : `empty-${idx}`;
                        const hasSlots = day !== null && availableDates.has(key);
                        const isPast = day !== null && cellDate < new Date(today.getFullYear(), today.getMonth(), today.getDate());
                        const disabled = day === null || !hasSlots || isPast;

                        return (
                            <div key={key} className="flex flex-col items-center">
                                <CalendarCell
                                    day={day}
                                    idx={idx}
                                    year={calYear}
                                    month={calMonth}
                                    selectedDate={selectedDate || ''}
                                    today={today}
                                    size="md"
                                    disabled={disabled}
                                    hasSlots={hasSlots}
                                    onSelectDate={() => {
                                        if (day !== null) handleDayClick(day);
                                    }}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Divider */}
            <div className="w-px bg-gray-200 shrink-0" />

            {/* Right: Slot Edit */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {!selectedDate ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <svg className="w-12 h-12 text-gray-200 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-sm font-medium text-gray-900">Select a date</p>
                        <p className="text-xs text-gray-500 mt-1">
                            Choose a highlighted date to manage available time slots
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="mb-4">
                            <h3 className="text-sm font-semibold text-gray-900">
                                {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", {
                                    weekday: "long",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </h3>
                            <p className="text-xs text-gray-500 mt-0.5">
                                {selectedSlots.length} slot{selectedSlots.length !== 1 ? "s" : ""} available
                            </p>
                        </div>

                        <div className="overflow-y-auto flex-1 pr-2">
                            {selectedSlots.length === 0 ? (
                                <p className="text-sm text-gray-500">No slots available for this date.</p>
                            ) : (
                                <div className="space-y-3">
                                    {selectedSlots.map((slot) => (
                                        <div
                                            key={slot.id}
                                            className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:border-orange-300 transition"
                                        >
                                            {editingSlotId === slot.id ? (
                                                // Edit mode
                                                <div className="space-y-3">
                                                    <div>
                                                        <label className="block text-xs font-semibold text-gray-600 mb-1">
                                                            Time
                                                        </label>
                                                        <p className="text-sm text-gray-900 font-medium">
                                                            {slot.startTime} - {slot.endTime}
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <label className="block text-xs font-semibold text-gray-600 mb-1">
                                                            Price per Hour
                                                        </label>
                                                        <input
                                                            type="number"
                                                            value={editingPrice}
                                                            onChange={(e) => setEditingPrice(e.target.value)}
                                                            step="0.01"
                                                            min="0"
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                                                        />
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="checkbox"
                                                            id={`available-${slot.id}`}
                                                            checked={editingAvailable}
                                                            onChange={(e) => setEditingAvailable(e.target.checked)}
                                                            className="w-4 h-4 cursor-pointer rounded"
                                                        />
                                                        <label
                                                            htmlFor={`available-${slot.id}`}
                                                            className="text-xs font-medium text-gray-700 cursor-pointer"
                                                        >
                                                            Available for booking
                                                        </label>
                                                    </div>

                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => saveSlotEdit(slot)}
                                                            disabled={saving}
                                                            className="flex-1 px-3 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 disabled:opacity-50 transition"
                                                        >
                                                            {saving ? "Saving..." : "Save"}
                                                        </button>
                                                        <button
                                                            onClick={cancelEdit}
                                                            disabled={saving}
                                                            className="flex-1 px-3 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 disabled:opacity-50 transition"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                // View mode
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-semibold text-gray-900">
                                                            {slot.startTime} - {slot.endTime}
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            {(slot.pricePerHour ?? 0).toFixed(2)} ฿/hour
                                                        </p>
                                                        <div className="mt-2 flex items-center gap-1">
                                                            <span
                                                                className={`text-xs px-2 py-1 rounded-full font-medium ${slot.isAvailable
                                                                    ? "bg-green-100 text-green-700"
                                                                    : "bg-red-100 text-red-700"
                                                                    }`}
                                                            >
                                                                {slot.isAvailable ? "Available" : "Unavailable"}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => startEditSlot(slot)}
                                                        className="px-4 py-2 bg-orange-100 text-orange-600 text-sm font-medium rounded-lg hover:bg-orange-200 transition"
                                                    >
                                                        Edit
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <button
                                onClick={() => setIsCreatingSlot(true)}
                                className="w-full px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-zinc-800 transition"
                            >
                                Add Ad-hoc Slot
                            </button>
                        </div>
                    </>
                )}
            </div>

            {/* Create Ad-hoc Slot Modal */}
            {isCreatingSlot && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Create Ad-hoc Slot</h3>

                        <div className="space-y-4">
                            {/* Date */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    Date <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    value={newSlotDate}
                                    onChange={(e) => setNewSlotDate(e.target.value)}
                                    min={new Date().toISOString().split("T")[0]}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                                {createErrors.date && <p className="text-red-500 text-xs mt-1">{createErrors.date}</p>}
                            </div>

                            {/* Start Time */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    Start Time <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="time"
                                    value={newSlotStartTime}
                                    onChange={(e) => setNewSlotStartTime(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                                {createErrors.startTime && <p className="text-red-500 text-xs mt-1">{createErrors.startTime}</p>}
                            </div>

                            {/* End Time */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    End Time <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="time"
                                    value={newSlotEndTime}
                                    onChange={(e) => setNewSlotEndTime(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                                {createErrors.endTime && <p className="text-red-500 text-xs mt-1">{createErrors.endTime}</p>}
                                {createErrors.time && <p className="text-red-500 text-xs mt-1">{createErrors.time}</p>}
                            </div>

                            {/* Price */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    Price per Hour (฿) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={newSlotPrice}
                                    onChange={(e) => setNewSlotPrice(e.target.value)}
                                    step="0.01"
                                    min="0"
                                    placeholder="0.00"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                                {createErrors.price && <p className="text-red-500 text-xs mt-1">{createErrors.price}</p>}
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={resetCreateForm}
                                disabled={creatingSlot}
                                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 disabled:opacity-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={createAdHocSlot}
                                disabled={creatingSlot}
                                className="flex-1 px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 disabled:opacity-50 transition"
                            >
                                {creatingSlot ? "Creating..." : "Create Slot"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
