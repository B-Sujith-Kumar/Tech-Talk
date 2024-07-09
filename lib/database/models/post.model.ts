import mongoose, { Document, models, Schema } from "mongoose";

interface IPost extends Document {
    author: mongoose.Schema.Types.ObjectId;
    title: string;
    content: string;
    tags: string[];
    community?: mongoose.Schema.Types.ObjectId;
    upvotes: IEngagement[];
    downvotes: IEngagement[];
    comments: mongoose.Schema.Types.ObjectId[];
    views: number;
    createdAt: Date;
    getEngagementScore: () => number;
}

interface IEngagement extends Document {
    user: mongoose.Schema.Types.ObjectId;
    createdAt: Date;
}

const engagementSchema = new Schema<IEngagement>({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    createdAt: { type: Date, default: Date.now }
});

const postSchema: Schema<IPost> = new Schema({
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
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

// Static method to find trending posts based on engagement within the last 24 hours
postSchema.statics.findTrendingPosts = async function () {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    return this.aggregate([
        {
            $addFields: {
                recentUpvotes: {
                    $filter: {
                        input: "$upvotes",
                        as: "upvote",
                        cond: { $gte: ["$$upvote.createdAt", yesterday] }
                    }
                },
                recentDownvotes: {
                    $filter: {
                        input: "$downvotes",
                        as: "downvote",
                        cond: { $gte: ["$$downvote.createdAt", yesterday] }
                    }
                },
                recentComments: {
                    $filter: {
                        input: "$comments",
                        as: "comment",
                        cond: { $gte: ["$$comment.createdAt", yesterday] }
                    }
                }
            }
        },
        {
            $addFields: {
                engagementScore: {
                    $subtract: [
                        { $add: [{ $size: "$recentUpvotes" }, { $size: "$recentComments" }] },
                        { $size: "$recentDownvotes" }
                    ]
                }
            }
        },
        { $sort: { engagementScore: -1 } },
        { $limit: 10 }
    ]);
};

const Post = models.Post || mongoose.model<IPost>("Post", postSchema);

export default Post;