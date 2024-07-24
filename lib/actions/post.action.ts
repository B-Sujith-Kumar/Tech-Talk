"use server";

import { currentUser } from "@clerk/nextjs";
import { isAuth } from "../auth";
import Post, { IPost } from "../database/models/post.model";
import Tag, { ITag } from "../database/models/tag.model";
import mongoose from "mongoose";
import { connectToDatabase } from "../database";
import Comment, { IComment } from "../database/models/comment.model";
import { revalidatePath } from "next/cache";
import { IFeedPost } from "@/types/posts";
import User, { IUser } from "../database/models/user.model";
import Community from "../database/models/community.model";
import { Knock } from "@knocklabs/node";

export async function createPost(data: {
    title: string;
    content: string;
    tags?: string[];
    community?: mongoose.Schema.Types.ObjectId | string;
    coverImage?: string;
    userCurrent: IUser;
}) {
    try {
        let auth = isAuth();
        if (!auth)
            return {
                status: 401,
                message: "Unauthorized",
            };
        const user = await currentUser();
        await connectToDatabase();
        let post: IPost;
        if (
            data.community === "public" ||
            !data.community ||
            data.community === ""
        ) {
            post = await Post.create({
                author: data.userCurrent._id,
                title: data.title,
                content: data.content,
                coverImage: data.coverImage,
            });
        } else {
            post = await Post.create({
                author: data.userCurrent._id,
                title: data.title,
                content: data.content,
                community: data.community as mongoose.Schema.Types.ObjectId,
                coverImage: data.coverImage,
            });
            const community = await Community.findById(data.community);
            await community.needsReview.push(post._id);
            await community.save();
            await Promise.all(
                data.tags?.forEach(async (tag) => {
                    let existingTag: ITag | null = await Tag.findOne({ name: tag });
                    if (!existingTag) {
                        let newTag: ITag = await Tag.create({
                            name: tag,
                            posts: [post._id],
                        });
                        await Post.updateOne(
                            { _id: post._id },
                            { $push: { tags: newTag._id } }
                        );
                    } else {
                        existingTag?.posts?.push(
                            post._id as mongoose.Schema.Types.ObjectId
                        );
                        await Post.updateOne(
                            { _id: post._id },
                            { $push: { tags: existingTag._id } }
                        );
                        await existingTag.save();
                    }
                }) ?? []
            );
            await post.save();
            return { status: 200, message: "Post has been sent for review" };
        }
        await Promise.all(
            data.tags?.forEach(async (tag) => {
                let existingTag: ITag | null = await Tag.findOne({ name: tag });
                if (!existingTag) {
                    let newTag: ITag = await Tag.create({
                        name: tag,
                        posts: [post._id],
                    });
                    await Post.updateOne(
                        { _id: post._id },
                        { $push: { tags: newTag._id } }
                    );
                } else {
                    existingTag?.posts?.push(post._id as mongoose.Schema.Types.ObjectId);
                    await Post.updateOne(
                        { _id: post._id },
                        { $push: { tags: existingTag._id } }
                    );
                    await existingTag.save();
                }
            }) ?? []
        );
        await post.save();
        return { status: 200, message: "Post created successfully" };
    } catch (error: any) {
        return { status: 500, message: error.message };
    }
}

