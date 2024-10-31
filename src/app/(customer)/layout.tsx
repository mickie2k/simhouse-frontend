import type { Metadata } from "next";
import { overpass, inter } from "@/utilities/font";
import Header from "@/components/navbar/navbar";
import "../globals.css";
import Auth from "@/context/AuthContext";

export const metadata: Metadata = {
	title: "Simhouse",
	description: "Racing Simulator Booking Platform",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				id="_next"
				className={`${overpass.className} ${overpass.variable} ${inter.variable}  antialiased min-h-screen`}
			>
				<Auth>
					<Header />
				</Auth>
				{children}
			</body>
		</html>
	);
}
