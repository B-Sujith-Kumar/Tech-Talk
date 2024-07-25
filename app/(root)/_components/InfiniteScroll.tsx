"use client";

import FeedPost from "@/components/shared/Posts/FeedPost";
import { ICommunity } from "@/lib/database/models/community.model";
import { IFeedPost } from "@/types/posts";
import { useEffect, useState } from "react";
import { Loader2Icon } from "lucide-react";
import { useInView } from "react-intersection-observer";
import { getAllPosts, getPopularPosts, getTrendingPosts } from "@/lib/actions/post.action";

const InfiniteScroll = ({
    posts,
    communitiesData,
    searchParams,
    currentUser
}: {
    posts: IFeedPost[];
    communitiesData: ICommunity[];
    searchParams: any;
    currentUser: any;
}) => {
    const [postsData, setPostsData] = useState<IFeedPost[] | []>(posts);
    const [page, setPage] = useState(1);
    const [ref, inView] = useInView();

    async function fetchMorePosts() {
        let newPosts: IFeedPost[] = [];
        if (searchParams.orderBy === "trending") {
            newPosts = (await getTrendingPosts({
                skip: page * 3
            })).data;
        }
        else if (searchParams.orderBy === "popular") {
            newPosts = (await getPopularPosts({
                skip: page * 3
            })).data;
        }
        else {
            newPosts = (await getAllPosts({
                skip: page * 3
            })).data;
        }
        setPage(page + 1);
        setPostsData([...postsData, ...newPosts]);
    }

    useEffect(() => {
        if (inView) {
            fetchMorePosts();
        }
    }, [inView]);

    return (
        <div className="flex flex-col gap-3">
            {postsData?.length === 0 && (
                <div className="flex items-center justify-center h-40">
                    <p className="text-gray-500">
                        {searchParams.orderBy === "trending" ? "Looks like nothing is trending 😥!!" : searchParams.orderBy === "popular" ? "Looks like nothing is popular 😥!!" : "No posts available 😥!!"}
                    </p>
                </div>
            )}
            {postsData?.slice(0, 1).map((post: any) => (
                <FeedPost
                    key={post._id}
                    post={post}
                    showBanner={true}
                    communitiesData={communitiesData}
                    currentUser={currentUser}
                />
            ))}
            {postsData?.slice(1).map((post: any) => (
                <FeedPost
                    key={post._id}
                    post={post}
                    showBanner={false}
                    communitiesData={communitiesData}
                    currentUser={currentUser}
                />
            ))}
            <Loader2Icon
                ref={ref}
                className="animate-spin mx-auto invisible"
            />
        </div>
    )
}

export default InfiniteScroll