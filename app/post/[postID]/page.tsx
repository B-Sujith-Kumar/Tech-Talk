import TextBox from "@/components/shared/TextBox/TextBox";
import { getPostById } from "@/lib/actions/post.action";
import mongoose from "mongoose";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { badgeVariants } from "@/components/ui/badge";
import Link from "next/link";
import moment from "moment";
import { auth } from "@clerk/nextjs";
import {
  getCommunitiesJoinedByUser,
  getUser,
  getUserObjectId,
} from "@/lib/actions/user.actions";
import { Button } from "@/components/ui/button";
import { FollowButton, NoAuthFollowButton } from "./PostButton";
import { ITag } from "@/lib/database/models/tag.model";
import { VotesButtons } from "@/components/shared/Posts/ClientComponents";
import { BookmarkIcon, MessageCircleIcon } from "lucide-react";
import Comments from "@/components/shared/Posts/Comments";
import BookmarkPost from "@/components/shared/Bookmarks/BookmarkPost";
import { getCollections } from "@/lib/actions/collection.actions";
import { PostActions } from "@/components/shared/Posts/PostActions";
import ViewCounter from "@/components/shared/ViewCounter";

export default async function PostPage({
  params,
  searchParams,
}: {
  params: { postID: mongoose.Schema.Types.ObjectId };
  searchParams: { orderBy: string };
}) {
  const { data, status } = await getPostById(params.postID);
  if (status !== 200) notFound();
  let isCurrentUser: boolean | undefined = undefined;
  const { userId } = auth();
  let isFollowing = false;
  let userObjectId: string | undefined;
  let collectionList;
  let currentUser = null;
  if (userId) {
    currentUser = await getUser(userId);
    userObjectId = await getUserObjectId(userId!);
    collectionList = await getCollections(userObjectId!);
    isCurrentUser = userObjectId === data.author._id.toString();
    isFollowing =
      data.author.followers && data.author.followers.includes(userObjectId!);
  }
  const post = data;

  const { data: communities } = await getCommunitiesJoinedByUser(currentUser);

  return (
    <div className="flex max-lg:flex-col px-10 max-lg:px-3 gap-4 pt-3 justify-between">
      <div className="bg-white  rounded-xl w-[73%] max-lg:w-full overflow-y-scroll scrollbar-hidden pb-10 shadow-lg flex-shrink">
        <div
          style={{
            backgroundImage: `url(${data?.coverImage as string})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          className="relative bg-contain rounded-t-xl bg-no-repeat h-96 max-sm:h-48 w-full"
        />
        <div className="px-10 max-lg:px-2 mt-4">
          <div className="px-2 flex flex-row gap-2 items-center">
            <Avatar>
              <AvatarImage
                src={data.author.profilePicture}
                alt={data.author.firstName + " " + data.author.lastName}
                className=""
              />
              <AvatarFallback>
                {data.author.firstName[0] + data.author.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium flex flex-row items-center">
                <Link
                  href={`/user/${data.author.username}`}
                  className="flex items-center"
                >
                  {data.author.firstName + " " + data.author.lastName}
                  <span className="text-xs text-gray-500">
                    &nbsp;@{data.author.username} &nbsp;
                  </span>
                </Link>
                <span className="text-xs flex flex-row items-center gap-2">
                  {data.community && <>in</>}
                  {data.community && (
                    <Link
                      className={
                        badgeVariants({ variant: "outline" }) +
                        " flex flex-row gap-1 hover:bg-indigo-500 hover:text-white"
                      }
                      href={`/community/${data.community._id}`}
                    >
                      <Image
                        src={data.community.icon}
                        width={20}
                        height={20}
                        alt={data.community.name}
                        className="rounded-full"
                      />
                      {data.community.name}
                    </Link>
                  )}
                </span>
              </span>
              <span className="text-xs text-gray-500">
                Posted {moment(data.createdAt).fromNow()}
              </span>
            </div>
          </div>
          <div className="flex max-sm:flex-col max-sm:gap-y-2 sm:items-center mt-4 justify-between">
            <div className="flex gap-x-2 px-2">
              {data.tags.map((tag: ITag) => (
                <Link
                  key={tag?._id?.toString()}
                  className="bg-indigo-500 text-white px-2 py-1 text-xs font-medium rounded-full"
                  href={`/tag/${tag._id?.toString()}/`}
                >
                  {tag.name}
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-2 px-3">
              <VotesButtons post={post} userObjectId={userObjectId as string} />
              <ViewCounter post={post} />
              <Link href="#comments" className="flex gap-2 items-center">
                <MessageCircleIcon className="w-4 h-4 " />
                <span className="text-xs sm:hidden font-medium">
                  {post.comments.length}
                </span>
                <span className="text-xs max-sm:hidden font-medium">
                  {post.comments.length} Comments
                </span>
              </Link>
              <BookmarkPost
                collectionList={collectionList}
                postId={post._id}
                userId={userObjectId?.toString()!}
              />
              <div className="max-sm:ml-auto w-fit">
                {userId && (
                  <PostActions post={post} communities={communities} />
                )}
              </div>
            </div>
          </div>
          <h1 className="font-bold px-2 my-4 text-4xl font-sans max-sm:text-2xl leading-[45px]">
            {data?.title}
          </h1>

          <TextBox description={data?.content as string} editable={false} />
          <hr className="mt-8 text-gray-800" id="comments" />
          <Comments
            post={post}
            currentUser={currentUser}
            searchParams={searchParams}
          />
        </div>
      </div>
      <div className="flex-1 bg-white shadow-xl rounded-xl h-fit pb-4 flex-shrink-0">
        <div className="bg-gray-800 h-9 rounded-t-xl"></div>
        <Link
          href={`/user/${data.author.username}`}
          className="flex px-4 gap-2 items-end relative bottom-3"
        >
          <Image
            src={data.author.profilePicture}
            width={50}
            height={50}
            alt={data.author.firstName[0] + " " + data.author.lastName[0]}
            className="rounded-full aspect-square relative bg-white border"
          />
          <p className="font-medium text-gray-800 text-lg">
            {data.author.firstName + " " + data.author.lastName}
          </p>
        </Link>
        <div className="px-4 mt-2 flex gap-6">
          <div className="flex gap-2 text-gray-700 text-[15px] items-center">
            <p className="font-medium">{data.author.followers.length}</p>{" "}
            Followers
          </div>
          <div className="flex gap-2 text-gray-700 text-[15px] items-center">
            <p className="font-medium">{data.author.following.length}</p>{" "}
            Following
          </div>
        </div>
        <div className="mt-3 px-4">
          {isCurrentUser !== true && isCurrentUser !== undefined && (
            <FollowButton
              isFollowing={isFollowing}
              postOwnerId={data.author._id.toString()}
              currentUserId={currentUser._id.toString()}
            />
          )}
          {!userId && <NoAuthFollowButton />}
        </div>
        <p className="px-4 mt-4 text-[15px] text-gray-600">{data.author.bio}</p>
        {data.author.location && (
          <>
            <p className="px-4 mt-4 text-[15px] text-gray-500 font-semibold">
              LOCATION
            </p>
            <p className="px-4 mt-1 text-[15px] text-gray-700">
              {data.author.location}
            </p>
          </>
        )}
        <p className="px-4 mt-2 text-[15px] text-gray-500 font-semibold">
          JOINED
        </p>
        <p className="px-4 mt-1 text-[15px] text-gray-700">
          {moment(data.author.createdAt).format("MMMM Do YYYY")}
        </p>
      </div>
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: { postID: mongoose.Schema.Types.ObjectId };
}) {
  const { data } = await getPostById(params.postID);
  return {
    title: data?.title,
  };
}
