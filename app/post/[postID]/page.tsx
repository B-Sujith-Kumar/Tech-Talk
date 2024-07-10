import TextBox from "@/components/shared/TextBox/TextBox";
import { getPostById } from "@/lib/actions/post.action"
import mongoose from "mongoose";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";

export default async function PostPage({ params }: { params: { postID: mongoose.Schema.Types.ObjectId } }) {
    const { data, status } = await getPostById(params.postID);
    if (status !== 200) notFound();
    return (
        <div className="bg-white rounded-md p-4 prose  prose prose-invert prose-lg">
            <Image
                src={data?.coverImage as string}
                alt="Cover Image"
                width={800}
                height={400}
                className="rounded-md"
            />

            <h1>{data?.title}</h1>

            <TextBox
                description={data?.content as string}
                editable={false}
            />
        </div>
    )
}