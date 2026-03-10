import LoginForm from "@/components/login/LoginForm";
import { CustomerAuthProvider } from "@/context/CustomerAuthContext";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Login",
	description: "Login to your Simhouse account",
};

export default function Login() {
	return (
		<CustomerAuthProvider>
			<main className="min-h-full w-full relative">
				<LoginForm />
			</main>
		</CustomerAuthProvider>
	);
}
