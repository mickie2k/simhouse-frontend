import type { Metadata } from "next";
import { overpass } from "@/lib/fonts";
import "./globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { LocationProvider } from "@/context/LocationContext";
import { getCachedCountries } from "@/lib/location-api";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
	title: {
		default: "Simhouse",
		template: "%s | Simhouse",
	},
	description: "Racing Simulator Booking Platform",
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	// Fetch countries server-side once and cache them
	const countries = await getCachedCountries();

	return (
		<html lang="en" className={cn(overpass.variable, "font-sans", inter.variable)}>
			<body
				className={`${overpass.className} ${overpass.variable} ${inter.variable} antialiased min-h-screen`}
			>
				<LocationProvider initialCountries={countries}>
					{children}
					<Toaster position="top-center" richColors />
				</LocationProvider>
			</body>
		</html>
	);
}
