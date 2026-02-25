import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Booking Details",
    description: "View your booking details and schedule",
};

export default function BookingDetailLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
