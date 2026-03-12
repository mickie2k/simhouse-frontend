import { Product } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { IoMdStar } from "react-icons/io";
import { getCityById } from "@countrystatecity/countries";

type SimulatorHostCardProps = {
    product: Product;
};

const SimulatorHostCard = ({ product }: SimulatorHostCardProps) => {


    return (
        <Link
            href={`/hosting/simulator/${product.id}`}
            className="flex flex-col border border-borderColor1 rounded-xl overflow-hidden hover:shadow-lg transition-shadow bg-white"
        >
            {/* Image Section */}
            <div className="relative h-48 w-full bg-slate-200 overflow-hidden">
                <Image
                    src={`${process.env.NEXT_PUBLIC_API_URL}image/${product.firstImage}`}
                    width={400}
                    height={300}
                    alt={product.simListName}
                    className="h-full w-full object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                />
                {/* Active Badge */}
                <div className="absolute top-3 left-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                    Active
                </div>
            </div>

            {/* Content Section */}
            <div className="flex flex-col p-4">
                <div className="flex items-start justify-between mb-2">
                    <h3 className="text-base font-semibold text-black2">
                        {product.simListName}
                    </h3>
                    <div className="flex items-center gap-1 text-sm">
                        <IoMdStar className="w-4 h-4" />
                        <span className="font-medium">5.0</span>
                    </div>
                </div>
                <p className="text-sm text-secondText mb-3">
                    {product.city}, {product.province}, {product.country}
                </p>
                <p className="text-base font-semibold text-black2">
                    ฿{product.pricePerHour}/hrs
                </p>
            </div>
        </Link>
    );
};

export default SimulatorHostCard;
