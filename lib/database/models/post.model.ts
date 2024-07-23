import mongoose, { Document, models, Schema } from "mongoose";
import { ITag } from "./tag.model";
import { IUser } from "./user.model";

export interface IPost extends Document {
    author: IUser
    title: string;
    coverImage: string;
    content: string;
    tags: mongoose.Schema.Types.ObjectId[];
    community?: mongoose.Schema.Types.ObjectId;
    upvotes: IEngagement[];
    downvotes: IEngagement[];
    comments: mongoose.Schema.Types.ObjectId[];
    views: number;
    createdAt: Date;
    getEngagementScore: () => number;
}

export interface IEngagement extends Document {
    user: mongoose.Schema.Types.ObjectId;
}

const engagementSchema = new Schema<IEngagement>({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

const postSchema: Schema<IPost> = new Schema({
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    coverImage: { type: String },
    content: { type: String, required: true },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag", default: [] }],
    community: { type: mongoose.Schema.Types.ObjectId, ref: "Community" },
    upvotes: [engagementSchema],
    downvotes: [engagementSchema],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    views: { type: Number, default: 0 },
}, {
    timestamps: true
});

const Post = models.Post || mongoose.model<IPost>("Post", postSchema);

export default Post;