"use server";

import { currentUser } from "@clerk/nextjs";
import { isAuth } from "../auth";
import { handleError } from "../utils";
import Post from "../database/models/post.model";

export async function createPost(data: any) {
    try {
        let auth = isAuth();
        if (!auth) return {
            status: 401,
            message: "Unauthorized"
        }
        const user = await currentUser();
        await Post.create({
            author: user?.publicMetadata.userId,
            title: data.tile,
            content: data.content,
            tags: data.tags || [],
            community: data.community ?? null,
        });
        return {
            status: 200,
            message: "Post created successfully"
        }
    }
    catch (error) {
        handleError(error);
    }
}