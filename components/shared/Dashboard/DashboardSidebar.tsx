"use client";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export type StatsType = {
  posts: number;
  followers: number;
  following: number;
  followingTags: number;
  communities: number;
  analytics: number;
};
const DashboardSidebar = ({ stats }: { stats: StatsType }) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathName = usePathname();
  return (
    <div className="font-worksans relative">
      <div className="hidden lg:flex flex-col px-2 w-64 min-h-screen h-full  text-white">
        <div className=" text-black  mt-2 text-2xl font-semibold">
          Dashboard
        </div>
        <nav className="flex-1 flex flex-col text-black gap-1 py-5 space-y-1">
          <Link
            href="/dashboard/posts"
            className={`flex  px-2 py-2 items-center ${
              pathName.includes("/dashboard/posts")
                ? "bg-white rounded-md font-medium border text-black"
                : "text-gray-700"
            } justify-between`}
          >
            <p>Posts</p>
            <span className="bg-gray-300 px-2 rounded-md">{stats.posts}</span>
          </Link>
          <Link
            href="/dashboard/followers"
            className={`flex  px-2 py-2 items-center ${
              pathName.includes("/dashboard/followers")
                ? "bg-white rounded-md font-medium border text-black"
                : "text-gray-700"
            } justify-between`}
          >
            <p>Followers</p>
            <span className="bg-gray-300 px-2 rounded-md">
              {stats.followers}
            </span>
          </Link>
          <Link
            href="/dashboard/following"
            className={`flex  px-2 py-2 items-center ${
              pathName.includes("/dashboard/following")
                ? "bg-white rounded-md font-medium border text-black"
                : "text-gray-700"
            } justify-between`}
          >
            <p>Following</p>
            <span className="bg-gray-300 px-2 rounded-md">
              {stats.following}
            </span>
          </Link>
          <Link
            href="/dashboard/following-tags"
            className={`flex  px-2 py-2 items-center ${
              pathName.includes("/dashboard/following-tags")
                ? "bg-white rounded-md font-medium border text-black"
                : "text-gray-700"
            } justify-between`}
          >
            <p>Following tags</p>
            <span className="bg-gray-300 px-2 rounded-md">
              {stats.followingTags}
            </span>
          </Link>
          <Link
            href="/dashboard/communities"
            className={`flex  px-2 py-2 items-center ${
              pathName.includes("/dashboard/communities")
                ? "bg-white rounded-md font-medium border text-black"
                : "text-gray-700"
            } justify-between`}
          >
            <p>Communities</p>
            <span className="bg-gray-300 px-2 rounded-md">
              {stats.communities}
            </span>
          </Link>
        </nav>
      </div>

      <div
        className="lg:hidden absolute -top-[4px] z-10 left-4 max-md:left-0 text-white p-2 rounded"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          ""
        ) : (
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faArrowRight} className="text-black" />
          </div>
        )}
      </div>

      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      <div
        className={`lg:hidden fixed inset-0 z-40 transition-transform transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } w-64 bg-background text-white`}
      >
        <div className="p-4 mt-16 flex items-center justify-between">
          <h2 className="text-black text-2xl font-semibold">Dashboard</h2>
          <button
            className="lg:hidden text-white p-2 rounded"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <FontAwesomeIcon icon={faArrowLeft} className="text-black" />
            ) : (
              <FontAwesomeIcon icon={faArrowRight} className="text-black" />
            )}
          </button>
        </div>
        <nav className="flex-1 flex flex-col gap-3 px-4 py-5 space-y-1">
          <Link
            href="/dashboard/posts"
            className={`flex  px-2 py-2 items-center ${
              pathName.includes("/dashboard/posts")
                ? "bg-white rounded-md font-medium border text-black"
                : "text-gray-700"
            } justify-between`}
          >
            <p>Posts</p>
            <span className="bg-gray-300 px-2 rounded-md">{stats.posts}</span>
          </Link>
          <Link
            href="/dashboard/followers"
            className={`flex  px-2 py-2 items-center ${
              pathName.includes("/dashboard/followers")
                ? "bg-white rounded-md font-medium border text-black"
                : "text-gray-700"
            } justify-between`}
          >
            <p>Followers</p>
            <span className="bg-gray-300 px-2 rounded-md">
              {stats.followers}
            </span>
          </Link>
          <Link
            href="/dashboard/following"
            className={`flex  px-2 py-2 items-center ${
              pathName.includes("/dashboard/follwing")
                ? "bg-white rounded-md font-medium border text-black"
                : "text-gray-700"
            } justify-between`}
          >
            <p>Following</p>
            <span className="bg-gray-300 px-2 rounded-md">
              {stats.following}
            </span>
          </Link>
          <Link
            href="/dashboard/following-tags"
            className={`flex  px-2 py-2 items-center ${
              pathName.includes("/dashboard/following-tags")
                ? "bg-white rounded-md font-medium border text-black"
                : "text-gray-700"
            } justify-between`}
          >
            <p>Following tags</p>
            <span className="bg-gray-300 px-2 rounded-md">
              {stats.followingTags}
            </span>
          </Link>
          <Link
            href="/dashboard/communities"
            className={`flex  px-2 py-2 items-center ${
              pathName.includes("/dashboard/communities")
                ? "bg-white rounded-md font-medium border text-black"
                : "text-gray-700"
            } justify-between`}
          >
            <p>Communities</p>
            <span className="bg-gray-300 px-2 rounded-md">
              {stats.communities}
            </span>
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default DashboardSidebar;
