import LoginForm from "@/components/login/LoginForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Login",
	description: "Login to your Simhouse account",
};

export default function Login() {
	return (
		<main className="min-h-full w-full relative">
			<LoginForm />
		</main>
	);
}
