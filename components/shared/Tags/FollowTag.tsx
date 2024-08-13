"use client";
import { useToast } from "@/components/ui/use-toast";
import { followTag, unfollowTag } from "@/lib/actions/tag.actions";
import { IUser } from "@/lib/database/models/user.model";
import React from "react";

const FollowTag = ({
  isFollowing,
  currentUser,
  tagId,
}: {
  isFollowing: boolean;
  currentUser: IUser;
  tagId: string;
}) => {
  const { toast } = useToast();
  const handleFollow = async () => {
    const res = await followTag(currentUser.clerkId, tagId);
    if (res.status === 200) {
      toast({
        title: "Followed",
        description: "Tag followed successfully",
      });
    } else {
      console.log("Error following tag");
      toast({
        title: "Error",
        description: "Error following tag",
      });
    }
  };
  const handleUnfollow = async () => {
    const res = await unfollowTag(currentUser.clerkId, tagId);
    if (res.status === 200) {
      console.log("Unfollowed");
      toast({
        title: "Success",
        description: "Tag unfollowed successfully",
      });
    } else {
      console.log("Error unfollowing tag");
      toast({
        title: "Error",
        description: "Error unfollowing tag",
      });
    }
  };
  return (
    <div>
      {isFollowing ? (
        <button
          className="bg-blue-500 text-white font-semibold px-4 py-1 rounded"
          onClick={handleUnfollow}
        >
          Unfollow tag
        </button>
      ) : (
        <button
          className="bg-blue-500 text-white font-semibold px-4 py-1 rounded"
          onClick={handleFollow}
        >
          Follow tag
        </button>
      )}
    </div>
  );
};

export default FollowTag;
