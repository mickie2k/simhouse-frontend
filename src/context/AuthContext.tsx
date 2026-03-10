"use client"

import { axiosInstance, axiosJWTInstance } from "@/lib/http";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";

export interface AuthContextType<T> {
	user: T | null;
	login: (formDataJson: { [key: string]: FormDataEntryValue }) => Promise<void>;
	logout: () => Promise<void>;
	isAuthenticated: boolean;
	loading: boolean;
	checkAuthStatus: () => Promise<void>;
}

interface AuthOptions {
	me: string;
	login: string;
	logout: string;
	loginRedirect: string;
}

export function createAuthContext<T>(options: AuthOptions) {
	const { me, login: loginEndpoint, logout: logoutEndpoint, loginRedirect } = options;

	const Context = createContext<AuthContextType<T>>({
		user: null,
		loading: true,
		login: async () => { },
		logout: async () => { },
		isAuthenticated: false,
		checkAuthStatus: async () => { },
	});

	const Provider = ({ children }: Readonly<{ children: React.ReactNode }>) => {
		const router = useRouter();
		const [loading, setLoading] = useState(true);
		const [user, setUser] = useState<T | null>(null);

		const checkAuthStatus = useCallback(async () => {
			try {
				const response = await axiosJWTInstance.get(me, {
					skipAuthRedirect: true,
				});
				setUser(response.data);
			} catch (error) {
				console.log(error);
				setUser(null);
			} finally {
				setLoading(false);
			}
		}, []);

		useEffect(() => {
			checkAuthStatus();
		}, [checkAuthStatus]);

		const login = useCallback(async (formDataJson: { [key: string]: FormDataEntryValue }) => {
			try {
				const response = await axiosInstance.post(loginEndpoint, formDataJson);
				if (response.status === 201) {
					await checkAuthStatus();
					router.push(loginRedirect);
				} else {
					throw new Error(response.data.message);
				}
			} catch (error) {
				if (axios.isAxiosError(error)) {
					toast.error("Incorrect Email or Password.", {
						position: "top-center",
						description: "Please try again",
					});
				} else {
					toast.error("Something went wrong.", {
						position: "top-center",
						description: "Please try again",
					});
				}
			}
		}, [checkAuthStatus, router]);

		const logout = useCallback(async () => {
			try {
				const response = await axiosJWTInstance.get(logoutEndpoint);
				if (response.status === 200) {
					setUser(null);
					router.push("/login");
				}
			} catch (error) {
				console.error("Logout failed:", error);
			}
		}, [router]);

		const value = useMemo(() => ({
			user,
			login,
			logout,
			isAuthenticated: !!user,
			checkAuthStatus,
			loading,
		}), [user, loading, login, logout, checkAuthStatus]);

		return <Context.Provider value={value}>{children}</Context.Provider>;
	};

	const useAuth = () => useContext(Context);

	return { Provider, useAuth };
}