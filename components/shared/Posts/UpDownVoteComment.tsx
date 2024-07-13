"use client";

import { useToast } from "@/components/ui/use-toast";
import { downVoteComment, upVoteComment } from "@/lib/actions/post.action";
import { downvotePost, upvotePost } from "@/lib/actions/user.actions";
import { IComment } from "@/lib/database/models/comment.model";
import { IUser } from "@/lib/database/models/user.model";
import { useUser } from "@clerk/nextjs";
import { ArrowBigDownIcon, ArrowBigUpIcon } from "lucide-react";
import mongoose from "mongoose";

export const UpDownVoteComment = ({ comment, currentUser }: { comment: any, currentUser: IUser }) => {
  const { isLoaded, user } = useUser();
  const { toast } = useToast();
  const handleUpvote = async () => {
    if (!currentUser) {
      toast({
        title: "Login to upvote",
        description: "You need to login to upvote a comment",
      });
      return;
    }
    await upVoteComment(comment._id, currentUser._id?.toString()!);
  }
  const handleDownvote = async () => {
    if (!currentUser) {
      toast({
        title: "Login to downvote",
        description: "You need to login to downvote a comment",
      });
      return;
    }
    await downVoteComment(comment._id, currentUser._id?.toString()!);
  }
  return (
    <div className="flex items-center gap-1">
      <ArrowBigUpIcon
        className="w-6 h-6 cursor-pointer text-indigo-500"
        strokeWidth={1.1}
        onClick={handleUpvote}
        fill={comment?.upvotes?.includes(currentUser?._id) ? "#667eea" : "none"}
      />
      <span className="text-xs  font-medium">
        {comment?.upvotes?.length! - comment?.downvotes?.length!}
      </span>
      <ArrowBigDownIcon
        className="w-6 h-6 cursor-pointer text-red-500"
        strokeWidth={1.1}
        onClick={handleDownvote}
        fill={comment?.downvotes?.includes(currentUser?._id) ? "red" : "none"}
      />
    </div>
  );
};