export async function editPost(data: {
    postID: mongoose.Schema.Types.ObjectId;
    title: string;
    content: string;
    tags?: string[];
    community?: mongoose.Schema.Types.ObjectId | string;
    coverImage?: string;
}) {
    try {
        let auth = isAuth();
        if (!auth) return { status: 401, message: "Unauthorized" };
        const user = await currentUser();
        await connectToDatabase();
        let post: IPost = (await Post.findById(data.postID)) as IPost;
        if (!post) return { status: 404, message: "Post not found" };
        const loggedInUser: IUser = (await User.findOne({
            clerkId: user?.id,
        })) as IUser;
        if (post.author.toString() !== loggedInUser?._id?.toString())
            return { status: 401, message: "Unauthorized" };
        post.title = data.title;
        post.content = data.content;
        post.coverImage = data.coverImage ?? post.coverImage;
        if (
            !(data.community === "public" || !data.community || data.community === "")
        ) {
            post.community = data.community as mongoose.Schema.Types.ObjectId;
        } else {
            await post.updateOne({ $unset: { community: 1 } });
        }
        await Promise.all(
            post?.tags?.map(async (tag) => {
                await Tag.updateOne({ _id: tag }, { $pull: { posts: post._id } });
            })
        );
        post.tags = [];
        await Promise.all(
            data.tags?.forEach(async (tag) => {
                let existingTag: ITag | null = await Tag.findOne({ name: tag });
                if (!existingTag) {
                    let newTag: ITag = await Tag.create({
                        name: tag,
                        posts: [post._id],
                    });
                    await Post.updateOne(
                        { _id: post._id },
                        { $push: { tags: newTag._id } }
                    );
                } else {
                    existingTag?.posts?.push(post._id as mongoose.Schema.Types.ObjectId);
                    await Post.updateOne(
                        { _id: post._id },
                        { $push: { tags: existingTag._id } }
                    );
                    await existingTag.save();
                }
            }) ?? []
        );
        await post.save();
        revalidatePath(`/post/${data.postID}`);
        return { status: 200, message: "Post updated successfully" };
    } catch (error: any) {
        return { status: 500, message: error.message };
    }
}

export async function deletePost(postID: mongoose.Schema.Types.ObjectId) {
    try {
        let auth = isAuth();
        if (!auth) return { status: 401, message: "Unauthorized" };
        const user = await currentUser();
        await connectToDatabase();
        let post: IPost = (await Post.findById(postID)) as IPost;
        if (!post) return { status: 404, message: "Post not found" };
        const loggedInUser: IUser = (await User.findOne({
            clerkId: user?.id,
        })) as IUser;
        if (post.author.toString() !== loggedInUser?._id?.toString())
            return { status: 401, message: "Unauthorized" };

        await Promise.all(
            post.tags.map(async (tag) => {
                await Tag.updateOne({ _id: tag }, { $pull: { posts: post._id } });
            })
        );
        await Promise.all(
            post.comments.map(async (comment) => {
                let commentReplies: IComment = (await Comment.findById(
                    comment
                )) as IComment;
                commentReplies.replies &&
                    (await Promise.all(
                        commentReplies.replies.map(async (reply) => {
                            await Comment.deleteOne({ _id: reply });
                        })
                    ));
                await Comment.deleteOne({ _id: comment });
            })
        );
        revalidatePath(`/community/${post.community}`);
        await post.deleteOne({ _id: postID });
        revalidatePath("/");
        revalidatePath(`/post/${postID}`);
        return { status: 200, message: "Post deleted successfully" };
    } catch (error: any) {
        return { status: 500, message: error.message };
    }
}

// export async function getAllPosts(options?: {
//   limit?: number;
//   skip?: number;
//   sort?: string;
//   order?: string;
// }) {
//   try {
//     await connectToDatabase();
//     let posts: IFeedPost[] = await Post.find()
//       .populate("tags")
//       .populate("author")
//       .populate("community")
//       .limit(options?.limit ?? 10)
//       .skip(options?.skip ?? 0)
//       .sort({
//         createdAt: -1,
//       });
//     return { status: 200, data: JSON.parse(JSON.stringify(posts)) };
//   } catch (error: any) {
//     return { status: 500, message: error.message };
//   }
// }

