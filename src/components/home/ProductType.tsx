import Image from "next/image";
import f1seat from "@/image/convert.webp";
import f1logo from "@/image/f1logo.png";
import Link from "next/link";
import GTseat from "@/image/31634806095GTTRACK 4.png";
import GTlogo from "@/image/gtlogo.png";

export default function ProductType() {
	return (
		<section>
			<h2 className="text-3xl font-bold mb-6">Discover your racing type</h2>
			<div className="grid grid-cols-2  gap-6">
				<Link
					href="/login"
					className="w-full h-96 bg-gradient-to-t from-black to-[#242424] flex flex-col items-center justify-end pb-6 rounded-3xl cursor-pointer hover:opacity-95"
				>
					<Image src={f1seat} width={700} alt="f1seat" className="w-96" />
					<div className="flex-col flex mt-2 items-center">
						<Image src={f1logo} width={155} alt="f1logo" className="w-36" />
						<h3 className="text-neutral-200 text-2xl font-extralight mt-4 text-center">
							FORMULA 1
						</h3>
					</div>
				</Link>
				<div className="w-full h-96 bg-gradient-to-t from-black to-[#242424] flex flex-col items-center justify-end pb-6 rounded-3xl cursor-pointer hover:opacity-95">
					<Image src={GTseat} width={700} alt="f1seat" className="w-96" />
					<div className="flex-col flex mt-2 items-center">
						<Image src={GTlogo} width={155} alt="f1logo" className="w-36" />
						<h3 className="text-neutral-200 text-2xl font-extralight mt-4 text-center">
							GT RACING
						</h3>
					</div>
				</div>
			</div>
		</section>
	);
}
