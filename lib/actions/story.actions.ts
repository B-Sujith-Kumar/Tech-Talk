"use server";

import { isAuth } from "../auth";
import { currentUser } from "@clerk/nextjs/server";
import { connectToDatabase } from "../database";
import { IStory, Story } from "../database/models/story.model";
import User from "../database/models/user.model";
import { revalidatePath } from "next/cache";
import { imageRemove } from "../image";

export async function createStory({ data }: {
    data: {
        imageUrl: string;
        imageKey: string;
    }
}) {
    try {
        let auth = isAuth();
        if (!auth) return { status: 401, message: "Unauthorized" };
        const user = await currentUser();
        if (!user) return { status: 401, message: "Unauthorized" };
        await connectToDatabase();
        let userDb = await User.findOne({ clerkId: user.id });
        if (!userDb) return { status: 404, message: "User not found" };
        await Story.create({
            imageUrl: data.imageUrl,
            owner: userDb._id,
            imageKey: data.imageKey
        });
        revalidatePath("/");
        return { status: 200, message: "Story created successfully" };
    }
    catch (error: any) {
        return { status: 500, message: error.message };
    }
}

export async function deleteStory({ storyId }: {
    storyId: string;
}) {
    try {
        let auth = isAuth();
        if (!auth) return { status: 401, message: "Unauthorized" };
        const user = await currentUser();
        if (!user) return { status: 401, message: "Unauthorized" };
        await connectToDatabase();
        let userDb = await User.findOne({ clerkId: user.id });
        if (!userDb) return { status: 404, message: "User not found" };
        let story = await Story.findOne({ _id: storyId, owner: userDb._id });
        if (!story) return { status: 404, message: "Story not found" };
        await imageRemove(story.imageKey);
        await Story.deleteOne({ _id: storyId });
        revalidatePath("/");
        return { status: 200, message: "Story deleted successfully" };
    }
    catch (error: any) {
        return { status: 500, message: error.message };
    }
}

export async function getUserStories() {
    try {
        let auth = isAuth();
        if (!auth) return { status: 401, message: "Unauthorized" };
        const user = await currentUser();
        if (!user) return { status: 401, message: "Unauthorized" };
        await connectToDatabase();
        let userDb = await User.findOne({ clerkId: user.id });
        if (!userDb) return { status: 404, message: "User not found" };
        let stories: IStory[] = await Story.find({ owner: userDb._id });
        return { status: 200, data: JSON.parse(JSON.stringify(stories)) };
    }
    catch (error: any) {
        return { status: 500, message: error.message };
    }
}

export async function getFollowingPeoplesStories(){
    try {
        let auth = isAuth();
        if (!auth) return { status: 401, message: "Unauthorized" };
        const user = await currentUser();
        if (!user) return { status: 401, message: "Unauthorized" };
        await connectToDatabase();
        let userDb = await User.findOne({ clerkId: user.id });
        if (!userDb) return { status: 404, message: "User not found" };
        let following = userDb.following;
        let stories: IStory[] = await Story.find({ owner: { $in: following } });
        return { status: 200, data: JSON.parse(JSON.stringify(stories)) };
    }
    catch (error: any) {
        return { status: 500, message: error.message };
    }
}