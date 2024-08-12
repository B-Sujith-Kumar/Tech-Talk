"use server";

import mongoose from "mongoose";
import { isAuth } from "../auth";
import Tag from "../database/models/tag.model";

export const getTag = async (id: string, options?: {
    limit?: number;
    skip?: number;
    sort?: string;
    order?: string;
}) => {
    try {
        let auth = isAuth();
        if (!auth) {
            return {
                status: 401,
                message: "Unauthorized",
            };
        }
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
                            $limit: options?.limit ?? 2,
                        },
                        {
                            $skip: options?.skip ?? 0,
                        },
                    ]
                }
            },
        ]);
        return { status: 200, data: JSON.parse(JSON.stringify(data)) };
    } catch (error: any) {
        return { status: 500, message: error.message };
    }
};