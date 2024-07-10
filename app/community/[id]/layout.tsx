import { auth } from "@clerk/nextjs";
import Sidebar from "../../(root)/Sidebar";
import { getCommunitiesJoinedByUser } from "@/lib/actions/user.actions";

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { userId } = auth();
    const { data, status } = await getCommunitiesJoinedByUser();
    return (
        <>
            <main className="pt-16 p-4 bg-gray-100 h-screen overflow-y-scroll scrollbar-hidden">
                <div className="flex flex-row gap-4 mt-2 *:min-h-full">
                    <Sidebar communitites={status === 200 ? data : []} />
                    <div className="w-full">{children}</div>
                </div>
            </main>
        </>
    );
}
