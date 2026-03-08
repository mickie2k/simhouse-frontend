import Header from "@/components/navbar/navbar";
import Auth from "@/context/AuthContext";

export default function HostLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <div id="_next">
                <Auth>
                    <Header />
                </Auth>
                {children}
            </div>
        </>
    );
}
