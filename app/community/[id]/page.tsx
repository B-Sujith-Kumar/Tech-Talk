import CommunityOptions from "@/components/shared/Community/CommunityOptions";
import CommunityPost from "@/components/shared/Community/CommunityPost";
import JoinCommunity from "@/components/shared/Community/JoinCommunity";
import { getCommunity } from "@/lib/actions/community.actions";
import { getUserObjectId } from "@/lib/actions/user.actions";
import { SearchParamProps } from "@/types";
import { auth } from "@clerk/nextjs";
import { faBell, faEllipsis, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import mongoose from "mongoose";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dot } from "lucide-react";

const Page = async ({ params: { id } }: SearchParamProps) => {
  const res = await getCommunity(id);
  const community = res.community;
  const { userId } = auth();
  const userObjectId = await getUserObjectId(userId!);
  const isMember = community.members
    .map((member: any) => member._id === userObjectId)
    .includes(true);
  return (
    <div className="sm:px-6">
      <div className="relative">
        <Image
          src={community.banner}
          width={500}
          height={5}
          alt="community banner"
          className="w-full h-24 max-sm:h-20 object-cover rounded-xl relative"
        />
        <div className="flex items-end justify-between relative sm:bottom-6 sm:px-4 flex-wrap max-sm:gap-4">
          <div className="flex items-end gap-2">
            <div className="p-1 rounded-full bg-white max-sm:mt-4">
              <Image
                src={community.icon}
                width={75}
                height={75}
                alt="community icon"
                className="rounded-full max-sm:w-12"
              />
            </div>
            <div className="max-sm:flex max-sm:flex-col">
              <h1 className="font-semibold text-2xl max-sm:text-lg">
                c/{community.name}
              </h1>
              <p className="sm:hidden text-sm text-gray-700">
                {community.members.length} members
              </p>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              {(isMember ||
                (!isMember &&
                  community.createdBy._id.toString() === userObjectId)) && (
                <Link
                  href={`/post/create`}
                  className="flex gap-2 items-center border border-gray-500 px-3 py-2 rounded-full text-gray-700 font-medium "
                >
                  <FontAwesomeIcon icon={faPlus} />
                  Create a post
                </Link>
              )}
              {isMember && (
                <div className="border rounded-full py-2 px-3  border-gray-500">
                  <FontAwesomeIcon icon={faBell} size="lg" />
                </div>
              )}
              <JoinCommunity
                isMember={isMember}
                communityId={community._id?.toString()}
                userId={userObjectId}
              />
              <CommunityOptions community={community} />
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-3">
        <div className="xl:w-[70%] max-md:mt-4">
          <Select>
            <SelectTrigger className="w-[120px] active:bg-inherit bg-inherit focus-visible:ring-0 borer-0 ring-0 outline-none focus:ring-0 ring-offset-0">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent className="bg-white ">
              <SelectItem
                value="light"
                className="py-3 hover:bg-gray-200 cursor-pointer"
              >
                Latest
              </SelectItem>
              <SelectItem
                value="dark"
                className="py-3 hover:bg-gray-200 cursor-pointer"
              >
                Trending
              </SelectItem>
              <SelectItem
                value="system"
                className="py-3 hover:bg-gray-200 cursor-pointer"
              >
                Popular
              </SelectItem>
            </SelectContent>
          </Select>

          <CommunityPost />
        </div>
        <div className="bg-white px-4 py-2 max-xl:hidden w-[30%] text-gray-700 rounded-lg h-fit text-sm">
          <p className="font-semibold text-base">/c/{community.name}</p>
          <p className="mt-2 text-sm text-gray-500">{community.description}</p>
          <div className="mt-2 flex justify-between">
            <div className="flex flex-col gap1">
              <p className="font-bold">{community.members.length}</p>
              <p className="text-gray-500">Members</p>
            </div>
            <div className="flex flex-col gap1">
              <p className="font-bold">52</p>
              <div className="text-gray-500 flex items-center gap-1">
                <Dot
                  className="bg-green-500 rounded-full"
                  size={7}
                  color="#10b981"
                />
                Online
              </div>
            </div>
            <div className="flex flex-col gap1">
              <p className="font-bold">Top 1%</p>
              <p className="text-gray-500">Rank by size</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
