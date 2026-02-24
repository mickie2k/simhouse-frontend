import type { Metadata } from "next";
import { overpass, inter } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
	title: {
		default: "Simhouse",
		template: "%s | Simhouse",
	},
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
				className={`${overpass.className} ${overpass.variable} ${inter.variable} antialiased min-h-screen`}
			>
				{children}
			</body>
		</html>
	);
}
