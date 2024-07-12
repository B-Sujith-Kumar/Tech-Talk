"use client";

import { useToast } from "@/components/ui/use-toast";
import { downvotePost, upvotePost } from "@/lib/actions/user.actions";
import { useUser } from "@clerk/nextjs";
import { ArrowBigDownIcon, ArrowBigUpIcon } from "lucide-react";
import mongoose from "mongoose";

export const UpDownVote = ({ post }: { post: any }) => {
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
            (upvote: { user: mongoose.Schema.Types.ObjectId }) =>
              upvote.user.toString() === user?.publicMetadata?.userId
          ) !== -1
            ? "#667eea"
            : "none"
        }
      />
      <span className="text-xs max-sm:hidden font-medium">
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
            (downvote: { user: mongoose.Schema.Types.ObjectId }) =>
              downvote.user.toString() === user?.publicMetadata?.userId
          ) !== -1
            ? "red"
            : "none"
        }
      />
    </>
  );
};
