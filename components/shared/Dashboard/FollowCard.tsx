import { useToast } from "@/components/ui/use-toast";
import { followUser, unFollowUser } from "@/lib/actions/user.actions";
import { IUser } from "@/lib/database/models/user.model";
import mongoose from "mongoose";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const FollowCard = ({
  user,
  currentUser,
}: {
  user: IUser;
  currentUser: IUser;
}) => {
  const isFollwing = currentUser.following?.includes(
    user._id as mongoose.Schema.Types.ObjectId
  );
  const {toast} = useToast();
  const handleFollow = async () => {
    try {
      const {status} = await followUser(user?._id!.toString(), currentUser?._id!.toString());
      if (status === 200) {
        toast({
            title: `Followed ${user.firstName + " " + user.lastName}`,
            description: `You are now following ${user.firstName + " " + user.lastName}`,        
        })
      } else {
        toast({
            title: `Error`,
            description: `An error occured while following ${user.firstName + " " + user.lastName}`,        
        })
      }
    } catch (error) {
      console.error(error);
        toast({
            title: `Error`,
            description: `An error occured while following ${user.firstName + " " + user.lastName}`,
        })
    }
  };
  const handleUnfollow = async () => {
    try {
      const {status} = await unFollowUser(user?._id!.toString(), currentUser?._id!.toString());
      if (status === 200) {
        toast({
            title: `Unfollowed ${user.firstName + " " + user.lastName}`,
            description: `You are now not following ${user.firstName + " " + user.lastName}`,        
        })
      } else {
        toast({
            title: `Error`,
            description: `An error occured while unfollowing ${user.firstName + " " + user.lastName}`,        
        })
      }
    } catch (error) {
      console.error(error);
        toast({
            title: `Error`,
            description: `An error occured while unfollowing ${user.firstName + " " + user.lastName}`,
        })
    }
  }
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
            href={`/user/${user.username?.toString()}`}
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
          {isFollwing ? (
            <button className="mt-4 bg-gray-200 text-gray-500 px-4 py-2 rounded-lg font-semibold" onClick={handleUnfollow}>
              Following
            </button>
          ) : (
            <button className="mt-4 bg-indigo-500 text-white px-4 py-2 rounded-lg font-semibold" onClick={handleFollow}>
              Follow
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowCard;
