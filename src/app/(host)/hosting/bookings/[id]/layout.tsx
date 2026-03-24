import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Booking Details',
    description: 'View and manage your booking details',
};

export default function BookingDetailLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
