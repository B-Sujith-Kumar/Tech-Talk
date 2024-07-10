import { auth } from "@clerk/nextjs";
import Sidebar from "./Sidebar";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { userId } = auth();
    return (
        <>
            <main className="pt-16 p-4 bg-gray-100 max-h-full min-h-screen overflow-y-scroll scrollbar-hidden">
                <div className="flex flex-row gap-4 mt-2 *:min-h-full">
                    <Sidebar />
                    <div className="xl:w-7/12 max-lg:w-full lg:w-4/5 overflow-y-scroll scrollbar-hidden">{children}</div>
                    <div className="xl:w-1/4 max-xl:hidden lg:1/5">
                        This is the third box
                    </div>
                </div>
            </main>
        </>
    );
}
