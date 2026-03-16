"use client";

import Link from "next/link";
import { FormEvent, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";
import { AuthContextType } from "@/context/AuthContext";



export default function LoginhtmlForm(
	{
		authContext,
		googleEndpoint,
	}: {
		authContext: () => AuthContextType<any>;
		googleEndpoint: string;
	}
) {
	const router = useRouter();
	const { login, isAuthenticated } = authContext();

	useEffect(() => {
		if (isAuthenticated) {
			router.push("/");
		}
	}, [isAuthenticated, router]);

	const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const formData = new FormData(event.currentTarget);
		const formDataJson: { [key: string]: FormDataEntryValue } = {};
		formData.forEach((value, key) => {
			formDataJson[key] = value;
		});

		await login(formDataJson);
	};

	const onGoogleSubmit = async () => {
		window.open(`${process.env.NEXT_PUBLIC_API_URL}${googleEndpoint}`, "_self");
	}

	return (
		<section className="bg-white mt-7">
			<div className="flex flex-col items-center  px-6 py-0 mx-auto md:h-full lg:py-0 ">
				<h1 className="flex items-center mb-6 text-2xl font-bold text-gray-900 ">
					Login to your account
				</h1>
				<div className="w-full bg-transparent border-[#E2E2E2]  border-t  md:mt-0 sm:max-w-md xl:p-0 ">
					<div className="p-6 space-y-4 md:space-y-6 sm:p-8">
						<h1 className="text-xl font-medium leading-tight tracking-tight text-gray-900 md:text-2xl">
							Welcome to Simhouse
						</h1>
						<form className="space-y-4 md:space-y-6" onSubmit={onSubmit}>
							<div>
								<label
									htmlFor="email"
									className="block mb-2 text-sm font-medium text-gray-900 "
								>
									Your Email
								</label>
								<input
									type="email"
									name="email"
									id="email"
									className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg  block w-full p-2.5 "
									placeholder="name@example.com"
									required
								/>
							</div>
							<div>
								<label
									htmlFor="password"
									className="block mb-2 text-sm font-medium text-gray-900 "
								>
									Password
								</label>
								<input
									type="password"
									name="password"
									id="password"
									placeholder="••••••••"
									className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg  block w-full p-2.5"
									required
								/>
							</div>

							<button
								type="submit"
								className="w-full text-white bg-primary1 hover:bg-primary1_hover focus:ring-4 focus:outline-none  font-medium rounded-lg text-sm px-5 py-2.5 text-center "
							>
								Sign in
							</button>
							<p className="text-sm font-light text-gray-500 ">
								Don’t have an account yet?{" "}
								<Link
									href="/register"
									className="font-medium text-gray-600 hover:underline "
								>
									Sign up
								</Link>
							</p>
						</form>
						<div className="flex items-center justify-between gap-4">
							<hr className="border-border w-full" />
							<span>or</span>
							<hr className="border-border w-full" />
						</div>
						<div>
							<button onClick={onGoogleSubmit} className="w-full border border-border bg-none hover:bg-input/30  flex items-center justify-center gap-2 font-medium rounded-lg text-sm px-5 py-2.5 text-center cursor-pointer transition"> <FcGoogle size={24} /> Login with Google</button>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
