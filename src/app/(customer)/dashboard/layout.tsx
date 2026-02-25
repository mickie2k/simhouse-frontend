import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "My Dashboard",
    description: "View and manage your simulator bookings",
};

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
