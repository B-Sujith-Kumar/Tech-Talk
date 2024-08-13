import { connectToDatabase } from "@/lib/database";
import { Story } from "@/lib/database/models/story.model";
import Tag from "@/lib/database/models/tag.model";
import User from "@/lib/database/models/user.model";
import mongoose from "mongoose";

export async function GET(req: Request) {
    try {
        await connectToDatabase();
        let id = "";
        // get all posts with this tag as included in it using mongodb aggregation
        const data = await Tag.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(id),
                },
            },
            {
                $lookup: {
                    from: "posts",
                    localField: "posts",
                    foreignField: "_id",
                    as: "posts",
                    pipeline: [
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
                                            username: 1,
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
                            $skip: 3,
                        },
                        {
                            $limit: 3,
                        },
                    ]
                }
            },
        ]);
        return Response.json({
            data
        });
    }
    catch (error: any) {
        return Response.json({
            status: 500,
            error
        });
    }
}