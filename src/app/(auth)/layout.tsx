import type { Metadata } from "next";
import { overpass, inter } from "@/utilities/font";
import "../globals.css";
import Link from "next/link";

export const metadata: Metadata = {
	title: "Simhouse",
	description: "Racing Simulator Booking Platform",
};

export default function AuthLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${overpass.className} ${overpass.variable} ${inter.variable}  antialiased min-h-screen`}
			>
				<header className="flex items-center justify-between px-20 py-5 bg-transparent text-black sticky h-20 top-0 z-50 w-full border-b border-[#E2E2E2] mb-10">
					<div>
						<Link href="/">SIMHOUSE</Link>
					</div>
				</header>
				{children}
			</body>
		</html>
	);
}
