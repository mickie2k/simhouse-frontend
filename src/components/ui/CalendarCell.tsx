function toLocalDateStr(d: Date) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}

function isSameDay(a: Date, b: Date) {
    return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    );
}

interface CalendarCellProps {
    day: number | null;
    idx: number;
    year: number;
    month: number;
    selectedDate: string;
    today: Date;
    size?: "sm" | "md"; // sm = w-8 h-8, md = w-9 h-9
    onSelectDate: (dateStr: string) => void;
    disabled?: boolean;
    hasSlots?: boolean;
}

export function CalendarCell({
    day,
    idx,
    year,
    month,
    selectedDate,
    today,
    size = "md",
    onSelectDate,
    disabled = false,
    hasSlots = true,
}: CalendarCellProps) {
    if (day === null) {
        return <div key={`empty-${idx}`} />;
    }

    const cellDate = new Date(year, month, day);
    const key = toLocalDateStr(cellDate);
    const isSelected = selectedDate === key;
    const isToday = isSameDay(cellDate, today);

    const sizeClass = size === "sm" ? "w-8 h-8" : "w-9 h-9";

    return (
        <button
            key={key}
            onClick={() => onSelectDate(key)}
            disabled={disabled}
            className={[
                `${sizeClass} rounded-full text-sm font-medium transition-colors`,
                isSelected
                    ? "bg-primary1 text-white"
                    : disabled
                        ? "text-gray-300 cursor-default"
                        : hasSlots
                            ? "hover:bg-orange-50 text-black2 cursor-pointer"
                            : "text-gray-300 cursor-default",
                isToday && !isSelected ? "ring-1 ring-primary1 text-primary1" : "",
            ].join(" ")}
        >
            {day}
        </button>
    );
}

export { toLocalDateStr, isSameDay };
