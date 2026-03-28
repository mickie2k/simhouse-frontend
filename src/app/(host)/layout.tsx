"use client"

import HostNavbar from "@/components/navbar/hostNavbar";
import { HostAuthProvider, useHostAuth } from "@/context/HostAuthContext";
import ProtectedRoute from "@/lib/protect-routes";

function HostLayoutContent({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { isAuthenticated, loading } = useHostAuth();

    return (
        <ProtectedRoute
            isAuthenticated={isAuthenticated}
            loading={loading}
            unauthorizedRedirect="/hosting/login"
        >
            <div id="_next">
                <HostNavbar />
                {children}
            </div>
        </ProtectedRoute>
    );
}

export default function HostLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <HostAuthProvider>
            <HostLayoutContent>{children}</HostLayoutContent>
        </HostAuthProvider>
    );
}
