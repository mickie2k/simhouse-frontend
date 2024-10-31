"use client";
import { createContext, useEffect, useState } from "react";
import cookies from "js-cookie";

interface AuthContextType {
	username: string;
	setUsername: React.Dispatch<React.SetStateAction<string>>;
	isLogin: boolean;
	setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AuthContext = createContext<AuthContextType>({
	username: "",
	setUsername: () => {},
	isLogin: false,
	setIsLogin: () => {},
});
export default function Auth({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	const [username, setUsername] = useState<string>("");
	const [isLogin, setIsLogin] = useState<boolean>(false);

	useEffect(() => {
		const fetchUsername = async () => {
			try {
				const response = await fetch(
					`${process.env.NEXT_PUBLIC_API_URL}user/username`,
					{
						method: "GET",
						credentials: "include", // Include credentials if using cookies
					}
				);
				if (response.status !== 200) {
					throw new Error("Failed to fetch username");
				}
				const data = await response.json();

				if (data) {
					console.log(data.Username);
					setUsername(data.Username);
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
