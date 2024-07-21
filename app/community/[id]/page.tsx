import CommunityOptions from "@/components/shared/Community/CommunityOptions";
import CommunityPost from "@/components/shared/Community/CommunityPost";
import JoinCommunity from "@/components/shared/Community/JoinCommunity";
import { getCommunity, getCommunityPosts, getPopularCommunityPosts, getTrendingCommunityPosts } from "@/lib/actions/community.actions";
import { getUserObjectId } from "@/lib/actions/user.actions";
import { SearchParamProps } from "@/types";
import { auth } from "@clerk/nextjs";
import { faBell, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import { Dot } from "lucide-react";
import { CommunityPageViewPostOrderBy } from "./ClientComponents";
import { IFeedPost } from "@/types/posts";
import FeedPost from "@/components/shared/Posts/FeedPost";

const Page = async ({ params, searchParams }: SearchParamProps) => {
    const res = await getCommunity(params.id);
    const community = res.community;
    const { userId } = auth();
    const userObjectId = await getUserObjectId(userId!);
    const isMember = community.members
        .map((member: any) => member._id === userObjectId)
        .includes(true);
    let posts: IFeedPost[] = [];
    if (searchParams.orderBy === "trending") {
        posts = (await getTrendingCommunityPosts(params.id)).data;
    }
    else if (searchParams.orderBy === "popular") {
        posts = (await getPopularCommunityPosts(params.id)).data;
    }
    else {
        posts = (await getCommunityPosts(params.id)).data;
    }

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
                    <CommunityPageViewPostOrderBy
                        communityID={community._id?.toString()}
                    />
                    {posts.length === 0 && (
                        <div className="flex items-center justify-center h-40">
                            <p className="text-gray-500">No posts found</p>
                        </div>
                    )}
                    {posts?.slice(0, 1).map((post: any) => (
                        !community.needsReview.includes(post._id) && <FeedPost key={post._id} post={post} showBanner={true} isInCommunity={true} />
                    ))}
                    {posts?.slice(1).map((post: any) => (
                        !community.needsReview.includes(post._id) && <FeedPost key={post._id} post={post} showBanner={false} isInCommunity={true} />
                    ))}
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