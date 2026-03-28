"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FaUserCircle } from "react-icons/fa";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import SearchBox from "@/components/home/SearchBox";

export default function Navbar() {
	const pathname = usePathname();
	const [isMenu, setisMenu] = useState(false);
	const [scroll, setScroll] = useState(pathname !== "/");
	const { user, isAuthenticated, logout } = useCustomerAuth();

	const changeNavbar = () => {
		if (window.scrollY >= 80) {
			setScroll(true);
		} else {
			setScroll(false);
		}
	};

	useEffect(() => {
		if (pathname === "/") {
			window.addEventListener("scroll", changeNavbar);
		}
		return () => {
			window.removeEventListener("scroll", changeNavbar);
		};
	}, [pathname]);

	function toggleMenu() {
		setisMenu(true);
	}
	function disableMenu() {
		setisMenu(false);
	}

	function loginComponent() {
		return (
			<div
				className="relative group cursor-pointer"
				onMouseEnter={toggleMenu}
				onMouseLeave={disableMenu}
			>
				<div className="flex gap-2 py-3">
					<FaUserCircle /> <span className="text-sm">{user?.username}</span>
				</div>

				<div
					id="dropdown"
					className={`z-10 absolute  bg-white divide-y divide-gray-100 rounded-lg shadow-[0px_6px_16px_rgba(0,0,0,0.1)] w-48 right-0 ${!isMenu && "hidden"
						}`}
				>
					<ul
						className="py-2 text-sm text-gray-700 flex flex-col gap-2 "
						aria-labelledby="dropdownDefaultButton"
					>
						<li className="w-full">
							<Link href="/dashboard" className="  ">
								<div className="px-4 py-2 hover:bg-gray-100  text-sm ">
									Your Bookings
								</div>
							</Link>
						</li>

						<li className="w-full">
							<button
								className="px-4 py-2 hover:bg-gray-100 w-full text-start text-sm"
								onClick={logout}
							>
								Sign out
							</button>
						</li>
					</ul>
				</div>
			</div>
		);
	}

	const isBrowsePage = pathname.startsWith("/page/");

	return (
		<header
			className={
				(scroll ? "navbar-scroll" : "navbar-noscroll") +
				" flex items-center justify-between px-20 py-5 h-20 sticky top-0 w-full transition-all ease-in-out duration-300 z-50"
			}
		>
			<Link href="/">
				<h3 className={isBrowsePage ? "shrink-0" : ""}>SIMHOUSE</h3>
			</Link>

			{/* Center: compact search box on browse pages */}
			{isBrowsePage && (
				<div className="flex-1 mx-8 max-w-2xl">
					<SearchBox compact />
				</div>
			)}

			<div className="flex justify-between items-center gap-7 shrink-0">
				<Link href="/hosting" className="text-sm">
					Become a Host
				</Link>
				{isAuthenticated ? (
					loginComponent()
				) : (
					<Link href="/customer/login" className="text-sm py-3 cursor-pointer">
						Login
					</Link>
				)}
			</div>
		</header>
	);
}

// Optional ทำ Navbar เปลี่ยนสีตอนเลื่อน https://www.youtube.com/watch?v=-t6VNZAcVJk
