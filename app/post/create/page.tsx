import { auth } from "@clerk/nextjs";
import { Metadata } from "next";
import { CreatePost } from "@/app/(root)/_components/CreatePostComp";
import { getCommunitiesJoinedByUser, getUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";

export default async function CreatePostPage() {
    const { userId } = auth();
    if (!userId) return redirect("/sign-in");
    const currentUser = await getUser(userId);
    const { data } = await getCommunitiesJoinedByUser(currentUser);
    return (
        <div className="bg-gray-100 min-h-screen pt-16 py-6 max-sm:px-3 shadow-md">
            <div className="bg-white rounded-md max-sm:px-0 p-4 overflow-y-scroll scrollbar-hidden w-4/5 sm:mx-auto max-sm:w-full min-h-full max-h-screen mt-4">
                <CreatePost communities={data} currentUser={currentUser} />
            </div>
        </div>
    )
}

export const metadata: Metadata = {
    title: "Create Post",
    description: "Create a new post",
}