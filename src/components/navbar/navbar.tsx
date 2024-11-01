"use client";
import Link from "next/link";
import "@/app/globals.css";
import { useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";
import { FaUserCircle } from "react-icons/fa";
import cookies from "js-cookie";
export default function Navbar() {
	const pathname = usePathname();
	const router = useRouter();
	const [isMenu, setisMenu] = useState(false);
	const [scroll, setScroll] = useState(false);
	const { username, setUsername, isLogin, setIsLogin } =
		useContext(AuthContext);

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
			setScroll(false);
		} else {
			setScroll(true);
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
	async function logout() {
		const req = await fetch(`${process.env.NEXT_PUBLIC_API_URL}user/logout`, {
			method: "POST",
			credentials: "include",
		});
		const res = await req.json();
		console.log(res);
		setIsLogin(false);
		setUsername("");
		cookies.remove("isAuth");
		alert("Logout success");
		router.push("/");
	}

	function loginComponent() {
		return (
			<div
				className="relative group cursor-pointer"
				onMouseEnter={toggleMenu}
				onMouseLeave={disableMenu}
			>
				<div className="flex gap-2 py-3">
					<FaUserCircle /> <span className="text-sm">{username}</span>
				</div>

				<div
					id="dropdown"
					className={`z-10 absolute  bg-white divide-y divide-gray-100 rounded-lg shadow-[0px_6px_16px_rgba(0,0,0,0.1)] w-48 right-0 ${
						!isMenu && "hidden"
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

	return (
		<header
			className={
				(scroll ? "navbar-scroll" : "navbar-noscroll") +
				" flex items-center justify-between px-20 py-5 h-20 sticky top-0 z-10 w-full transition-all ease-in-out duration-300"
			}
		>
			<Link href="/">
				<h3>SIMHOUSE</h3>
			</Link>
			<div className="flex justify-between items-center gap-7">
				<Link href="/" className="text-sm">
					Become a Host
				</Link>
				{isLogin ? (
					loginComponent()
				) : (
					<Link href="/login" className="text-sm py-3 cursor-pointer">
						Login
					</Link>
				)}
			</div>
		</header>
	);
}

// Optional ทำ Navbar เปลี่ยนสีตอนเลื่อน https://www.youtube.com/watch?v=-t6VNZAcVJk
