"use server";

import { currentUser } from "@clerk/nextjs";
import { isAuth } from "../auth";
import Post, { IPost } from "../database/models/post.model";
import Tag, { ITag } from "../database/models/tag.model";
import mongoose from "mongoose";
import { connectToDatabase } from "../database";
import Comment from "../database/models/comment.model";
import { revalidatePath } from "next/cache";

export async function createPost(data: {
    title: string;
    content: string;
    tags?: string[];
    community?: mongoose.Schema.Types.ObjectId | string;
    coverImage?: string;
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
                author: user?.publicMetadata.userId,
                title: data.title,
                content: data.content,
                coverImage: data.coverImage,
            });
        } else {
            post = await Post.create({
                author: user?.publicMetadata.userId,
                title: data.title,
                content: data.content,
                community: data.community as mongoose.Schema.Types.ObjectId,
                coverImage: data.coverImage,
            });
        }
        await Promise.all(
            data.tags?.forEach(async (tag) => {
                let existingTag: ITag | null = await Tag.findOne({ name: tag });
                if (!existingTag) {
                    let newTag: ITag = await Tag.create({
                        name: tag,
                        posts: [post._id],
                    });
                    post.tags.push(newTag._id as mongoose.Schema.Types.ObjectId);
                } else {
                    existingTag?.posts?.push(post._id as mongoose.Schema.Types.ObjectId);
                    post.tags.push(existingTag._id as mongoose.Schema.Types.ObjectId);
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

export async function getAllPosts(options:
    { limit: number; skip: number; sort: string; order: string; } = {
        limit: 10,
        skip: 0,
        sort: "createdAt",
        order: "desc",
    }
) {
    try {
        await connectToDatabase();
        let posts = await Post.find()
            .populate("tags")
            .populate("author")
            .populate("community")
            .limit(options.limit)
            .skip(options.skip)
            .sort({
                createdAt: options.order === "desc" ? -1 : 1,
            })
        return { status: 200, data: JSON.parse(JSON.stringify(posts)) };
    }
    catch (error: any) {
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
                populate: {
                    path: "author",
                },
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
        post.comments.push(comment._id);
        await post.save();
        return JSON.parse(JSON.stringify({ status: 200, comment: newComment }));
    } catch (error: any) {
        return JSON.parse(JSON.stringify({ status: 500, message: error.message }));
    }
};

export const upVoteComment = async (
    commentId: mongoose.Schema.Types.ObjectId,
    userID: string
) => {
    try {
        await connectToDatabase();
        let comment = await Comment.findById(commentId);
        if (!comment)
            return JSON.parse(
                JSON.stringify({ status: 404, message: "Comment not found" })
            );
        if (comment.upvotes.includes(userID)) {
            comment.upvotes = comment.upvotes.filter((id: any) => id.toString() !== userID.toString());
        } else {
            comment.upvotes.push(userID);
            comment.downvotes = comment.downvotes.filter((id: any) => id.toString() !== userID.toString());
        }
        await comment.save();
        revalidatePath(`/post/${comment.post}`)
        return JSON.parse(JSON.stringify({ status: 200, message: "Success" }));
    } catch (error: any) {
        return JSON.parse(JSON.stringify({ status: 500, message: error.message }));
    }
};

export const downVoteComment = async (
    commentId: mongoose.Schema.Types.ObjectId,
    userID: string
) => {
    try {
        await connectToDatabase();
        let comment = await Comment.findById(commentId);
        if (!comment)
            return JSON.parse(
                JSON.stringify({ status: 404, message: "Comment not found" })
            );
        if (comment.downvotes.includes(userID)) {
            comment.downvotes = comment.downvotes.filter((id: any) => id.toString() !== userID.toString());
        } else {
            comment.downvotes.push(userID);
            comment.upvotes = comment.upvotes.filter((id: any) => id.toString() !== userID.toString());
        }
        await comment.save();
        revalidatePath(`/post/${comment.post}`);
        return JSON.parse(JSON.stringify({ status: 200, message: "Success" }));
    } catch (error: any) {
        return JSON.parse(JSON.stringify({ status: 500, message: error.message }));
    }
};
