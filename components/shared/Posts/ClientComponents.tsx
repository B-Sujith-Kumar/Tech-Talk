"use client";

import { useToast } from "@/components/ui/use-toast";
import { downvotePost, upvotePost } from "@/lib/actions/user.actions";
import { IEngagement } from "@/lib/database/models/post.model";
import { IPostPopulated } from "@/types";
import { useUser } from "@clerk/nextjs";
import { ArrowBigDownIcon, ArrowBigUpIcon } from "lucide-react";

export const VotesButtons = ({ post, userObjectId }: { post: IPostPopulated, userObjectId: string }) => {
    const { isLoaded, user } = useUser();
    const { toast } = useToast();
    return (
        <>
            <ArrowBigUpIcon
                className="w-6 h-6 cursor-pointer text-indigo-500"
                strokeWidth={1.1}
                onClick={async (e) => {
                    e.preventDefault();
                    if (isLoaded && !user) {
                        toast({
                            title: "Auth Error",
                            description: "You need to be logged in to upvote a post.",
                            variant: "destructive",
                        });
                        return;
                    }
                    await upvotePost({
                        postId: post._id?.toString() as string,
                    });
                    return;
                }}
                fill={
                    post.upvotes.findIndex(
                        (upvote: IEngagement) => upvote.user.toString() === userObjectId) !== -1
                        ? "blue"
                        : "none"
                }
            />
            <span className="text-xs font-medium">
                {post.upvotes.length - post.downvotes.length}
            </span>
            <ArrowBigDownIcon
                className="w-6 h-6 cursor-pointer text-red-500"
                strokeWidth={1.1}
                onClick={async (e) => {
                    e.preventDefault();
                    if (isLoaded && !user) {
                        toast({
                            title: "Auth Error",
                            description: "You need to be logged in to downvote a post.",
                            variant: "destructive",
                        });
                        return;
                    }
                    await downvotePost({
                        postId: post._id?.toString() as string,
                    });
                    return;
                }}
                fill={
                    post.downvotes.findIndex(
                        (downvote: IEngagement) => downvote.user.toString() === userObjectId) !== -1
                        ? "red"
                        : "none"
                }
            />
        </>
    );
};
