import Navbar from "@/components/navbar/navbar";
import { CustomerAuthProvider } from "@/context/CustomerAuthContext";
import GoogleMapsProvider from "@/components/providers/GoogleMapsProvider";

export default function CustomerLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<CustomerAuthProvider>
			<GoogleMapsProvider>
				<div id="_next">
					<Navbar />
					{children}
				</div>
			</GoogleMapsProvider>
		</CustomerAuthProvider>
	);
}
