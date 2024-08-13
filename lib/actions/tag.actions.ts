"use server";

import mongoose from "mongoose";
import { isAuth } from "../auth";
import Tag from "../database/models/tag.model";
import { connectToDatabase } from "../database";
import User from "../database/models/user.model";
import { revalidatePath } from "next/cache";

export const getTag = async (
  id: string,
  options?: {
    limit?: number;
    skip?: number;
    sort?: string;
    order?: string;
  }
) => {
  try {
    let auth = isAuth();
    if (!auth) {
      return JSON.parse(JSON.stringify({
        status: 401,
        message: "Unauthorized",
      }));
    }
    await connectToDatabase();
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
              $skip: options?.skip ?? 0,
            },
            {
              $limit: 3,
            },
          ],
        },
      },
    ]);
    return { status: 200, data: JSON.parse(JSON.stringify(data)) };
  } catch (error: any) {
    return { status: 500, message: error.message };
  }
};

export const isFollowingTag = async (clerkId: string, tagId: string) => {
  try {
    let auth = isAuth();
    if (!auth) {
      return {
        status: 401,
        message: "Unauthorized",
      };
    }
    await connectToDatabase();
    const tag = await Tag.findById(tagId);
    if (!tag) {
      return {
        status: 404,
        message: "Tag not found",
      };
    }
    const user = await User.findOne({ clerkId });
    if (!user) {
      return {
        status: 404,
        message: "User not found",
      };
    }
    const isFollowing = tag.followers.includes(user._id);
    return JSON.parse(JSON.stringify(isFollowing));
  } catch (error: any) {
    return { status: 500, message: error.message };
  }
};

export const followTag = async (clerkId: string, tagId: string) => {
  try {
    let auth = isAuth();
    if (!auth) {
      return {
        status: 401,
        message: "Unauthorized",
      };
    }
    await connectToDatabase();
    const tag = await Tag.findById(tagId);
    if (!tag) {
      return {
        status: 404,
        message: "Tag not found",
      };
    }
    const user = await User.findOne({ clerkId });
    if (!user) {
      return {
        status: 404,
        message: "User not found",
      };
    }
    tag.followers.push(user._id);
    user.followedTags.push(tag._id);
    await user.save();
    await tag.save();
    revalidatePath(`/tag/${tagId}`);
    return JSON.parse(JSON.stringify({ status: 200, message: "Tag followed successfully" }));
  } catch (error: any) {
    return JSON.parse(JSON.stringify({ status: 500, message: error.message }));
  }
};

export const unfollowTag = async (clerkId: string, tagId: string) => {
  try {
    let auth = isAuth();
    if (!auth) {
      return {
        status: 401,
        message: "Unauthorized",
      };
    }
    await connectToDatabase();
    const tag = await Tag.findById(tagId);
    if (!tag) {
      return {
        status: 404,
        message: "Tag not found",
      };
    }
    const user = await User.findOne({ clerkId });
    if (!user) {
      return {
        status: 404,
        message: "User not found",
      };
    }
    tag.followers = tag.followers.filter(
      (follower: any) => follower.toString() !== user._id.toString()
    );
    user.followedTags = user.followedTags.filter(
      (tag: any) => tag.toString() !== tagId
    );
    await user.save();
    await tag.save();
    revalidatePath(`/tag/${tagId}`);
    return JSON.parse(
      JSON.stringify({ status: 200, message: "Tag unfollowed successfully" })
    );
  } catch (error: any) {
    return JSON.parse(JSON.stringify({ status: 500, message: error.message }));
  }
};
