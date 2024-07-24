"use server";

import { isAuth } from "../auth";
import { currentUser } from "@clerk/nextjs/server";
import { connectToDatabase } from "../database";
import { Story } from "../database/models/story.model";
import User from "../database/models/user.model";

export async function createStory({ data }: {
    data: {
        imageUrl: string;
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
            owner: userDb._id
        });
        return { status: 200, message: "Story created successfully" };
    }
    catch (error: any) {
        return { status: 500, message: error.message };
    }
}