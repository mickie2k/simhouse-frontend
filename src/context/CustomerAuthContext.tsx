"use client"

import { axiosInstance, axiosJWTInstance } from "@/lib/http";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Customer } from "@/types";
import axios from "axios";
import { toast } from "sonner";




interface AuthContextType {
    customer: Customer | null;
    login: (formDataJson: { [key: string]: FormDataEntryValue }) => Promise<void>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
    loading: boolean;
    checkAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    customer: null,
    loading: true,
    login: async () => { },
    logout: async () => { },
    isAuthenticated: false,
    checkAuthStatus: async () => { },
});



export const AuthProvider = ({ children }: Readonly<{ children: React.ReactNode }>) => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [customer, setCustomer] = useState<Customer | null>(null);



    const checkAuthStatus = useCallback(async () => {
        console.log("checkAuthStatus")
        try {
            const response = await axiosJWTInstance.get("/auth/me", {
                skipAuthRedirect: true
            });
            setCustomer(response.data);


        } catch (error) {
            console.log(error)
            setCustomer(null);


        } finally {
            setLoading(false);
        }
    }, [])

    useEffect(() => {
        checkAuthStatus();
    }
        , [checkAuthStatus]);


    const login = useCallback(async (formDataJson: { [key: string]: FormDataEntryValue }) => {
        try {
            const response = await axiosInstance.post("/auth/login", formDataJson)
            if (response.status == 201) {
                await checkAuthStatus();
                router.push("/user");
            } else {
                throw new Error(response.data.message);
            }

        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error("Incorrect Email or Password.", {
                    position: 'top-center',
                    description: 'Please try again',
                });
            } else {
                toast.error("Something went wrong.", {
                    position: 'top-center',
                    description: 'Please try again',
                });
            }
        }

    }, [checkAuthStatus, router])

    const logout = useCallback(async () => {
        try {
            const response = await axiosJWTInstance.get("/auth/logout");
            if (response.status === 200) {
                setCustomer(null);
                router.push("/login");
            }
        } catch (error) {
            console.error("Logout failed:", error);
        }
    }, [router])


    const value = useMemo(() => ({
        customer,
        login,
        logout,
        isAuthenticated: !!customer,
        checkAuthStatus,
        loading,
    }), [customer, loading, login, logout, checkAuthStatus]); // Only recompute when customer or loading changes

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    return useContext(AuthContext);
};