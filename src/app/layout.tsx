import type { Metadata } from "next";
import { overpass, inter } from "@/lib/fonts";
import "./globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

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
		<html lang="en" className={cn("font-sans", inter.variable)}>
			<body
				className={`${overpass.className} ${overpass.variable} ${inter.variable} antialiased min-h-screen`}
			>
				{children}
			</body>
		</html>
	);
}
