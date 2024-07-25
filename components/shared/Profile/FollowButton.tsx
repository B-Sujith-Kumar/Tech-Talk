"use client";
import { useToast } from "@/components/ui/use-toast";
import { followUser, unFollowUser } from "@/lib/actions/user.actions";
import { IUser } from "@/lib/database/models/user.model";
import React from "react";

type FollowButtonProps = {
  isFollowing: boolean;
  currentUser: IUser;
  user: IUser;
};

const FollowButton = ({
  isFollowing,
  currentUser,
  user,
}: FollowButtonProps) => {
  const { toast } = useToast();
  const handleFollow = async () => {
    try {
      const { status } = await followUser(
        user._id?.toString()!,
        currentUser._id?.toString()!
      );
      if (status === 200) {
        toast({
          title: "Followed",
          description: `You are now following ${user.username}`,
        });
      } else {
        toast({
          title: "Error",
          description: "An error occurred",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred",
      });
    }
  };
  const handleUnfollow = async () => {
    try {
      const { status } = await unFollowUser(
        user._id?.toString()!,
        currentUser._id?.toString()!
      );
      if (status === 200) {
        toast({
          title: "Unfollowed",
          description: `You are no longer following ${user.username}`,
        });
      } else {
        toast({
          title: "Error",
          description: "An error occurred",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred",
      });
    }
  };
  return (
    <div>
      <div className="flex justify-end px-4 pt-5">
        {!isFollowing && (
          <button
            className="bg-indigo-500 text-white font-semibold px-3 py-2 rounded-md text-sm"
            onClick={handleFollow}
          >
            Follow
          </button>
        )}
        {isFollowing && (
          <button
            className="bg-indigo-500 text-white font-semibold px-3 py-2 rounded-md text-sm"
            onClick={handleUnfollow}
          >
            Unfollow
          </button>
        )}
      </div>
    </div>
  );
};

export default FollowButton;
