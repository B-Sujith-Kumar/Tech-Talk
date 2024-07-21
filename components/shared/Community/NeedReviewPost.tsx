import React from "react";
import FeedPost from "../Posts/FeedPost";
import { IPostPopulated } from "@/types";
import { ICommunity } from "@/lib/database/models/community.model";
import ApproveRemovePost from "./ApproveRemovePost";

const NeedReviewPost = ({
  post,
  community,
}: {
  post: IPostPopulated;
  community: ICommunity;
}) => {
  return (
    <div>
      <FeedPost
        key={post._id?.toString()!}
        post={post}
        showBanner={false}
        isInCommunity={true}
      />
      <ApproveRemovePost post={post} community={community} />
    </div>
  );
};

export default NeedReviewPost;
