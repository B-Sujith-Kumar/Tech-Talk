import { auth } from "@clerk/nextjs/server";
import Sidebar from "../(root)/Sidebar";
import { getCommunitiesJoinedByUser, getUser } from "@/lib/actions/user.actions";

export default async function TagLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const { userId } = auth();
    const currentUser = await getUser(userId);
    const { data } = await getCommunitiesJoinedByUser(currentUser);
    return (
        <>
            <main className="pt-16 p-4 bg-gray-100 max-h-full min-h-screen overflow-y-scroll scrollbar-hidden">
                <div className="flex flex-row gap-6 mt-2 *:min-h-full">
                    <Sidebar communitites={data} />
                    <div className="xl:w-full max-lg:w-full lg:w-4/5 overflow-y-scroll scrollbar-hidden">
                        {children}
                    </div>
                </div>
            </main>
        </>
    );
}