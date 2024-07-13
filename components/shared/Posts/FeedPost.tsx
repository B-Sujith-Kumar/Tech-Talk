import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { BookmarkIcon, EllipsisVerticalIcon, MessageCircleIcon, Share2Icon } from "lucide-react";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import RenderPost from "../Community/RenderPost";
import { IPostPopulated } from "@/types";
import { badgeVariants } from "@/components/ui/badge";
import moment from "moment";
import { VotesButtons } from "./ClientComponents";

const FeedPost = ({
    post,
    showBanner,
}: {
    post: IPostPopulated;
    showBanner: boolean;
}) => {
    return (
        <div>
            <div className="bg-white rounded-xl p-4">
                <div className="flex flex-row gap-2 items-center">
                    <Avatar>
                        <AvatarImage
                            src={post.author.profilePicture}
                            alt={post.author.username}
                            className="h-10 w-10 rounded-full"
                        />
                        <AvatarFallback>S K</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium flex flex-row gap-1 items-center">
                            <Link href={`/user/${post.author._id}`}>
                                {post.author.firstName + " " + post.author.lastName}{" "}{" "}
                            </Link>
                            {post.community && <>in</>}
                            {post.community && (
                                <Link
                                    className={
                                        badgeVariants({ variant: "outline" }) +
                                        " flex flex-row gap-1 hover:bg-indigo-500 hover:text-white"
                                    }
                                    href={`/community/${post.community._id}`}
                                >
                                    <Image
                                        src={post.community.icon || ""}
                                        width={20}
                                        height={20}
                                        alt={post.community.name}
                                        className="rounded-full"
                                    />
                                    {post.community.name}
                                </Link>
                            )}
                        </span>
                        <span className="text-xs text-gray-500">
                            {moment(post.createdAt).fromNow()}
                        </span>
                    </div>
                    <EllipsisVerticalIcon className="w-5 h-5 text-gray-500 ml-auto cursor-pointer" />
                </div>
                {showBanner && <Image
                    src={post.coverImage}
                    width={500}
                    height={300}
                    alt="Next.js"
                    className="w-full h-60 rounded-md my-3"
                />}
                <div className="mt-2 p-1">
                    <div className="flex my-2 gap-x-2">
                        {post.tags.map((tag) => (
                            <Link
                                key={tag?._id?.toString()}
                                className="bg-indigo-500 text-white px-2 py-1 text-xs font-medium rounded-full"
                                href={`/tag/${tag._id?.toString()}/`}
                            >
                                {tag.name}
                            </Link>
                        ))}
                    </div>
                    <Link
                        className="text-2xl font-semibold max-sm:text line-clamp-2"
                        href={`/post/${post._id?.toString()}`}
                    >
                        {post.title}
                    </Link>
                    <div className="line-clamp-2 text-sm leading-relaxed mt-3 text-gray-500">
                        <RenderPost content={post.content} />
                    </div>
                </div>
                <hr className="mt-2 border-gray-200" />
                <div className="flex flex-row gap-6 mt-2 p-2 *:flex *:flex-row *:gap-2 *:items-center">
                    <div>
                        <VotesButtons post={post} />
                    </div>
                    <div>
                        <MessageCircleIcon className="w-4 h-4 " />
                        <span className="text-xs sm:hidden font-medium">
                            {post.comments.length}
                        </span>
                        <span className="text-xs max-sm:hidden font-medium">
                            {post.comments.length} Comments
                        </span>
                    </div>
                    <div>
                        <Share2Icon className="w-4 h-4 " />
                        <span className="text-xs max-sm:hidden font-medium">Share</span>
                    </div>
                    <div className="ml-auto">
                        <BookmarkIcon className="w-4 h-4 " />
                        <span className="text-xs max-sm:hidden font-medium">Save</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeedPost;