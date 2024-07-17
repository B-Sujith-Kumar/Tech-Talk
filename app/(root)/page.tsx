import { auth } from "@clerk/nextjs";
import { Stories } from "./stories";
import { CreatePost } from "./_components/CreatePost";
import { getCommunitiesJoinedByUser } from "@/lib/actions/user.actions";
import { getAllPosts, getPopularPosts, getTrendingPosts } from "@/lib/actions/post.action";
import FeedPost from "@/components/shared/Posts/FeedPost";
import { HomePageViewPostOrderBy } from "./_components/ClientComponents";
import { SearchParamProps } from "@/types";
import { IFeedPost } from "@/types/posts";
import { Suspense } from "react";
import Loading from "../loading";

export default async function HomePage({ searchParams }: SearchParamProps) {
    const { userId } = auth();
    const { data } = await getCommunitiesJoinedByUser();
    let posts: IFeedPost[] = [];
    if (searchParams.orderBy === "trending") {
        posts = (await getTrendingPosts()).data;
    }
    else if (searchParams.orderBy === "popular") {
        posts = (await getPopularPosts()).data;
    }
    else {
        posts = (await getAllPosts()).data;
    }
    return (
        <>
            {userId && <Stories />}
            {userId && <CreatePost communities={data} />}
            <div className="flex items-center gap-2 text-xs" id="sortBy">
                <div className="border h-0 w-full"></div>
                <div className="flex flex-row text-xs min-w-fit">
                    <HomePageViewPostOrderBy />
                </div>
            </div>
            <div id="posts">
                <Suspense fallback={<Loading />}>
                    <div className="flex flex-col gap-3">
                        {posts?.length === 0 && (
                            <div className="flex items-center justify-center h-40">
                                <p className="text-gray-500">No posts found</p>
                            </div>
                        )}
                        {posts?.slice(0, 1).map((post: any) => (
                            <FeedPost key={post._id} post={post} showBanner={true} />
                        ))}
                        {posts?.slice(1).map((post: any) => (
                            <FeedPost key={post._id} post={post} showBanner={false} />
                        ))}
                    </div>
                </Suspense>
            </div >
        </>
    );
}