export async function getAllPosts(options?: {
    limit?: number;
    skip?: number;
    sort?: string;
    order?: string;
}) {
    try {
        await connectToDatabase();

        const communities = await Community.find();
        let needReviewPostIds: any = [];
        communities.forEach((community) => {
            for (let i = 0; i < community.needsReview.length; i++) {
                needReviewPostIds.push(community.needsReview[i]);
            }
        });

        needReviewPostIds = needReviewPostIds.map(
            (id: any) => new mongoose.Types.ObjectId(id)
        );

        let posts: IFeedPost[] = await Post.find({
            _id: { $nin: needReviewPostIds },
        })
            .populate("tags")
            .populate("author")
            .populate("community")
            .limit(options?.limit ?? 10)
            .skip(options?.skip ?? 0)
            .sort({
                createdAt: -1,
            });

        return { status: 200, data: JSON.parse(JSON.stringify(posts)) };
    } catch (error: any) {
        return { status: 500, message: error.message };
    }
}

export async function getTrendingPosts() {
    try {
        await connectToDatabase();
        let data: IFeedPost[] = await Post.aggregate([
            {
                $match: {
                    $or: [
                        {
                            "upvotes.createdAt": {
                                $gte: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
                            },
                        },
                        {
                            "downvotes.createdAt": {
                                $gte: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
                            },
                        },
                        {
                            "comments.createdAt": {
                                $gte: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
                            },
                        },
                    ],
                },
            },
            {
                $lookup: {
                    from: "tags",
                    as: "tags",
                    localField: "tags",
                    foreignField: "_id",
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                name: 1,
                            },
                        },
                    ],
                },
            },
            {
                $lookup: {
                    from: "communities",
                    as: "community",
                    localField: "community",
                    foreignField: "_id",
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                name: 1,
                                icon: 1,
                            },
                        },
                    ],
                },
            },
            {
                $addFields: {
                    community: {
                        $arrayElemAt: ["$community", 0],
                    },
                },
            },
            {
                $addFields: {
                    engagementScore: {
                        $subtract: [
                            {
                                $add: [{ $size: "$upvotes" }, { $size: "$comments" }, "$views"],
                            },
                            { $size: "$downvotes" },
                        ],
                    },
                },
            },
            {
                $sort: {
                    engagementScore: -1,
                },
            },
            {
                $limit: 10,
            },
            {
                $lookup: {
                    from: "users",
                    localField: "author",
                    foreignField: "_id",
                    as: "author",
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                name: 1,
                                firstName: 1,
                                lastName: 1,
                                profilePicture: 1,
                            },
                        },
                    ],
                },
            },
            {
                $addFields: {
                    author: {
                        $arrayElemAt: ["$author", 0],
                    },
                },
            },
        ]);
        return { status: 200, data: JSON.parse(JSON.stringify(data)) };
    } catch (error: any) {
        return { status: 500, message: error.message };
    }
}

export async function getPopularPosts() {
    try {
        await connectToDatabase();
        let data: IFeedPost[] = await Post.aggregate([
            {
                $lookup: {
                    from: "tags",
                    as: "tags",
                    localField: "tags",
                    foreignField: "_id",
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                name: 1,
                            },
                        },
                    ],
                },
            },
            {
                $lookup: {
                    from: "communities",
                    as: "community",
                    localField: "community",
                    foreignField: "_id",
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                name: 1,
                                icon: 1,
                            },
                        },
                    ],
                },
            },
            {
                $addFields: {
                    community: {
                        $arrayElemAt: ["$community", 0],
                    },
                },
            },
            {
                $addFields: {
                    popularityScore: {
                        $subtract: [
                            {
                                $add: [{ $size: "$upvotes" }, { $size: "$comments" }, "$views"],
                            },
                            { $size: "$downvotes" },
                        ],
                    },
                },
            },
            {
                $sort: {
                    popularityScore: -1,
                },
            },
            {
                $limit: 10,
            },
            {
                $lookup: {
                    from: "users",
                    localField: "author",
                    foreignField: "_id",
                    as: "author",
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                name: 1,
                                firstName: 1,
                                lastName: 1,
                                profilePicture: 1,
                            },
                        },
                    ],
                },
            },
            {
                $addFields: {
                    author: {
                        $arrayElemAt: ["$author", 0],
                    },
                },
            },
        ]);
        const communities = await Community.find();
        let needReviewPostIds: any = [];
        communities.forEach((community) => {
            for (let i = 0; i < community.needsReview.length; i++) {
                needReviewPostIds.push(community.needsReview[i].toString());
            }
        });

        data = data.filter(
            (post: any) => !needReviewPostIds.includes(post._id.toString())
        );
        return { status: 200, data: JSON.parse(JSON.stringify(data)) };
    } catch (error: any) {
        return { status: 500, message: error.message };
    }
}

