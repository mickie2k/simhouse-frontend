"use client"

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loading from "@/components/loading/LoadingComponent";

interface ProtectRouteProps {
    children: React.ReactNode;
    isAuthenticated: boolean;
    loading: boolean;
    unauthorizedRedirect?: string;
}

const ProtectedRoute: React.FC<ProtectRouteProps> = ({
    children,
    isAuthenticated,
    loading,
    unauthorizedRedirect = '/login'
}) => {
    const router = useRouter();

    useEffect(() => {
        // Wait for loading to finish before checking authentication
        if (!loading && !isAuthenticated) {
            router.replace(unauthorizedRedirect);
        }
    }, [isAuthenticated, loading, unauthorizedRedirect, router]);

    if (loading) {
        return <Loading />;
    }

    if (!isAuthenticated) {
        return null;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
