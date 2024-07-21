import { useToast } from "@/components/ui/use-toast";
import { removeModerator } from "@/lib/actions/community.actions";
import { followUser, unFollowUser } from "@/lib/actions/user.actions";
import { ICommunity } from "@/lib/database/models/community.model";
import { IUser } from "@/lib/database/models/user.model";
import mongoose from "mongoose";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const ModeratorCard = ({
  user,
  community,
  isOwner,
}: {
  user: IUser;
  community: ICommunity;
  isOwner: boolean;
}) => {
  const { toast } = useToast();
  const handleFollow = async () => {
    try {
      const { status, error } = await removeModerator(
        community._id?.toString()!,
        user._id?.toString()!
      );
        if (status === 200) {
            toast({
            title: `Removed as mod`,
            description: `User ${user.firstName + " " + user.lastName} has been removed as a moderator`,
            });
        } else {
            toast({
            title: `Error`,
            description: error,
            });
        }
    } catch (error) {
      console.error(error);
      toast({
        title: `Error`,
        description: `An error occurred while removing ${user.firstName + " " + user.lastName} as a moderator`,
      });
    }
  };
  return (
    <div>
      <div className="bg-white p-3 rounded-lg h-full shadow-lg">
        <div className="flex flex-col justify-center">
          <Image
            src={user.profilePicture!}
            width={60}
            height={60}
            alt="Profile picture"
            className="mx-auto aspect-square rounded-full border"
          />
          <Link
            href={`/user/${user._id?.toString()}`}
            className="text-center text-lg mt-2 font-semibold text-indigo-600"
          >
            {user.firstName + " " + user.lastName}
          </Link>
          <Link
            href={`/user/${user._id?.toString()}`}
            className="text-center text-sm mt-1 font-medium text-gray-500"
          >
            @{user.username}
          </Link>
          {
            <div className="text-sm flex text-gray-500 items-center justify-center gap-3 mt-2">
              <div className="flex items-center gap-1">
                <p className="font-bold text-gray-700">
                  {user.followers?.length}
                </p>
                <p className="">Followers</p>
              </div>
              <div className="flex items-center gap-1">
                <p className="font-bold text-gray-700">
                  {user.following?.length}
                </p>
                <p className="">Following</p>
              </div>
            </div>
          }

          {isOwner && (
            <button
              className="mt-4 bg-indigo-500 text-white px-4 py-2 rounded-lg font-semibold"
              onClick={handleFollow}
            >
              Remove as mod
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModeratorCard;
