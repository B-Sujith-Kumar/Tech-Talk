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
}: {
  comment: any;
  currentUser: IUser;
}) => {
  const { isLoaded, user } = useUser();
  const [upVotes, setUpVotes] = useState(comment.upvotes);
  const [downVotes, setDownVotes] = useState(comment.downvotes);

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
      currentUser._id?.toString()!
    );
    if (status === 200) {
      setUpVotes(responseComment.upvotes);
      setDownVotes(responseComment.downvotes);
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
      currentUser._id?.toString()!
    );
    if (status === 200) {
      setUpVotes(responseComment.upvotes);
      setDownVotes(responseComment.downvotes);
    }
  };
  return (
    <div className="flex items-center gap-1">
      <ArrowBigUpIcon
        className="w-6 h-6 cursor-pointer text-indigo-500"
        strokeWidth={1.1}
        onClick={handleUpvote}
        fill={upVotes?.includes(currentUser?._id) ? "#667eea" : "none"}
      />
      <span className="text-xs  font-medium">
        {upVotes.length - downVotes.length}
      </span>
      <ArrowBigDownIcon
        className="w-6 h-6 cursor-pointer text-red-500"
        strokeWidth={1.1}
        onClick={handleDownvote}
        fill={downVotes?.includes(currentUser?._id) ? "red" : "none"}
      />
    </div>
  );
};
