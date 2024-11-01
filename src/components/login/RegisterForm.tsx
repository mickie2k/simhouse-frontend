"use client";

import Link from "next/link";
import { FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
	const router = useRouter();
	const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const formData = new FormData(event.currentTarget);
		const formDataJson: { [key: string]: FormDataEntryValue } = {};
		formData.forEach((value, key) => {
			formDataJson[key] = value;
		});

		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}user/register`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json", // Set the content type to JSON
				},
				body: JSON.stringify(formDataJson),
			}
		);
		if (response.status !== 200) {
			alert("This username have already been taken");
			return;
		}
		if (response.status === 200) {
			// cookies.set("isAuth", "true");
			// router.push("/");
			alert("Register success");
			router.push("/login");
		}
	};
	return (
		<section className="bg-white mt-7">
			<div className="flex flex-col items-center  px-6 py-0 mx-auto md:h-full lg:py-0 ">
				<h1 className="flex items-center mb-6 text-2xl font-bold text-gray-900 ">
					Sign Up
				</h1>
				<div className="w-full bg-transparent border-[#E2E2E2]  border-t  md:mt-0 sm:max-w-md xl:p-0 ">
					<div className="p-6 space-y-4 md:space-y-6 sm:p-8">
						<form className="space-y-4 md:space-y-6" onSubmit={onSubmit}>
							<div>
								<label
									htmlFor="name"
									className="block mb-2 text-sm font-medium text-gray-900 "
								>
									Your Fullname
								</label>
								<input
									type="text"
									name="fname"
									id="fname"
									className="bg-gray-50 border border-gray-300 text-gray-900 rounded-t-lg  block w-full p-2.5 "
									placeholder="First name"
									required
								/>
								<input
									type="text"
									name="lname"
									id="lname"
									className="bg-gray-50 border border-gray-300 text-gray-900 rounded-b-lg  block w-full p-2.5 "
									placeholder="Last name"
									required
								/>
							</div>
							<div>
								<label
									htmlFor="username"
									className="block mb-2 text-sm font-medium text-gray-900 "
								>
									Your Username
								</label>
								<input
									type="username"
									name="username"
									id="username"
									className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg  block w-full p-2.5 "
									placeholder="username"
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
								className="w-full text-white bg-primary1 hover:bg-primary1_hover focus:ring-4 focus:outline-none  font-medium rounded-lg text-sm px-5 py-2.5 text-center  "
							>
								Sign up
							</button>
							<p className="text-sm font-light text-gray-500 ">
								Already have an account?{" "}
								<Link
									href="/login"
									className="font-medium text-gray-600 hover:underline "
								>
									Sign in
								</Link>
							</p>
						</form>
					</div>
				</div>
			</div>
		</section>
	);
}
