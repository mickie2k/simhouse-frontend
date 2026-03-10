import HostNavbar from "@/components/navbar/hostNavbar";
import { HostAuthProvider } from "@/context/HostAuthContext";

export default function HostLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <HostAuthProvider>
            <div id="_next">
                <HostNavbar />
                {children}
            </div>
        </HostAuthProvider>
    );
}
