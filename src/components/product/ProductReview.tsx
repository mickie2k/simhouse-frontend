import ReviewSection from "./review/ReviewSection";
import { ProductReviewResponse } from "@/types";

export default function ProductReview({ reviewsData }: { reviewsData: ProductReviewResponse }) {
    if (!reviewsData) return null;

    return (
        <ReviewSection
            averageRating={reviewsData.averageRating ?? 0}
            totalReviews={reviewsData.totalReviews ?? 0}
            categories={reviewsData.ratingCategories ?? []}
            reviews={reviewsData.reviewItems ?? []}
        />
    );
}