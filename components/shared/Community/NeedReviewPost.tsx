import React from "react";
import FeedPost from "../Posts/FeedPost";
import { IPostPopulated } from "@/types";
import { ICommunity } from "@/lib/database/models/community.model";
import ApproveRemovePost from "./ApproveRemovePost";
import { auth } from "@clerk/nextjs/server";
import { getCommunitiesJoinedByUser, getUser } from "@/lib/actions/user.actions";

const NeedReviewPost = async ({
    post,
    community,
}: {
    post: IPostPopulated;
    community: ICommunity;
}) => {
    const { userId } = auth();
    const currentUser = await getUser(userId);
    const communitiesData = await getCommunitiesJoinedByUser(currentUser);
    return (
        <div>
            <FeedPost
                key={post._id?.toString()!}
                post={post}
                showBanner={false}
                isInCommunity={true}
                communitiesData={communitiesData.status === 200 ? communitiesData.data : []}
                currentUser={currentUser}
            />
            <ApproveRemovePost post={post} community={community} />
        </div>
    );
};

export default NeedReviewPost;