"use client";
import { IUser } from "@/lib/database/models/user.model";
import React, { useEffect, useState } from "react";
import ModeratorCard from "./ModeratorCard";
import { ICommunity } from "@/lib/database/models/community.model";

const ModeratorContainer = ({
  moderators,
  isOwner,
  community,
}: {
  moderators: IUser[];
  isOwner: boolean;
  community: ICommunity;
}) => {
  const [moderatorList, setModeratorList] = useState<IUser[]>(moderators);
  const [search, setSearch] = useState("");
  useEffect(() => {
    setModeratorList(
      moderators.filter((moderator) =>
        (moderator.firstName + " " + moderator.lastName)
          .toLowerCase()
          .includes(search.toLowerCase())
      )
    );
  }, [search]);
  return (
    <div>
      <div>
        <div className="flex items-center mt-6 gap-3">
          <input
            type="text"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
            placeholder={`Search moderators...`}
            className="flex-1 py-2 px-3 border-2 border-gray-300 bg-inherit rounded-lg"
          />
          <button className="bg-indigo-500 outline-indigo-500 text-white px-4 py-3 h-full rounded-md text-sm font-semibold">
            Search
          </button>
        </div>
        <div className="mt-8 grid grid-cols-3 gap-3 max-sm:grid-cols-2 max-[410px]:grid-cols-1">
          {moderatorList.map((moderator: IUser) => (
            <ModeratorCard user={moderator} isOwner={isOwner} community={community} key={moderator._id?.toString()}/>
          ))}
        </div>
        {}
      </div>
    </div>
  );
};

export default ModeratorContainer;
