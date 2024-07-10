"use server";

import { currentUser } from "@clerk/nextjs";
import { isAuth } from "../auth";
import Post, { IPost } from "../database/models/post.model";
import Tag, { ITag } from "../database/models/tag.model";
import mongoose from "mongoose";

export async function createPost(data: {
    title: string;
    content: string;
    tags?: string[];
    community?: mongoose.Schema.Types.ObjectId | string;
    coverImage?: string;
}) {
    try {
        let auth = isAuth();
        if (!auth) return {
            status: 401,
            message: "Unauthorized"
        }
        const user = await currentUser();
        let post: IPost;
        if (data.community === "public" || !data.community || data.community === "") {
            post = await Post.create({
                author: user?.publicMetadata.userId,
                title: data.title,
                content: data.content,
            });
        }
        else {
            post = await Post.create({
                author: user?.publicMetadata.userId,
                title: data.title,
                content: data.content,
                community: data.community as mongoose.Schema.Types.ObjectId,
            });
        }
        await Promise.all(data.tags?.forEach(async (tag) => {
            let existingTag: ITag | null = await Tag.findOne({ name: tag });
            if (!existingTag) {
                let newTag: ITag = await Tag.create({
                    name: tag,
                    posts: [post._id],
                });
                post.tags.push(newTag._id as mongoose.Schema.Types.ObjectId);
            }
            else {
                existingTag.posts.push(post._id as mongoose.Schema.Types.ObjectId);
                post.tags.push(existingTag._id as mongoose.Schema.Types.ObjectId);
                await existingTag.save();
            }
        })?? []);
        await post.save();
        return { status: 200, message: "Post created successfully" }
    }
    catch (error: any) {
        return { status: 500, message: error.message }
    }
}