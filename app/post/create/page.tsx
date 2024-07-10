import { redirectToSignIn } from "@clerk/nextjs/server";
import { auth } from "@clerk/nextjs";
import { Metadata } from "next";
import { CreatePost } from "@/app/(root)/_components/CreatePostComp";
import { getCommunitiesJoinedByUser } from "@/lib/actions/user.actions";

export default async function CreatePostPage() {
    const { userId } = auth();
    if (!userId) return redirectToSignIn();
    const { data } = await getCommunitiesJoinedByUser();
    return (
        <div className="bg-gray-100 min-h-screen pt-16">
            <div className="bg-white rounded-md p-4 overflow-y-scroll scrollbar-hidden w-4/5 mx-auto min-h-full max-h-screen">
                <CreatePost communities={data} />
            </div>
        </div>
    )
}

export const metadata: Metadata = {
    title: "Create Post",
    description: "Create a new post",
}