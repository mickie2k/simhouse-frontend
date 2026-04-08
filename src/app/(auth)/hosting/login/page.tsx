import LoginForm from "@/components/login/LoginForm";
import { HostAuthProvider, useHostAuth } from "@/context/HostAuthContext";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Login",
	description: "Login to your Simhouse account",
};

export default function Login() {
	return (
		<HostAuthProvider>
			<main className="min-h-full w-full relative">
				<LoginForm authContext={useHostAuth} googleEndpoint="auth/host/google" registerPath="host/register" />
			</main>
		</HostAuthProvider>
	);
}
