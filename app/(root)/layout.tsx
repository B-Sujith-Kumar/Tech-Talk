import Sidebar from "./Sidebar";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <>
        <main className="pt-16 p-4 bg-gray-100 h-screen overflow-y-scroll scrollbar-hidden">
            <div className="flex flex-row gap-2 *:min-h-full">
                <Sidebar />
                <div className="w-4/6 max-lg:w-full">
                    {children}
                </div>
                <div className="w-1/6 max-lg:hidden">
                    This is the third box
                </div>
            </div>
        </main>
    </>
}