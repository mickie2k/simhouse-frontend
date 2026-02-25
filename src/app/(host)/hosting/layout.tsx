import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "My Simulators",
    description: "Manage your simulator listings and schedules",
};

export default function HostingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
