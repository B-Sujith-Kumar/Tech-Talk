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
    comments: mongoose.Schema.Types.ObjectId[];
    views: number;
    createdAt: Date;
    getEngagementScore: () => number;
}