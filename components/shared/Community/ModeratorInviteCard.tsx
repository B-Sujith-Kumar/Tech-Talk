"use client";
import { useToast } from "@/components/ui/use-toast";
import { withdrawInvite } from "@/lib/actions/community.actions";
import { ICommunity } from "@/lib/database/models/community.model";
import { IUser } from "@/lib/database/models/user.model";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const ModeratorInviteCard = ({
  user,
  community,
}: {
  user: IUser;
  community: ICommunity;
}) => {
  const { toast } = useToast();
  const handleWithdraw = async () => {
    try {
      const { success } = await withdrawInvite(
        community._id?.toString()!,
        user.clerkId
      );
      if (success) {
        toast({
          title: `Invite withdrawn`,
          description: `Invite to ${
            user.firstName + " " + user.lastName
          } has been withdrawn`,
        });
      } else {
        toast({
          title: `Error`,
          description: `An error occured while withdrawing invite to ${
            user.firstName + " " + user.lastName
          }`,
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: `Error`,
        description: `An error occured while withdrawing invite to ${
          user.firstName + " " + user.lastName
        }`,
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
          <button
            className="mt-4 bg-gray-200 text-gray-500 px-4 py-2 rounded-lg font-semibold"
            onClick={handleWithdraw}
          >
            Withdraw invite
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModeratorInviteCard;
