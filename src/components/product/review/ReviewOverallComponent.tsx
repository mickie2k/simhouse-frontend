import { Star } from "lucide-react";

export type RatingBreakdownItem = {
    label: string;
    value: number;
};

type ReviewOverallComponentProps = {
    averageRating: number;
    totalReviews: number;
    categories: RatingBreakdownItem[];
};

export default function ReviewOverallComponent({
    averageRating,
    totalReviews,
    categories,
}: ReviewOverallComponentProps) {
    const leftColumn = categories.slice(0, Math.ceil(categories.length / 2));
    const rightColumn = categories.slice(Math.ceil(categories.length / 2));

    const renderCategory = (item: RatingBreakdownItem) => {
        const widthPercent = Math.min((item.value / 5) * 100, 100);

        return (
            <div key={item.label} className="flex items-center gap-4 text-sm">
                <span className="w-24 text-slate-800">{item.label}</span>
                <div className="h-[2px] w-full bg-slate-200 flex-1">
                    <div
                        className="h-[2px] bg-slate-900"
                        style={{ width: `${widthPercent}%` }}
                    />
                </div>
                <span className="w-8 text-right text-slate-900">{item.value.toFixed(1)}</span>
            </div>
        );
    };

    return (
        <div>
            <h2 className="mb-8 flex items-center gap-2 text-2xl font-semibold text-slate-950">
                <Star className="h-6 w-6 fill-current" />
                <span>
                    {averageRating.toFixed(1)} - {totalReviews} reviews
                </span>
            </h2>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-12">
                <div className="space-y-4">{leftColumn.map(renderCategory)}</div>
                <div className="space-y-4">{rightColumn.map(renderCategory)}</div>
            </div>
        </div>
    );
}