"use client";

import { joinCommunity, leaveCommunity } from "@/lib/actions/community.actions";
import React from "react";

const JoinCommunity = ({
  isMember,
  communityId,
  userId,
}: {
  isMember: boolean;
  communityId: string;
  userId?: string;
}) => {
  const join = async () => {
    const res = await joinCommunity(communityId, userId!);
  };
  const leave = async () => {
    const res = await leaveCommunity(communityId, userId!);
  }
  return (
    <div>
      {isMember && (
        <button className="border rounded-full text-gray-700  border-gray-500 py-2 px-3" onClick={leave}>
          Joined
        </button>
      )}
      {!isMember && (
        <button className="rounded-full  bg-blue-700 text-white border-gray-500 py-2 px-3" onClick={join}>
          Join
        </button>
      )}
    </div>
  );
};

export default JoinCommunity;
