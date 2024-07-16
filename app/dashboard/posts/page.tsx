import DashboardPost from "@/components/shared/Dashboard/DashboardPost";
import DashboardSidebar from "@/components/shared/Dashboard/DashboardSidebar";
import FeedPost from "@/components/shared/Posts/FeedPost";
import { getPosts } from "@/lib/actions/post.action";
import { getStats, getUser } from "@/lib/actions/user.actions";
import { IPostPopulated } from "@/types";
import { auth } from "@clerk/nextjs";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  ArrowBigDownIcon,
  ArrowBigUpIcon,
  MessageCircleIcon,
} from "lucide-react";
import Link from "next/link";
import React from "react";

const Dashboard = async () => {
  const { userId } = auth();
  const stats = await getStats(userId as string);
  const user = await getUser(userId as string);
  const user_id = user._id;
  const posts = await getPosts(user_id as string);
  console.log(posts);
  return (
    <div className="flex">
      <DashboardSidebar stats={stats} />
      <div className="px-12 max-xl:px-8 max-lg:px-5 max-md:px-0 flex-1">
        <h1 className="text-2xl font-semibold py-2 max-md:text-2xl max-lg:mt-8">
          Posts
        </h1>
        <div className="grid grid-cols-3 gap-4 w-full mt-3 max-[820px]:grid-cols-2 max-sm:grid-cols-1">
          <div className="bg-white px-5 border rounded-lg py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{stats.upvotes}</h1>
              <p className="mt-2 font-lg text-gray-500">Total post upvotes</p>
            </div>
            <ArrowBigUpIcon
              strokeWidth={1.1}
              size={55}
              className="text-indigo-500"
              fill="rgb(99, 102, 241)"
            />
          </div>
          <div className="bg-white px-5 border rounded-lg py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{stats.totalComments}</h1>
              <p className="mt-2 font-lg text-gray-500">Total post comments</p>
            </div>
            <MessageCircleIcon
              strokeWidth={1.1}
              size={40}
              className="text-gray-600"
              fill="rgb(75 85 99)"
            />
          </div>
          <div className="bg-white px-5 border rounded-lg py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{stats.totalViews}</h1>
              <p className="mt-2 font-lg text-gray-500">Total post views</p>
            </div>
            <FontAwesomeIcon icon={faEye} className="text-gray-500" size="2x" />
          </div>
          <div className="bg-white px-5 border rounded-lg py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{stats.downvotes}</h1>
              <p className="mt-2 font-lg text-gray-500">Total post downvotes</p>
            </div>
            <ArrowBigDownIcon
              strokeWidth={1.1}
              size={55}
              className="text-red-600"
              fill="rgb(220 38 38)"
            />
          </div>
        </div>
        <h1 className="text-2xl font-semibold py-2 mt-8 max-md:text-2xl">
          Your Posts
        </h1>
        <div className="mt-2">
          {posts.length > 0 &&
            posts.map((post: IPostPopulated) => (
              <FeedPost
                key={post._id?.toString()}
                post={post}
                showBanner={false}
              />
            ))}
        </div>
        {posts.length === 0 && (
          <div className="flex flex-col gap-8 items-center justify-center w-full h-96">
            <h1 className="text-2xl font-semibold text-gray-500 max-sm:text-center">
              No posts found. Create a post and come back here.
            </h1>
            <Link
              href="/post/create"
              className="text-white bg-indigo-500 px-5 py-2 rounded-md font-semibold"
            >
              Create post
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
