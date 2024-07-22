import ModeratorContainer from "@/components/shared/Community/ModeratorContainer";
import ModeratorInvite from "@/components/shared/Community/ModeratorInvite";
import ModeratorOptions from "@/components/shared/Community/ModeratorOptions";
import {
  getCommunity,
  getModerators,
  populateModInvites,
} from "@/lib/actions/community.actions";
import { getUser } from "@/lib/actions/user.actions";
import { SearchParamProps } from "@/types";
import { auth, useAuth } from "@clerk/nextjs";
import mongoose from "mongoose";
import React from "react";

const Moderators = async ({ params: { id } }: SearchParamProps) => {
  const { community } = await getCommunity(id);
  const { userId } = auth();
  const currentUser = await getUser(userId!);
  const moderators = await getModerators(community._id.toString());
  const invitedModerators = await populateModInvites(community._id.toString());
  console.log(invitedModerators);
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
    <div className="sm:px-5">
      <p className="text-3xl font-semibold">Moderators</p>
      <div className="flex justify-end gap-3 mb-10">
        <ModeratorOptions
          community={community}
          currentUser={currentUser}
          communityId={community._id.toString()}
        />
      </div>
      {moderators.length > 0 ? (
        <ModeratorContainer
          moderators={moderators}
          isOwner={
            community.createdBy._id.toString() === currentUser._id.toString()
          }
          community={community}
        />
      ) : (
        <div className="text-2xl text-gray-500 max-sm:text-xl font-semibold text-center flex justify-center items-center h-full mt-20">
          No moderators to show here
        </div>
      )}
      <p className="text-2xl font-semibold mt-7">Invited moderators</p>
      <div className="mb-10">
        <ModeratorInvite
          community={community}
          invites={invitedModerators}
        />
      </div>
    </div>
  );
};

export default Moderators;
