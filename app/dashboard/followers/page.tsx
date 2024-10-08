import DashboardSidebar from "@/components/shared/Dashboard/DashboardSidebar";
import FollowCard from "@/components/shared/Dashboard/FollowCard";
import FollowContainer from "@/components/shared/Dashboard/FollowContainer";
import { getFollowers, getStats, getUser } from "@/lib/actions/user.actions";
import { IUser } from "@/lib/database/models/user.model";
import { auth } from "@clerk/nextjs";
import React from "react";

const FollowersPage = async () => {
  const { userId } = auth();
  const currentUser = await getUser(userId as string);
  const stats = await getStats(userId as string);
  const followers = await getFollowers(userId as string);
  return (
    <div className="lg:flex">
      <DashboardSidebar stats={stats} />
      <div className="px-12 max-xl:px-8 max-lg:px-5 max-md:px-0 flex-1">
        <h1 className="text-2xl font-semibold py-2 max-md:text-2xl max-lg:mt-8">
          Followers
        </h1>
        <div className="grid grid-cols-3 gap-4 w-full mt-3 max-[820px]:grid-cols-2 max-sm:grid-cols-1">
          <div className="bg-white px-5 border rounded-lg py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{stats.followers}</h1>
              <p className="mt-2 font-lg text-gray-500">Total followers</p>
            </div>
          </div>
        </div>
        <FollowContainer followers={followers} currentUser={currentUser} />
      </div>
    </div>
  );
};

export default FollowersPage;
