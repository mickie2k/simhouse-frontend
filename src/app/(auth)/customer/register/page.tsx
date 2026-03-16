import RegisterForm from "@/components/login/RegisterForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Register",
	description: "Create your Simhouse account",
};

export default function Register() {
	return (
		<main className="min-h-full w-full relative ">
			<RegisterForm registerEndpoint="/auth/customer/register" redirectURI="/customer/login" />
		</main>
	);
}
