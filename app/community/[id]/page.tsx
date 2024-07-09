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

const Page = async ({ params: { id } }: SearchParamProps) => {
  const res = await getCommunity(id);
  const community = res.community;
  const { userId } = auth();
  const userObjectId = await getUserObjectId(userId!);
  const isMember = community.members
    .map((member: any) => member._id === userObjectId)
    .includes(true);
  return (
    <div>
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
              {(isMember || (!isMember && community.createdBy._id.toString() === userObjectId)) && <Link
                href={`/post/create`}
                className="flex gap-2 items-center border border-gray-500 px-3 py-2 rounded-full text-gray-700 font-medium "
              >
                <FontAwesomeIcon icon={faPlus} />
                Create a post
              </Link>}
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
              <div className="border rounded-full text-gray-700 border-gray-500 p-2 px-3">
                <FontAwesomeIcon icon={faEllipsis} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