export async function getPostById(postID: mongoose.Schema.Types.ObjectId) {
    try {
        await connectToDatabase();
        let post = await Post.findById(postID)
            .populate("tags")
            .populate("author")
            .populate("community")
            .populate({
                path: "comments",
                populate: [
                    {
                        path: "author",
                        model: "User",
                    },
                    {
                        path: "replies",
                        populate: {
                            path: "author",
                            model: "User",
                        },
                    },
                ],
            });
        return JSON.parse(JSON.stringify({ status: 200, data: post }));
    } catch (error: any) {
        return { status: 500, message: error.message };
    }
}

export const addComment = async (
    postID: mongoose.Schema.Types.ObjectId,
    content: string,
    userID: string
) => {
    try {
        await connectToDatabase();
        const knock = new Knock(process.env.KNOCK_API_SECRET);
        let post = await Post.findById(postID);
        if (!post)
            return JSON.parse(
                JSON.stringify({ status: 404, message: "Post not found" })
            );
        let comment = await Comment.create({
            author: userID,
            post: postID,
            content: content,
        });
        let newComment = await Comment.findOne({ _id: comment._id }).populate(
            "author"
        );
        const postAuthor: IUser = (await User.findById(post.author)) as IUser;
        post.comments.push(comment._id);
        await knock.workflows
            .trigger("tech-talk", {
                data: {
                    post: postID,
                    comment: comment._id,
                    name: postAuthor.firstName + " " + postAuthor.lastName,
                    title: post.title,
                    commentAuthor:
                        newComment.author.firstName + " " + newComment.author.lastName,
                },
                recipients: [
                    {
                        id: postAuthor.clerkId,
                        name: postAuthor?.firstName + " " + postAuthor?.lastName,
                        email: postAuthor?.email,
                    },
                ],
            })
            .catch((error) => console.log(error));
        await post.save();
        revalidatePath(`/post/${postID.toString()}`);
        return JSON.parse(JSON.stringify({ status: 200, comment: newComment }));
    } catch (error: any) {
        return JSON.parse(JSON.stringify({ status: 500, message: error.message }));
    }
};

export const upVoteComment = async (
    commentId: mongoose.Schema.Types.ObjectId | unknown,
    userID: string,
    postId: string | undefined
) => {
    try {
        await connectToDatabase();
        let comment = await Comment.findById(commentId);
        if (!comment)
            return JSON.parse(
                JSON.stringify({ status: 404, message: "Comment not found" })
            );
        if (comment.upvotes.includes(userID)) {
            comment.upvotes = comment.upvotes.filter(
                (id: any) => id.toString() !== userID.toString()
            );
        } else {
            comment.upvotes.push(userID);
            comment.downvotes = comment.downvotes.filter(
                (id: any) => id.toString() !== userID.toString()
            );
        }
        await comment.save();
        revalidatePath(
            `/post/${comment.post === null ? postId : comment.post.toString()}`
        );
        return JSON.parse(
            JSON.stringify({
                status: 200,
                message: "Success",
                responseComment: comment,
            })
        );
    } catch (error: any) {
        return JSON.parse(JSON.stringify({ status: 500, message: error.message }));
    }
};

