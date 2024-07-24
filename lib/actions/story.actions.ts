"use server";

import { isAuth } from "../auth";
import { currentUser } from "@clerk/nextjs/server";
import { connectToDatabase } from "../database";
import { IStory, Story, StoryView } from "../database/models/story.model";
import User from "../database/models/user.model";
import { revalidatePath } from "next/cache";
import { imageRemove } from "../image";
import mongoose from "mongoose";

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
        let stories: IStory[] = await Story.find({ owner: userDb._id }).populate("owner");
        return { status: 200, data: JSON.parse(JSON.stringify(stories)) };
    }
    catch (error: any) {
        return { status: 500, message: error.message };
    }
}

export async function getFollowingPeoplesStories() {
    try {
        let auth = isAuth();
        if (!auth) return { status: 401, message: "Unauthorized" };
        const user = await currentUser();
        if (!user) return { status: 401, message: "Unauthorized" };
        await connectToDatabase();
        let userDb = await User.findOne({ clerkId: user.id });
        if (!userDb) return { status: 404, message: "User not found" };
        let data = await User.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(userDb._id)
                }
            },
            {
                $lookup: {
                    from: "stories",
                    localField: "following",
                    foreignField: "owner",
                    as: "storiesData",
                    pipeline: [
                        {
                            $lookup: {
                                from: "users",
                                localField: "owner",
                                foreignField: "_id",
                                as: "owner",
                            }
                        },
                        {
                            $addFields: {
                                owner: {
                                    $arrayElemAt: ["$owner", 0]
                                }
                            }
                        },
                        {
                            $lookup: {
                                from: "storyviews",
                                let: { storyId: "$_id" },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: {
                                                $and: [
                                                    { $eq: ["$story", "$$storyId"] },
                                                    {
                                                        $eq: [
                                                            "$userID",
                                                            new mongoose.Types.ObjectId(userDb._id)
                                                        ]
                                                    }
                                                ]
                                            }
                                        }
                                    }
                                ],
                                as: "isViewed"
                            },
                        },
                        {
                            $addFields: {
                                isViewed: { $gt: [{ $size: "$isViewed" }, 0] }
                            }
                        },
                        {
                            $sort: {
                                isViewed: 1,
                                createdAt: -1
                            }
                        },
                        {
                            $project: {
                                imageUrl: 1,
                                createdAt: 1,
                                owner: {
                                    _id: 1,
                                    firstName: 1,
                                    lastName: 1,
                                    username: 1,
                                    profilePicture: 1
                                },
                                isViewed: 1
                            }
                        }
                    ]
                }
            },
            {
                $project: {
                    _id: 0,
                    storiesData: 1,
                }
            },
            {
                $unwind: "$storiesData"
            },
            {
                $replaceRoot: { newRoot: "$storiesData" }
            }
        ]);
        return { status: 200, data: JSON.parse(JSON.stringify(data)) };
    }
    catch (error: any) {
        return { status: 500, message: error.message };
    }
}

export async function viewStory({ storyId }: {
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
        let story = await Story.findOne({ _id: storyId });
        if (!story) return { status: 404, message: "Story not found" };
        let existingView = await StoryView.findOne({ story: story._id, userID: userDb._id });
        if (existingView) return { status: 400, message: "Story already viewed" };
        await StoryView.create({
            story: story._id,
            userID: userDb._id
        });
        revalidatePath("/");
        return { status: 200, message: "Story viewed successfully" };
    }
    catch (error: any) {
        return { status: 500, message: error.message };
    }
}