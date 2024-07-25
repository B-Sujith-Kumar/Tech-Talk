import DeleteCollection from "@/components/shared/Bookmarks/DeleteCollection";
import UpdateCollection from "@/components/shared/Bookmarks/UpdateCollection";
import FeedPost from "@/components/shared/Posts/FeedPost";
import { getCollection } from "@/lib/actions/collection.actions";
import { getCommunitiesJoinedByUser, getUser } from "@/lib/actions/user.actions";
import { IPostPopulated, SearchParamProps } from "@/types";
import { auth } from "@clerk/nextjs/server";
import React from "react";

const CollectionPage = async ({ params: { id } }: SearchParamProps) => {
    const collection = await getCollection(id);
    const { userId } = auth();
    const currentUser = await getUser(userId);
    const communitiesData = await getCommunitiesJoinedByUser(currentUser);
    return (
        <div>
            <div className="flex items-center justify-between flex-wrap">
                <div>
                    <h1 className="text-2xl font-semibold">
                        {collection.name} collection
                    </h1>
                    <p className="mt-1 text-gray-600 mb-4">{collection.description}</p>
                </div>
                <div className="flex gap-2">
                    <UpdateCollection collection={collection} />
                    <DeleteCollection collectionId={id} />
                </div>
            </div>
            {collection.posts.map((post: IPostPopulated, id: number) => (
                <div className="mt-4">
                    <FeedPost
                        post={post}
                        showBanner={false}
                        isInCommunity={true}
                        key={id}
                        communitiesData={communitiesData.status === 200 ? communitiesData.data : []}
                        currentUser={currentUser}
                    />
                </div>
            ))}
        </div>
    );
};

export default CollectionPage;
