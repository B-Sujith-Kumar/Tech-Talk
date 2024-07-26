import { auth } from "@clerk/nextjs/server";
import { Stories } from "./stories";
import { CreatePost } from "./_components/CreatePost";
import { getCommunitiesJoinedByUser, getUser } from "@/lib/actions/user.actions";
import { getAllPosts, getPopularPosts, getTrendingPosts } from "@/lib/actions/post.action";
import FeedPost from "@/components/shared/Posts/FeedPost";
import { HomePageViewPostOrderBy } from "./_components/ClientComponents";
import { SearchParamProps } from "@/types";
import { IFeedPost } from "@/types/posts";
import { Suspense } from "react";
import Loading from "../loading";
import InfiniteScroll from "./_components/InfiniteScroll";

export default async function HomePage({ searchParams }: SearchParamProps) {
    const { userId } = auth();
    const currentUser = await getUser(userId);
    const communitiesData = await getCommunitiesJoinedByUser(currentUser);
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
            {userId && <CreatePost communities={communitiesData.status === 200 ? communitiesData.data : []} />}
            <div className="flex items-center gap-2 text-xs" id="sortBy">
                <div className="border h-0 w-full"></div>
                <div className="flex flex-row text-xs min-w-fit">
                    <HomePageViewPostOrderBy />
                </div>
            </div>
            <div id="posts">
                <InfiniteScroll
                    posts={posts}
                    communitiesData={communitiesData.status === 200 ? communitiesData.data : []}
                    searchParams={searchParams}
                    currentUser={currentUser}
                    key={Math.random()}
                />
                {/* <Suspense fallback={<Loading />}>
                </Suspense> */}
            </div>
        </>
    );
}