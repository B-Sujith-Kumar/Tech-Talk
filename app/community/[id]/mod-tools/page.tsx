import { getCommunity } from "@/lib/actions/community.actions";
import { getUser } from "@/lib/actions/user.actions";
import { ICommunity } from "@/lib/database/models/community.model";
import { SearchParamProps } from "@/types";
import { auth } from "@clerk/nextjs";
import mongoose from "mongoose";
import Link from "next/link";
import React from "react";

const ModTools = async ({ params: { id } }: SearchParamProps) => {
  const { userId } = auth();
  const currentUser = await getUser(userId!);
  const { community } = await getCommunity(id);
  console.log(community);
  const isMod =
    (community.moderators &&
      community.moderators.some(
        (mod: mongoose.Types.ObjectId) =>
          mod.toString() === currentUser._id.toString()
      )) ||
    community.createdBy._id.toString() === currentUser._id.toString() ||
    false;
  if (!isMod)
    return (
      <div className="text-2xl font-semibold text-center flex justify-center items-center h-full">
        You are not a moderator
      </div>
    );
  return (
    <div className="px-5">
      <p className="text-3xl font-semibold">Queue</p>
      <div className="flex gap-8 text-sm mt-5">
        <Link href="" className="font-semibold text-gray-600">
          Needs Review
        </Link>
        <Link href="" className="font-semibold text-gray-600">
          Reported
        </Link>
        <Link href="" className="font-semibold text-gray-600">
          Removed
        </Link>
      </div>
    </div>
  );
};

export default ModTools;
