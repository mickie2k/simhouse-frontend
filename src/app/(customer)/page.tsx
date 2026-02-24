import BannerHome from "@/components/home/BannerHome";
import LandingBody from "@/components/home/LandingBody";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Simhouse - Racing Simulator Rentals",
	description: "Rent professional racing simulators for the ultimate sim racing experience",
};

export default function Home() {
	return (
		<main className="min-h-full w-full relative ">
			<BannerHome />
			<LandingBody />
		</main>
	);
}
