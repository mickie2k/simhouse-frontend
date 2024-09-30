import type { Metadata } from "next";
import { overpass, inter } from "@/utilities/font";
import Header from "@/components/navbar/navbar";
import "../globals.css";

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
				className={`${overpass.className} ${overpass.variable} ${inter.variable}  antialiased min-h-screen`}
			>
				<Header></Header>
				{children}
			</body>
		</html>
	);
}
