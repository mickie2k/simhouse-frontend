import BannerHome from "@/components/home/BannerHome";
import LandingBody from "@/components/home/LandingBody";

export default function Home() {
	return (
		<main className="min-h-full w-full relative ">
			<BannerHome />
			<LandingBody />
		</main>
	);
}
