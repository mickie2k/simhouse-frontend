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
		setisMenu((prev) => !prev);
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
			<div className="flex justify-between gap-7">
				<Link href="/" className="text-sm">
					Become a Host
				</Link>
				{isLogin ? (
					<div className="flex gap-2" onMouseEnter={toggleMenu}>
						<FaUserCircle /> <span className="text-sm">{username}</span>
						<button onClick={logout} className="text-sm">
							Logout
						</button>
					</div>
				) : (
					<Link href="/login" className="text-sm">
						Login
					</Link>
				)}
			</div>
		</header>
	);
}

// Optional ทำ Navbar เปลี่ยนสีตอนเลื่อน https://www.youtube.com/watch?v=-t6VNZAcVJk
