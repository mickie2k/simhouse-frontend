"use client";

import { useState } from "react";
import { axiosJWTInstance } from "@/lib/http";
import { toast } from "sonner";
import { IoIosCheckmarkCircle } from "react-icons/io";

const REVIEW_TYPES = [
    { typeId: 1, typeName: "Cleanliness" },
    { typeId: 2, typeName: "Communication" },
    { typeId: 3, typeName: "Check-in" },
    { typeId: 4, typeName: "Accuracy" },
    { typeId: 5, typeName: "Location" },
    { typeId: 6, typeName: "Value" },
] as const;

function StarRating({
    value,
    onChange,
    size = "text-2xl",
}: {
    value: number;
    onChange: (rating: number) => void;
    size?: string;
}) {
    const [hovered, setHovered] = useState(0);

    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => onChange(star)}
                    onMouseEnter={() => setHovered(star)}
                    onMouseLeave={() => setHovered(0)}
                    className={`${size} focus:outline-none transition-colors leading-none ${star <= (hovered || value)
                            ? "text-yellow-400"
                            : "text-neutral-300"
                        }`}
                    aria-label={`Rate ${star} out of 5`}
                >
                    ★
                </button>
            ))}
        </div>
    );
}

export default function ReviewForm({
    bookingId,
    alreadyReviewed = false,
}: {
    bookingId: number;
    alreadyReviewed?: boolean;
}) {
    const [overallRating, setOverallRating] = useState(0);
    const [comment, setComment] = useState("");
    const [ratings, setRatings] = useState<Record<number, number>>(
        Object.fromEntries(REVIEW_TYPES.map((t) => [t.typeId, 0]))
    );
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(alreadyReviewed);

    const setRating = (typeId: number, rating: number) => {
        setRatings((prev) => ({ ...prev, [typeId]: rating }));
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (overallRating === 0) {
            toast.error("Please provide an overall rating.");
            return;
        }
        if (Object.values(ratings).some((r) => r === 0)) {
            toast.error("Please rate all categories.");
            return;
        }

        setIsSubmitting(true);
        try {
            await axiosJWTInstance.post(`booking/${bookingId}/review`, {
                bookingId,
                overallRating,
                comment,
                reviewDetails: REVIEW_TYPES.map((t) => ({
                    typeId: t.typeId,
                    rating: ratings[t.typeId],
                })),
            });
            toast.success("Review submitted successfully!");
            setSubmitted(true);
        } catch (error) {
            console.error("Failed to submit review:", error);
            toast.error("Failed to submit review. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    }

    if (submitted) {
        return (
            <div className="col-span-3 border border-green-200 bg-green-50 rounded-2xl p-8 text-center flex flex-col items-center gap-3">
                <IoIosCheckmarkCircle size={48} color="#16a34a" />
                <h2 className="text-xl font-medium text-green-700">
                    Thank you for your review!
                </h2>
                <p className="text-sm text-secondText">
                    Your feedback helps improve the experience for everyone.
                </p>
            </div>
        );
    }

    return (
        <div className="col-span-3">
            <h1 className="text-[22px] font-medium mb-6">Leave a Review</h1>
            <form
                onSubmit={handleSubmit}
                className="border border-borderColor2 rounded-2xl p-6 flex flex-col gap-6"
            >
                {/* Overall Rating */}
                <div className="flex flex-col gap-2">
                    <label className="text-base font-medium">Overall Rating</label>
                    <StarRating
                        value={overallRating}
                        onChange={setOverallRating}
                        size="text-4xl"
                    />
                </div>
                <hr />
                {/* Category Ratings */}
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                    {REVIEW_TYPES.map((type) => (
                        <div
                            key={type.typeId}
                            className="flex items-center justify-between"
                        >
                            <span className="text-sm font-light text-neutral-700">
                                {type.typeName}
                            </span>
                            <StarRating
                                value={ratings[type.typeId]}
                                onChange={(r) => setRating(type.typeId, r)}
                                size="text-xl"
                            />
                        </div>
                    ))}
                </div>
                <hr />
                {/* Comment */}
                <div className="flex flex-col gap-2">
                    <label
                        htmlFor="review-comment"
                        className="text-base font-medium"
                    >
                        Comment{" "}
                        <span className="text-neutral-400 font-light text-sm">
                            (optional)
                        </span>
                    </label>
                    <textarea
                        id="review-comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Share your experience..."
                        rows={4}
                        className="w-full resize-none rounded-xl border border-borderColor2 bg-white px-3 py-3 text-sm transition-colors outline-none placeholder:text-neutral-400 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                    />
                </div>
                {/* Submit */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full text-white bg-primary1 hover:bg-primary1_hover font-medium rounded-lg text-base px-5 py-3.5 text-center disabled:opacity-50"
                >
                    {isSubmitting ? "Submitting..." : "Submit Review"}
                </button>
            </form>
        </div>
    );
}
