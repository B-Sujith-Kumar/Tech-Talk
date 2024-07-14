import CommunityPost from "@/components/shared/Community/CommunityPost";
import FeedPost from "@/components/shared/Posts/FeedPost";
import { getCollection } from "@/lib/actions/collection.actions";
import { IPostPopulated, SearchParamProps } from "@/types";
import React from "react";

const CollectionPage = async ({ params: { id } }: SearchParamProps) => {
  const collection = await getCollection(id);
  return (
    <div>
      <h1 className="text-2xl font-semibold">{collection.name} collection</h1>
      <p className="mt-1 text-gray-600 mb-4">{collection.description}</p>
      {
        collection.posts.map((post: IPostPopulated, id: number) => (
            <CommunityPost post={post} key={id} />
        ))
      }
    </div>
  );
};

export default CollectionPage;
