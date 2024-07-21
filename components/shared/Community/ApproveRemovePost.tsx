"use client"
import React from "react";
import FeedPost from "../Posts/FeedPost";
import { IPost } from "@/lib/database/models/post.model";
import { IPostPopulated } from "@/types";
import { ICommunity } from "@/lib/database/models/community.model";
import { approvePost, removePost } from "@/lib/actions/community.actions";
import { useToast } from "@/components/ui/use-toast";

const ApproveRemovePost = ({
    post,
    community,
  }: {
    post: IPostPopulated;
    community: ICommunity;
  }) => {
  const { toast } = useToast();
  const handleApprove = async () => {
    try {
      const { success } = await approvePost(
        post._id?.toString()!,
        community._id?.toString()!
      );
      if (success) {
        toast({
          title: "Post approved!",
          description:
            "The post has been approved and is now visible to the community",
        });
      } else {
        toast({
          title: "An error occurred",
          description: "An error occurred while approving the post",
        });
      }
    } catch (error) {
      toast({
        title: "An error occurred",
        description: "An error occurred while approving the post",
      });
    }
  };
  const handleRemove = async () => {
    try {
      const { success } = await removePost(
        post._id?.toString()!,
        community._id?.toString()!
      );
      if (success) {
        toast({
          title: "Post removed!",
          description: "The post has been removed from the community",
        });
      } else {
        toast({
          title: "An error occurred",
          description: "An error occurred while removing the post",
        });
      }
    } catch (error) {
      toast({
        title: "An error occurred",
        description: "An error occurred while removing the post",
      });
    }
  };
  return (
    <div className="mt-3 flex gap-3">
      <button
        className="text-sm bg-indigo-500 font-semibold text-white rounded-md p-2"
        onClick={handleApprove}
      >
        Approve post
      </button>
      <button
        className="text-sm font-semibold bg-red-600 text-white rounded-md p-2"
        onClick={handleRemove}
      >
        Remove post
      </button>
    </div>
  );
};

export default ApproveRemovePost;
