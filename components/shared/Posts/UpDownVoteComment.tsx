"use client";

import { useToast } from "@/components/ui/use-toast";
import { downVoteComment, upVoteComment } from "@/lib/actions/post.action";
import { downvotePost, upvotePost } from "@/lib/actions/user.actions";
import { IComment } from "@/lib/database/models/comment.model";
import { IUser } from "@/lib/database/models/user.model";
import { useUser } from "@clerk/nextjs";
import { ArrowBigDownIcon, ArrowBigUpIcon } from "lucide-react";
import mongoose from "mongoose";
import { useState } from "react";

export const UpDownVoteComment = ({
  comment,
  currentUser,
  reply,
  postId,
}: {
  comment: any;
  currentUser: IUser;
  reply?: boolean;
  postId?: string;
}) => {
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
    const { status, responseComment } = await upVoteComment(
      comment._id,
      currentUser._id?.toString()!,
      postId
    );
    if (status === 200) {
    }
  };
  const handleDownvote = async () => {
    if (!currentUser) {
      toast({
        title: "Login to downvote",
        description: "You need to login to downvote a comment",
      });
      return;
    }
    const { status, responseComment } = await downVoteComment(
      comment._id,
      currentUser._id?.toString()!,
      postId
    );
    if (status === 200) {
    }
  };
  return (
    <div className="flex items-center gap-1">
      <ArrowBigUpIcon
        className="w-6 h-6 cursor-pointer text-indigo-500"
        strokeWidth={1.1}
        onClick={handleUpvote}
        fill={comment.upvotes?.includes(currentUser?._id) ? "#667eea" : "none"}
      />
      <span className="text-xs  font-medium">
        {comment.upvotes.length - comment.downvotes.length}
      </span>
      <ArrowBigDownIcon
        className="w-6 h-6 cursor-pointer text-red-500"
        strokeWidth={1.1}
        onClick={handleDownvote}
        fill={comment.downvotes?.includes(currentUser?._id) ? "red" : "none"}
      />
    </div>
  );
};
