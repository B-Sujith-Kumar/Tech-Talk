import FeedPost from "@/components/shared/Posts/FeedPost";
import FollowButton from "@/components/shared/Profile/FollowButton";
import InfoContainer from "@/components/shared/Profile/InfoContainer";
import { getPosts } from "@/lib/actions/post.action";
import {
  getRecentComments,
  getStats,
  getUser,
  getUserByUserName,
} from "@/lib/actions/user.actions";
import { IUser } from "@/lib/database/models/user.model";
import { formatDate } from "@/lib/utils";
import { ICommentPopulated, IPostPopulated } from "@/types";
import { auth } from "@clerk/nextjs";
import {
  Cake,
  Divide,
  Hash,
  Link as LinkIcon,
  MapPin,
  MessageCircle,
  Newspaper,
} from "lucide-react";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type ProfileProps = {
  params: { username: string };
};

const ProfilePage = async ({ params: { username } }: ProfileProps) => {
  const user: IUser = await getUserByUserName(username);
  const stats = await getStats(user.clerkId);
  const { userId } = auth();
  const currentUser = await getUser(userId);
  const comments = await getRecentComments(user.clerkId);
  let posts = await getPosts(user._id?.toString()!);
  const isFollowing = currentUser.following.includes(user._id);
  posts.reverse();
  if (!user) {
    return <div>User not found</div>;
  }
  return (
    <div className="h-full">
      <div className="h-40 bg-indigo-500 relative rounded-lg"></div>
      <div className="relative -mt-10 z-10 max-lg:px-2">
        <div className="bg-white max-w-5xl shadow-md mx-auto border border-b-0 rounded-lg relative">
          <div className="relative">
            <Image
              src={user.profilePicture!}
              width={50}
              height={50}
              alt={user.username}
              className="aspect-square p-[8px] border-white bg-indigo-500 w-24 -top-12 rounded-full absolute  left-[45%] max-sm:left-[40%] max-[430px]:left-[38%]"
            />
          </div>
          {user._id?.toString() !== currentUser._id?.toString() && (
            <FollowButton
              currentUser={currentUser}
              user={user}
              isFollowing={isFollowing}
            />
          )}
          <div
            className={`pb-6 ${
              user.education || user.work ? "border-b-[1px]" : ""
            }`}
          >
            <p
              className={`text-2xl font-semibold ${
                user._id?.toString() !== currentUser._id?.toString()
                  ? "mt-5"
                  : "mt-16"
              } text-center text-gray-800`}
            >
              {user.firstName + " " + user.lastName}
            </p>
            <p className="text-center mt-3 max-w-[65%] mx-auto">{user.bio}</p>
            <div className="flex justify-center items-center mt-4 gap-10">
                <div className="flex items-center gap-2">
                    <p className="text-gray-600 font-semibold">{stats.followers}</p>
                    <p className="text-gray-600 ">Followers</p>
                </div>
                <div className="flex items-center gap-2">
                    <p className="text-gray-600 font-semibold">{stats.following}</p>
                    <p className="text-gray-600">Following</p>
                </div>
            </div>
            <div className="flex flex-wrap justify-center gap-10 gap-y-5 mt-6">
              {user.location && (
                <div className="flex items-center gap-2 text-gray-600 justify-center">
                  <MapPin size={20} />
                  <p className="text-sm">{user.location}</p>
                </div>
              )}
              <div className="flex items-center gap-2 text-gray-600 justify-center">
                <Cake size={20} />
                <p className="text-sm">
                  Joined on {formatDate(user.createdAt?.toString()!)}
                </p>
              </div>
              {user.websiteUrl && (
                <div className="flex items-center gap-2 text-gray-600 justify-center">
                  <LinkIcon size={17} />
                  <Link
                    target="_blank"
                    href={user.websiteUrl!}
                    className="text-sm"
                  >
                    {user.websiteUrl}
                  </Link>
                </div>
              )}
            </div>
          </div>
          {(user.education || user.work) && (
            <div className="flex items-center flex-wrap gap-y-4 text-sm justify-around mt-4 pb-4">
              {user.education && (
                <div className="flex flex-col items-center gap-2 text-gray-600 justify-center">
                  <p>Education</p>
                  <p className="text-base text-gray-800 text-center">
                    {user.education}
                  </p>
                </div>
              )}
              {user.work && (
                <div className="flex flex-col items-center gap-2 text-gray-600 justify-center">
                  <p>Work</p>
                  <p className="text-base text-gray-800 text-center">
                    {user.work}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="max-w-5xl mt-4 gap-4 flex max-md:flex-col mx-auto rounded-lg ">
          <div className="md:w-[30%] flex flex-col gap-4">
            {user.skills && (
              <InfoContainer title="Skills" content={user.skills} />
            )}
            {user.currentlyLearning && (
              <InfoContainer
                title="Currently Learning"
                content={user.currentlyLearning}
              />
            )}
            {user.availableFor && (
              <InfoContainer
                title="Available for"
                content={user.availableFor}
              />
            )}
            <div className="bg-white flex flex-col shadow-md border-b-0 gap-4 px-4 p-3 border rounded-lg text-gray-600">
              <div className="flex items-center gap-2">
                <Newspaper size={20} />
                <p>
                  {stats.posts} post{stats.posts === 1 ? "" : "s"} published
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Hash size={20} />
                <p>
                  {stats.followingTags} tag
                  {stats.followingTags === 1 ? "" : "s"} followed
                </p>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle size={20} />
                <p>
                  {comments.length} comment{comments.length === 1 ? "" : "s"}{" "}
                  written
                </p>
              </div>
            </div>
          </div>
          <div className="flex-1 md:w-[70%]">
            <div className="bg-white pt-4 rounded-lg shadow-md">
              <p className="text-xl px-4 pb-3 font-semibold text-gray-800">
                Recent Comments
              </p>
              {comments.length > 0 && <p className="border-[0.5px]"></p>}
              {comments.length > 0 ? (
                <div className="flex flex-col">
                  {comments.map((comment: ICommentPopulated, id: number) => (
                    <Link href={`/post/${comment.post._id?.toString()}`}>
                      <div
                        key={comment._id?.toString()!}
                        className="flex flex-col px-3 py-3 gap-1"
                      >
                        <p className="text-gray-700 font-semibold">
                          {comment.post.title}
                        </p>
                        <div className="text-gray-600 flex gap-2 items-center">
                          <p className="line-clamp-1 max-sm:w-[70%]">
                            {comment.content}
                          </p>
                          <p className="text-gray-500 text-sm">
                            {moment(comment.createdAt).fromNow()}
                          </p>
                        </div>
                      </div>
                      {id !== comments.length - 1 && (
                        <p className="border-[0.5px]"></p>
                      )}
                    </Link>
                  ))}
                </div>
              ) : (
                <div>
                  <p className="text-center pb-3 text-gray-600">
                    No comments found
                  </p>
                </div>
              )}
            </div>
            <div>
              <div className=" py-4 rounded-lg">
                <div className="flex flex-col">
                  {posts.map((post: IPostPopulated) => (
                    <>
                      <FeedPost post={post} showBanner={false} />
                    </>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
