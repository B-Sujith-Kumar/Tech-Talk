import { connectToDatabase } from "@/lib/database";
import User from "@/lib/database/models/user.model";
import mongoose from "mongoose";

export async function GET(req: Request) {
    try {
        await connectToDatabase();
        let userDb = {
            _id: ""
        }
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