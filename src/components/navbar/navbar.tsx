import Link from "next/link";

export default function navbar() {
	return (
		<header className="flex items-center justify-between px-20 py-5 bg-navblack text-white sticky top-0 z-50 w-full">
			<div>
				<h3>SIMHOUSE</h3>
			</div>
			<div className="flex justify-between gap-7">
				<Link href="/" className="text-sm">
					Become a Host
				</Link>
				<Link href="/login" className="text-sm">
					Login
				</Link>
			</div>
		</header>
	);
}

// Optional ทำ Navbar เปลี่ยนสีตอนเลื่อน https://www.youtube.com/watch?v=-t6VNZAcVJk
