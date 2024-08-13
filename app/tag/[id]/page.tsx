import InfiniteScroll from "@/app/(root)/_components/InfiniteScroll";
import Loading from "@/app/loading";
import DeleteCollection from "@/components/shared/Bookmarks/DeleteCollection";
import UpdateCollection from "@/components/shared/Bookmarks/UpdateCollection";
import FeedPost from "@/components/shared/Posts/FeedPost";
import { getCollection } from "@/lib/actions/collection.actions";
import { getTag } from "@/lib/actions/tag.actions";
import { getCommunitiesJoinedByUser, getUser } from "@/lib/actions/user.actions";
import { IPostPopulated, SearchParamProps } from "@/types";
import { auth } from "@clerk/nextjs/server";
import React, { Suspense } from "react";

const TagPage = async ({ searchParams, params }:
    {
        searchParams: any;
        params: { id: string; name?: string };
    }
) => {
    const tagData = await getTag(params.id);
    const { userId } = auth();
    const currentUser = await getUser(userId);
    const communitiesData = await getCommunitiesJoinedByUser(currentUser);
    return (
        <div>
            <div className="flex items-center justify-between flex-wrap">
                <div>
                    <h1 className={`text-2xl font-semibold 
                        ${tagData.data.length > 0 ? "text-black" : "text-red-500"}
                        `}>
                        {tagData.data.length > 0 ? tagData.data[0]?.name : "Invalid Tag"}
                    </h1>
                </div>
            </div>
            <div id="posts">
                <Suspense fallback={<Loading />}>
                    <InfiniteScroll
                        posts={tagData.data.length > 0 ? tagData.data[0]?.posts : []}
                        communitiesData={communitiesData.status === 200 ? communitiesData.data : []}
                        searchParams={searchParams}
                        currentUser={currentUser}
                        key={Math.random()}
                    />
                </Suspense>
            </div>
        </div>
    );
};

export default TagPage;