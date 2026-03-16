"use client";

import { useMemo, useState } from "react";

export type ReviewItem = {
    id: number;
    reviewerName: string;
    reviewDate: string;
    comment: string;
};

type ReviewCardComponentProps = {
    review: ReviewItem;
};

export default function ReviewCardComponent({ review }: ReviewCardComponentProps) {
    const [expanded, setExpanded] = useState(false);
    const isLongComment = review.comment.length > 180;

    const initials = useMemo(() => {
        return review.reviewerName
            .split(" ")
            .map((segment) => segment[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();
    }, [review.reviewerName]);

    const displayedComment =
        expanded || !isLongComment
            ? review.comment
            : `${review.comment.slice(0, 180).trimEnd()}...`;

    return (
        <article className="space-y-4">
            <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-700">
                    {initials}
                </div>
                <div>
                    <p className="text-sm font-semibold text-slate-950">{review.reviewerName}</p>
                    <p className="text-sm text-slate-500">{review.reviewDate}</p>
                </div>
            </div>

            <p className="leading-7 text-slate-800">{displayedComment}</p>

            {isLongComment ? (
                <button
                    type="button"
                    onClick={() => setExpanded((prev) => !prev)}
                    className="text-sm font-semibold text-slate-950 underline underline-offset-4"
                >
                    {expanded ? "Show less" : "Show more"}
                </button>
            ) : null}
        </article>
    );
}
