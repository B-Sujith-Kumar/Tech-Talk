"use client";

import { IUser } from "@/lib/database/models/user.model";
import React, { useEffect, useState } from "react";
import FollowCard from "./FollowCard";

const FollowContainer = ({
  followers,
  currentUser,
  following
}: {
  followers: IUser[];
  currentUser: IUser;
  following? : boolean
}) => {
  const [followersList, setFollowersList] = useState<IUser[]>(followers);
  const [search, setSearch] = useState("");
  useEffect(() => {
    setFollowersList(
      followers.filter((follower) =>
        (follower.firstName + " " + follower.lastName).toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search]);
  const handleSearch = () => {
    setFollowersList(
      followers.filter((follower) =>
        (follower.firstName + " " + follower.lastName).toLowerCase().includes(search.toLowerCase())
      )
    );
  }
  return (
    <div>
      <div className="flex items-center mt-6 gap-3">
        <input
          type="text"
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          placeholder={`Search ${following ? "following" : "followers"}...`}
          className="flex-1 py-2 px-3 border-2 border-gray-300 bg-inherit rounded-lg"
        />
        <button className="bg-indigo-500 outline-indigo-500 text-white px-4 py-3 h-full rounded-md text-sm font-semibold" >
          Search
        </button>
      </div>
      <div className="mt-8 grid grid-cols-3 gap-3 max-sm:grid-cols-2 max-[410px]:grid-cols-1">
        {followersList.map((follower: IUser) => (
          <FollowCard currentUser={currentUser} user={follower} />
        ))}
      </div>
      {
        
      }
    </div>
  );
};

export default FollowContainer;
