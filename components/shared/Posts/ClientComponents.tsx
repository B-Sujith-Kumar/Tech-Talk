"use client";

import { downvotePost, upvotePost } from "@/lib/actions/user.actions";
import { useUser } from "@clerk/nextjs";
import { ArrowBigDownIcon, ArrowBigUpIcon } from "lucide-react";
import mongoose from "mongoose";

export const VotesButtons = ({ post }:{
    post: any;
}) => {
    const { isLoaded, user } = useUser();
    return <>
        <ArrowBigUpIcon className="w-6 h-6 cursor-pointer text-indigo-500"
            strokeWidth={1.1}
            onClick={async (e) => {
                e.preventDefault();
                await upvotePost({
                    postId: post._id?.toString() as string,
                });
            }}
            fill={
                post.upvotes.findIndex(
                    (upvote: {
                        user: mongoose.Schema.Types.ObjectId;
                    }) => upvote.user.toString() === user?.publicMetadata?.userId
                ) !== -1
                    ? "blue"
                    : "none"
            }
        />
        <ArrowBigDownIcon className="w-6 h-6 cursor-pointer text-red-500"
            strokeWidth={1.1}
            onClick={async (e) => {
                e.preventDefault();
                await downvotePost({
                    postId: post._id?.toString() as string,
                });
            }}
            fill={
                post.downvotes.findIndex(
                    (downvote: {
                        user: mongoose.Schema.Types.ObjectId;
                    }) => downvote.user.toString() === user?.publicMetadata?.userId
                ) !== -1
                    ? "red"
                    : "none"
            }
        />
    </>
}