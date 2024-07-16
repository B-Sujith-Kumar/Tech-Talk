import React from "react";

export type StatsType = {
  posts: number;
  followers: number;
  following: number;
  followingTags: number;
  communities: number;
  analytics: number;
};
const DashboardPost = ({ stats }: { stats: StatsType }) => {
  return (
    <div>
      <div className="flex gap-2 mt-4">
        <div className="w-[20%]">
          <h3 className="w-full flex rounded-md bg-white justify-between px-3 py-2 items-center font-medium ">
            Posts <span className="bg-gray-300 px-2 rounded-md" >{stats.posts}</span>
          </h3>
          <h3 className="w-full flex rounded-md justify-between px-3 py-2 items-center font-medium">
            Followers <span className="bg-gray-300 px-2 rounded-md">{stats.followers}</span>
          </h3>
          <h3 className="w-full flex rounded-md justify-between px-3 py-2 items-center font-medium">
            Following <span className="bg-gray-300 px-2 rounded-md">{stats.following}</span>
          </h3>
          <h3 className="w-full flex rounded-md justify-between px-3 py-2 items-center font-medium">
            Following tags <span className="bg-gray-300 px-2 rounded-md">{stats.followingTags}</span>
          </h3>
          <h3 className="w-full flex rounded-md justify-between px-3 py-2 items-center font-medium">
            Communities <span className="bg-gray-300 px-2 rounded-md">{stats.communities}</span>
          </h3>
          <h3 className="w-full flex rounded-md justify-between px-3 py-2 items-center font-medium">
            Analytics
          </h3>
        </div>
      </div>
    </div>
  );
};

export default DashboardPost;
