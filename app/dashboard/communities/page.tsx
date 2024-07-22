import ModInvite from "@/components/shared/Community/ModInvite";
import DashboardSidebar from "@/components/shared/Dashboard/DashboardSidebar";
import FollowCard from "@/components/shared/Dashboard/FollowCard";
import FollowContainer from "@/components/shared/Dashboard/FollowContainer";
import { getModInvites } from "@/lib/actions/community.actions";
import { getFollowers, getStats, getUser } from "@/lib/actions/user.actions";
import { ICommunity } from "@/lib/database/models/community.model";
import { IUser } from "@/lib/database/models/user.model";
import { auth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Communities = async () => {
  const { userId } = auth();
  const currentUser = await getUser(userId as string);
  const stats = await getStats(userId as string);
  const invites = await getModInvites(userId as string);
  return (
    <div className="lg:flex">
      <DashboardSidebar stats={stats} />
      <div className="px-12 max-xl:px-8 max-lg:px-5 max-md:px-0 flex-1">
        <h1 className="text-2xl font-semibold py-2 max-md:text-2xl max-lg:mt-8">
          Moderator invites
        </h1>
        <div className="grid grid-cols-3 gap-4 w-full mt-3 max-[820px]:grid-cols-2 max-sm:grid-cols-1">
          <div className="bg-white px-5 border rounded-lg py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{invites.length}</h1>
              <p className="mt-2 font-lg text-gray-500">Total invites</p>
            </div>
          </div>
        </div>
        <div className="mt-4">
          {invites.map((invite : ICommunity) => (
            <ModInvite invite={invite} currentUser={currentUser} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Communities;
