import { connectToDatabase } from "@/lib/database";
import Post from "@/lib/database/models/post.model";

export async function GET(req: Request) {
    try {
        await connectToDatabase();
        let data = await Post.aggregate([
            {
                $match: {
                    $or: [
                        {
                            "upvotes.createdAt": {
                                $gte: new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
                            }
                        },
                        {
                            "downvotes.createdAt": {
                                $gte: new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
                            }
                        },
                        {
                            "comments.createdAt": {
                                $gte: new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
                            }
                        }
                    ]
                }
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
                                name: 1
                            }
                        }
                    ]
                }
            },
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
                                icon: 1
                            }
                        }
                    ]
                }
            },
            {
                $addFields:{
                    community: {
                        $arrayElemAt: ["$community", 0]
                    }
                }
            },
            {
                $addFields: {
                    engagementScore: {
                        $subtract: [
                            {
                                $add: [
                                    { $size: "$upvotes" },
                                    { $size: "$comments" }
                                ]
                            },
                            { $size: "$downvotes" }
                        ]
                    }
                }
            },
            {
                $sort: {
                    engagementScore: -1
                }
            },
            {
                $limit: 10
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
                                profilePicture: 1
                            }
                        }
                    ]
                }
            },
            {
                $addFields: {
                    author: {
                        $arrayElemAt: ["$author", 0]
                    }
                }
            }
        ]);

        return Response.json({
            message: "Hello, World!",
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