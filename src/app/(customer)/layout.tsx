import Navbar from "@/components/navbar/navbar";
import { CustomerAuthProvider } from "@/context/CustomerAuthContext";

export default function CustomerLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<CustomerAuthProvider>
			<div id="_next">
				<Navbar />
				{children}
			</div>
		</CustomerAuthProvider>
	);
}
