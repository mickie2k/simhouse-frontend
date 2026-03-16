import ReviewSection from "./review/ReviewSection";

const ratingCategories = [
    { label: "Cleanliness", value: 5.0 },
    { label: "Communication", value: 5.0 },
    { label: "Check-in", value: 5.0 },
    { label: "Accuracy", value: 5.0 },
    { label: "Location", value: 4.9 },
    { label: "Value", value: 4.7 },
];

const reviewItems = [
    {
        id: 1,
        reviewerName: "Jose",
        reviewDate: "December 2021",
        comment: "Host was very attentive.",
    },
    {
        id: 2,
        reviewerName: "Luke",
        reviewDate: "December 2021",
        comment: "Nice place to stay!",
    },
    {
        id: 3,
        reviewerName: "Shayna",
        reviewDate: "December 2021",
        comment:
            "Wonderful neighborhood, easy access to restaurants and the subway, cozy studio apartment with a super comfortable bed. Great host, super helpful and responsive.",
    },
    {
        id: 4,
        reviewerName: "Josh",
        reviewDate: "November 2021",
        comment:
            "Well designed and fun space, neighborhood has lots of energy and amenities.",
    },
    {
        id: 5,
        reviewerName: "Vladko",
        reviewDate: "November 2020",
        comment:
            "This is amazing place. It has everything one needs for a monthly business stay. Very clean and organized place. Amazing hospitality and affordable price.",
    },
    {
        id: 6,
        reviewerName: "Jennifer",
        reviewDate: "January 2022",
        comment:
            "A centric place, near of a sub station and a supermarket with everything you need.",
    },
];

export default function ProductReview() {
    return (
        <ReviewSection
            averageRating={5.0}
            totalReviews={12}
            categories={ratingCategories}
            reviews={reviewItems}
        />
    );
}