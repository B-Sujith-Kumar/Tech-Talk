import { redirectToSignIn } from "@clerk/nextjs/server";
import { auth } from "@clerk/nextjs";
import { Metadata } from "next";
import { CreatePost } from "../../_components/CreatePostComp";

export default async function CreatePostPage() {
    const { userId } = auth();
    if (!userId) return redirectToSignIn();
    return (
        <div className="bg-white rounded-md p-4 overflow-y-scroll scrollbar-hidden">
            <CreatePost />
        </div>
    )
}

export const metadata: Metadata = {
    title: "Create Post",
    description: "Create a new post",
}