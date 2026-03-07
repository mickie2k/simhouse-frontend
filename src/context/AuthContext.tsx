"use client";
import { createContext, useEffect, useState } from "react";
import { axiosJWTInstance } from "@/lib/http";
import cookies from "js-cookie";

interface AuthContextType {
	username: string;
	setUsername: React.Dispatch<React.SetStateAction<string>>;
	isLogin: boolean;
	setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AuthContext = createContext<AuthContextType>({
	username: "",
	setUsername: () => { },
	isLogin: false,
	setIsLogin: () => { },
});
export default function Auth({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	const [username, setUsername] = useState<string>("");
	const [isLogin, setIsLogin] = useState<boolean>(false);

	useEffect(() => {
		const fetchUsername = async () => {
			try {
			const response = await axiosJWTInstance.get<{ username: string }>(
				"user/username",
				{ skipAuthRedirect: true }
			);
			const data = response.data;

			if (data) {
				setUsername(data.username);
					setIsLogin(true);
					cookies.set("isAuth", "true");
				} else {
					throw new Error("No username found");
				}
			} catch (error) {
				console.error("Failed to fetch username:", error);
				setIsLogin(false);
				setUsername("");
				cookies.set("isAuth", "false");
			}
		};
		fetchUsername();
	}, []);

	return (
		<AuthContext.Provider
			value={{ username, setUsername, isLogin, setIsLogin }}
		>
			{children}
		</AuthContext.Provider>
	);
}
