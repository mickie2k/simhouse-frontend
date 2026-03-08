import Navbar from "@/components/navbar/navbar";
import Auth from "@/context/AuthContext";

export default function CustomerLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<div id="_next">
				<Auth>
					<Navbar />
				</Auth>
				{children}
			</div>
		</>
	);
}
