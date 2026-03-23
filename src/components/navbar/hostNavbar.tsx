"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FaUserCircle } from "react-icons/fa";
import { useHostAuth } from "@/context/HostAuthContext";

export default function Navbar() {
    const pathname = usePathname();
    const [isMenu, setisMenu] = useState(false);
    const [scroll, setScroll] = useState(false);
    const { user, isAuthenticated, logout } = useHostAuth();

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

    function loginComponent() {
        return (
            <div
                className="relative group cursor-pointer"
                onMouseEnter={toggleMenu}
                onMouseLeave={disableMenu}
            >
                {/* ปุ่ม Profile */}
                <div className="flex items-center gap-2 py-3 hover:text-orange-600 transition">
                    <FaUserCircle className="text-xl" /> 
                    <span className="text-sm font-medium">{user?.username || "Host"}</span>
                </div>

                {/* Dropdown Menu */}
                <div
                    id="dropdown"
                    className={`z-50 absolute bg-white divide-y divide-gray-100 rounded-lg shadow-lg w-48 right-0 ${!isMenu && "hidden"}`}
                >
                    <ul className="py-2 text-sm text-gray-700 flex flex-col" aria-labelledby="dropdownDefaultButton">
                        <li>
                            <Link href="/dashboard" className="block px-4 py-2 hover:bg-gray-100 transition">
                                Your Bookings
                            </Link>
                        </li>
                        <li>
                            <button
                                className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition"
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
                (scroll ? "navbar-scroll bg-white shadow-sm" : "navbar-noscroll bg-white border-b border-gray-100") +
                " flex items-center justify-between px-6 md:px-20 py-0 h-20 sticky top-0 z-40 w-full transition-all ease-in-out duration-300 text-gray-800"
            }
        >
            {/* โลโก้ด้านซ้าย */}
            <Link href="/" className="flex-shrink-0">
                <h3 className="text-xl font-bold tracking-widest text-gray-700 hover:text-black transition">SIMHOUSE</h3>
            </Link>
           
            <nav className="hidden md:flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2">
                <Link 
                    href="/" 
                    className={`text-sm font-semibold transition hover:text-black ${pathname === '/' ? 'text-black' : 'text-gray-500'}`}
                >
                    Home
                </Link>
                <Link 
                    href="hosting/bookings" 
                    className={`text-sm font-semibold transition hover:text-black ${pathname === '/bookings' ? 'text-black' : 'text-gray-500'}`}
                >
                    Bookings
                </Link>
                <Link 
                    href="/simulatorshosting" 
                    className={`text-sm font-semibold transition hover:text-black ${pathname === '/simulators' ? 'text-black' : 'text-gray-500'}`}
                >
                    Simulators
                </Link>
            </nav>

            {/* เมนูด้านขวา */}
            <div className="flex justify-end items-center gap-6 flex-shrink-0">
                {!isAuthenticated && (
                    <Link href="/" className="text-sm font-medium hover:text-orange-600 transition hidden sm:block">
                        Become a Host
                    </Link>
                )}
                
                {isAuthenticated ? (
                    loginComponent()
                ) : (
                    <Link href="/login" className="text-sm font-medium px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition">
                        Login
                    </Link>
                )}
            </div>
        </header>
    );
}

// Optional ทำ Navbar เปลี่ยนสีตอนเลื่อน https://www.youtube.com/watch?v=-t6VNZAcVJk
