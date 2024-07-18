import DashboardSidebar from "@/components/shared/Dashboard/DashboardSidebar";
import FollowingTagsContainer from "@/components/shared/Dashboard/FollowingTagsContainer";
import { getFollowingTags, getStats, getUser } from "@/lib/actions/user.actions";
import { ITag } from "@/lib/database/models/tag.model";
import { auth } from "@clerk/nextjs";
import React from "react";

const FollowingTags = async () => {
  const { userId } = auth();
  const currentUser = await getUser(userId as string);
  const stats = await getStats(userId as string);
  const {tags} : {tags: ITag[]} = await getFollowingTags(userId as string);
  console.log(tags);
  return (
    <div className="lg:flex">
      <DashboardSidebar stats={stats} />
      <div className="px-12 max-xl:px-8 max-lg:px-5 max-md:px-0 flex-1">
        <h1 className="text-2xl font-semibold py-2 max-md:text-2xl max-lg:mt-8">
          Following Tags
        </h1>
        <div className="grid grid-cols-3 gap-4 w-full mt-3 max-[820px]:grid-cols-2 max-sm:grid-cols-1">
          <div className="bg-white px-5 border rounded-lg py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{stats.tags}</h1>
              <p className="mt-2 font-lg text-gray-500">Total following tags</p>
            </div>
          </div>
        </div>
          <FollowingTagsContainer tags={tags} currentUser={currentUser} />
      </div>
    </div>
  );
};

export default FollowingTags;
