"use server";

import { createUserType, updateUserType } from "@/types";
import User, { IUser } from "../database/models/user.model";
import { handleError } from "../utils";
import { connectToDatabase } from "../database";
import { revalidatePath } from "next/cache";
import { isAuth } from "../auth";
import { currentUser } from "@clerk/nextjs/server";
import Community from "../database/models/community.model";
import Post, { IPost } from "../database/models/post.model";

export const createUser = async (user: createUserType) => {
    try {
        await connectToDatabase();
        const newUser = User.create(user);
        return JSON.parse(JSON.stringify(newUser));
    } catch (error) {
        handleError(error);
    }
}

export const updateUser = async (clerkId: string, user: updateUserType) => {
    try {
        await connectToDatabase();

        const updatedUser = await User.findOneAndUpdate({ clerkId }, user, {
            new: true,
        });

        if (!updatedUser) throw new Error("User update failed");
        return JSON.parse(JSON.stringify(updatedUser));
    } catch (error) {
        handleError(error);
    }
}

export const deleteUser = async (clerkId: string) => {
    try {
        await connectToDatabase();

        const userToDelete = await User.findOne({ clerkId });
        if (!userToDelete) {
            throw new Error("User not found");
        }
        const deletedUser = await User.findByIdAndDelete(userToDelete._id);
        revalidatePath("/");

        return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null;
    } catch (error) {
        handleError(error);
    }
}

export const getUserObjectId = async (clerkId: string) => {
    try {
        await connectToDatabase();
        const user: IUser | null = await User.findOne({ clerkId });
        if (!user) {
            throw new Error("User not found");
        }
        return user._id?.toString();
    } catch (error) {
        handleError(error);
    }
}

export async function getCommunitiesJoinedByUser() {
    let auth = await isAuth();
    if (!auth) return { status: 500, message: "User not authenticated" };
    try {
        await connectToDatabase();
        const user = await currentUser();
        const data = await Community.find({ members: user?.publicMetadata?.userId });
        return { status: 200, data: JSON.parse(JSON.stringify(data)) };
    }
    catch (error: any) {
        return { status: 500, message: error.message };
    }
}

export async function followHandler({ userId }: { userId: string }) {
    try {
        let auth = await isAuth();
        if (!auth) return { status: 500, message: "User not authenticated" };
        const user = await currentUser();
        await connectToDatabase();
        const userObjectId = user?.publicMetadata?.userId as string;
        const userToFollow = await User.findById(userId);
        if (!userToFollow) return { status: 404, message: "User not found" };
        if (userToFollow.followers.includes(userObjectId!)) {
            userToFollow.followers.pull(userObjectId!);
        } else {
            userToFollow.followers.push(userObjectId!);
        }
        await userToFollow.save();
        revalidatePath(`/user/${userId}`);
        return { status: 200, message: "Success!" };
    }
    catch (error: any) {
        return { status: 500, message: error.message };
    }
}

export async function upvotePost({
    postId,
}: {
    postId: string;
}) {
    try {
        let auth = await isAuth();
        if (!auth) return { status: 500, message: "User not authenticated" };
        const user = await currentUser();
        await connectToDatabase();
        const userObjectId = user?.publicMetadata?.userId as string;
        const post = await Post.findById(postId);
        if (!post) return { status: 404, message: "Post not found" };
        if (post.upvotes.findIndex((upvote: any) => upvote.user.toString() === userObjectId) !== -1) {
            post.upvotes = post.upvotes.filter((upvote: any) => upvote.user.toString() !== userObjectId);
        }
        else {
            post.upvotes.push({
                user: userObjectId!,
            });
            if (post.downvotes.findIndex((downvote: any) => downvote.user.toString() === userObjectId) !== -1) {
                post.downvotes = post.downvotes.filter((downvote: any) => downvote.user.toString() !== userObjectId);
            }
        }
        await post.save();
        revalidatePath(`/post/${postId}`);
        revalidatePath("/");
        return { status: 200, message: "Success!" };
    }
    catch (error: any) {
        return { status: 500, message: error.message };
    }
}

export async function downvotePost({
    postId,
}: {
    postId: string;
}) {
    try {
        let auth = await isAuth();
        if (!auth) return { status: 500, message: "User not authenticated" };
        const user = await currentUser();
        await connectToDatabase();
        const userObjectId = user?.publicMetadata?.userId as string;
        const post = await Post.findById(postId);
        if (!post) return { status: 404, message: "Post not found" };
        if (post.downvotes.findIndex((downvote: any) => downvote.user.toString() === userObjectId) !== -1) {
            post.downvotes = post.downvotes.filter((downvote: any) => downvote.user.toString() !== userObjectId);
        }
        else {
            post.downvotes.push({
                user: userObjectId!,
            });
            if (post.upvotes.findIndex((upvote: any) => upvote.user.toString() === userObjectId) !== -1) {
                post.upvotes = post.upvotes.filter((upvote: any) => upvote.user.toString() !== userObjectId);
            }
        }
        await post.save();
        revalidatePath(`/post/${postId}`);
        revalidatePath("/");
        return { status: 200, message: "Success!" };
    }
    catch (error: any) {
        return { status: 500, message: error.message };
    }
}