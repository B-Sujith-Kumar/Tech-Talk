import { IComment } from "@/lib/database/models/comment.model";
import { ICommunity } from "@/lib/database/models/community.model";
import { IEngagement, IPost } from "@/lib/database/models/post.model";
import { ITag } from "@/lib/database/models/tag.model";
import { IUser } from "@/lib/database/models/user.model";
import mongoose from "mongoose";

export type createUserType = {
  clerkId: string;
  username?: string | null;
  email: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
};

export type updateUserType = {
  clerkId: string;
  username?: string | null;
  firstName: string;
  lastName: string;
  profilePicture: string;
};

export type createCommunityType = {
  name: string;
  description: string;
  createdBy: string;
  tags: string[];
  icon?: string;
  banner?: string;
};

export type SearchParamProps = {
  params: { id: string; name?: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export type IPostPopulated = {
    _id?: mongoose.Schema.Types.ObjectId;
    author: IUser
    title: string;
    coverImage: string;
    content: string;
    tags: ITag[];
    community?: ICommunity;
    upvotes: IEngagement[];
    downvotes: IEngagement[];
    comments: IComment[];
    views: number;
    createdAt: Date;
    notifyUsersOnComment: mongoose.Types.ObjectId[];
    getEngagementScore: () => number;
}

export type ICollectionPopualted = {
    _id?: mongoose.Schema.Types.ObjectId;
    name: string;
    description: string;
    creator: IUser;
    posts: IPostPopulated[];
    createdAt: Date;
}

export type ICommentPopulated = {
    _id?: mongoose.Schema.Types.ObjectId;
    author: IUser;
    content: string;
    post: IPost;
    upvotes: IEngagement[];
    downvotes: IEngagement[];
    replies: ICommentPopulated[];
    createdAt: Date;
}

export type ICommunityPopulated = {
    _id?: mongoose.Schema.Types.ObjectId;
    name: string;
    description: string;
    banner: string;
    icon: string;
    createdBy: IUser;
    tags: ITag[];
    members: IUser[];
    moderators: IUser[];
    needsReview: IPost[];
    reported: IPost[];
    removed: IPost[];
    createdAt: Date;
}

export type invite = ICommunity;