import Link from "next/link";

export default function AuthLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<header className="flex items-center justify-between px-20 py-5 bg-transparent text-black sticky h-20 top-0 z-50 w-full border-b border-[#E2E2E2] mb-10">
				<div>
					<Link href="/">SIMHOUSE</Link>
				</div>
			</header>
			{children}
		</>
	);
}
