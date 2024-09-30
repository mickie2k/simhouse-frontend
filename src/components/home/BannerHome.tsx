import Image from "next/image";
import bannerPic from "@/image/bannerPic.webp";
export default function BannerHome() {
	return (
		<div className="h-[560px] 2xl:h-[70vh] flex justify-between items-center w-full bg-gradient-to-t from-[#101010] to-navblack text-white">
			<div className="flex flex-col ml-20 w-2/3 ">
				<h1 className="text-8xl font-black">
					Rent SimRacing <br />
					here!
				</h1>
			</div>
			<div className="flex items-end py-4 justify-start h-full w-1/3 overflow-visible">
				<Image
					src={bannerPic}
					alt="Picture of SimRacing"
					height={650}
					width={650}
					className="max-h-full w-[90%] h-full object-cover  overflow-visible "
				/>
			</div>
		</div>
	);
}