export const downVoteComment = async (
    commentId: mongoose.Schema.Types.ObjectId | unknown,
    userID: string,
    postId: string | undefined
) => {
    try {
        await connectToDatabase();
        let comment = await Comment.findById(commentId);
        if (!comment)
            return JSON.parse(
                JSON.stringify({ status: 404, message: "Comment not found" })
            );
        if (comment.downvotes.includes(userID)) {
            comment.downvotes = comment.downvotes.filter(
                (id: any) => id.toString() !== userID.toString()
            );
        } else {
            comment.downvotes.push(userID);
            comment.upvotes = comment.upvotes.filter(
                (id: any) => id.toString() !== userID.toString()
            );
        }
        await comment.save();
        revalidatePath(
            `/post/${comment.post === null ? postId : comment.post.toString()}`
        );
        return JSON.parse(
            JSON.stringify({
                status: 200,
                message: "Success",
                responseComment: comment,
            })
        );
    } catch (error: any) {
        return JSON.parse(JSON.stringify({ status: 500, message: error.message }));
    }
};

export const addReply = async (
    commentId: string,
    content: string,
    userID: string
) => {
    try {
        await connectToDatabase();
        let comment = await Comment.findById(commentId);
        if (!comment)
            return JSON.parse(
                JSON.stringify({ status: 404, message: "Comment not found" })
            );
        let reply = await Comment.create({
            author: userID,
            content: content,
            post: null,
        });
        let replyComment = await Comment.findOne({ _id: reply._id }).populate(
            "author"
        );
        comment.replies.push(reply._id);
        await comment.save();
        revalidatePath(`/post/${comment.post.toString()}`);
        return JSON.parse(
            JSON.stringify({ status: 200, replyComment: replyComment })
        );
    } catch (error: any) {
        console.log(error);
        return JSON.parse(JSON.stringify({ status: 500, message: error.message }));
    }
};

export const editComment = async (
    commentId: string | unknown,
    content: string,
    postId: string
) => {
    try {
        await connectToDatabase();
        let comment = await Comment.findById(commentId);
        if (!comment)
            return JSON.parse(
                JSON.stringify({ status: 404, message: "Comment not found" })
            );
        comment.content = content;
        await comment.save();
        revalidatePath(`/post/${postId}`);
        return JSON.parse(JSON.stringify({ status: 200, message: "Success" }));
    } catch (error: any) {
        return JSON.parse(JSON.stringify({ status: 500, message: error.message }));
    }
};

export const deleteComment = async (
    commentId: string | unknown,
    postId: string
) => {
    try {
        await connectToDatabase();
        let comment = await Comment.findById(commentId);
        if (!comment)
            return JSON.parse(
                JSON.stringify({ status: 404, message: "Comment not found" })
            );
        for (let reply of comment.replies) {
            await Comment.deleteOne({ _id: reply });
        }
        await Comment.deleteOne({ _id: commentId });
        revalidatePath(`/post/${postId}`);
        return JSON.parse(JSON.stringify({ status: 200, message: "Success" }));
    } catch (error: any) {
        return JSON.parse(JSON.stringify({ status: 500, message: error.message }));
    }
};

export async function updateView(postID: mongoose.Schema.Types.ObjectId) {
    try {
        await connectToDatabase();
        let post = await Post.findById(postID);
        if (!post) return { status: 404, message: "Post not found" };
        post.views = post.views + 1;
        await post.save();
        revalidatePath(`/post/${postID}`);
        revalidatePath(`/community/${post.community}`);
        revalidatePath("/");
        return { status: 200, message: "Success" };
    } catch (error: any) {
        return { status: 500, message: error.message };
    }
}

export const getPosts = async (userId: string) => {
    try {
        await connectToDatabase();
        let posts = await Post.find({ author: userId })
            .populate("tags")
            .populate("community")
            .populate("author");
        return JSON.parse(JSON.stringify(posts));
    } catch (error: any) {
        return { status: 500, message: error.message };
    }
};
