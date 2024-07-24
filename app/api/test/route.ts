import { connectToDatabase } from "@/lib/database";
import { Story } from "@/lib/database/models/story.model";
import User from "@/lib/database/models/user.model";
import mongoose from "mongoose";

export async function GET(req: Request) {
    try {
        await connectToDatabase();
        let userDb = {
            _id: "668a5c734bb5c185ac75bdf0"
        }
        let data = await Story.aggregate([
            {
                $match: {
                    owner: new mongoose.Types.ObjectId(userDb._id)
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "owner",
                    foreignField: "_id",
                    as: "owner",
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                firstName: 1,
                                lastName: 1,
                                username: 1,
                                profilePicture: 1
                            }
                        }
                    ]
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
                    localField: "_id",
                    foreignField: "story",
                    as: "views",
                    pipeline: [
                        {
                            $lookup: {
                                from: "users",
                                localField: "userID",
                                foreignField: "_id",
                                as: "user"
                            }
                        },
                        {
                            $addFields: {
                                user: {
                                    $arrayElemAt: ["$user", 0]
                                }
                            }
                        },
                        {
                            $sort: {
                                createdAt: -1 // Sort by latest view
                            }
                        },
                        {
                            $project: {
                                _id: 1,
                                createdAt: 1,
                                user: {
                                    _id: 1,
                                    firstName: 1,
                                    lastName: 1,
                                    username: 1,
                                    profilePicture: 1
                                }
                            }
                        }
                    ]
                }
            },
            {
                $project: {
                    _id: 1,
                    owner: 1,
                    imageUrl: 1,
                    imageKey: 1,
                    createdAt: 1,
                    views: 1,
                }
            }
        ]);

        return Response.json({
            data
        });
    }
    catch (error: any) {
        return Response.json({
            message: "Hello, World!",
            error
        });
    }
}