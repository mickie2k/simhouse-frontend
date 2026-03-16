import ReviewCardComponent, { ReviewItem } from "./ReviewCardComponent";
import ReviewOverallComponent, {
    RatingBreakdownItem,
} from "./ReviewOverallComponent";

type ReviewSectionProps = {
    averageRating: number;
    totalReviews: number;
    categories: RatingBreakdownItem[];
    reviews: ReviewItem[];
};

export default function ReviewSection({
    averageRating,
    totalReviews,
    categories,
    reviews,
}: ReviewSectionProps) {
    return (
        <section className="border-t border-slate-200 py-10">
            <ReviewOverallComponent
                averageRating={averageRating}
                totalReviews={totalReviews}
                categories={categories}
            />

            <div className="mt-10 grid grid-cols-1 gap-x-16 gap-y-10 md:grid-cols-2">
                {reviews.map((review) => (
                    <ReviewCardComponent key={review.id} review={review} />
                ))}
            </div>

            <button
                type="button"
                className="mt-10 rounded-lg border border-slate-900 px-4 py-2 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-900 hover:text-white"
            >
                Show all {totalReviews} reviews
            </button>
        </section>
    );
}
