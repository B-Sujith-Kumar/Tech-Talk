"use server";

import User, { IUser } from "../database/models/user.model";
import Community, { ICommunity } from "../database/models/community.model";
import Tag from "../database/models/tag.model";
import { createCommunityType, IPostPopulated } from "@/types";
import { connectToDatabase } from "../database";
import { revalidatePath } from "next/cache";
import mongoose from "mongoose";
import Post from "../database/models/post.model";
import { Knock } from "@knocklabs/node";

export const createCommunity = async (data: createCommunityType) => {
  try {
    await connectToDatabase();
    const user: IUser | null = await User.findOne({ clerkId: data.createdBy });
    if (!user) {
      return JSON.parse(
        JSON.stringify({ error: "User not found", success: false })
      );
    }
    const community: ICommunity = await Community.create({
      name: data.name,
      description: data.description,
      createdBy: user._id!,
      icon: data.icon || "",
      banner: data.banner || "",
      tags: [],
    });
    community.members.push(user._id!);
    for (let tag of data.tags) {
      const tagObj = await Tag.findOne({ name: tag });
      if (tagObj) {
        tagObj.communities.push(community._id!);
        await tagObj.save();
        community.tags.push(tagObj._id!);
      } else {
        const newTag = new Tag({ name: tag });
        newTag.communities.push(community._id!);
        await newTag.save();
        community.tags.push(newTag._id!);
      }
    }
    await community.save();
    return JSON.parse(
      JSON.stringify({ communityId: community._id, success: true })
    );
  } catch (error) {
    console.log(error);
    return JSON.parse(JSON.stringify({ error, success: true }));
  }
};

export const getCommunity = async (communityId: string) => {
  try {
    await connectToDatabase();
    const community: ICommunity | null = await Community.findById(
      communityId
    ).populate(["tags", "members", "createdBy"]);
    if (!community) {
      return JSON.parse(
        JSON.stringify({ error: "Community not found", success: false })
      );
    }
    return JSON.parse(JSON.stringify({ community, success: true }));
  } catch (error) {
    console.log(error);
    return JSON.parse(JSON.stringify({ error, success: false }));
  }
};

export const joinCommunity = async (communityId: string, userId: string) => {
  try {
    await connectToDatabase();
    const community: ICommunity | null = await Community.findById(communityId);
    if (!community) {
      return JSON.parse(
        JSON.stringify({ error: "Community not found", success: false })
      );
    }
    const user: IUser | null = await User.findOne({ _id: userId });
    if (!user) {
      return JSON.parse(
        JSON.stringify({ error: "User not found", success: false })
      );
    }
    community.members.push(user._id!);
    await community.save();
    revalidatePath(`/community/${communityId}`);
    return JSON.parse(JSON.stringify({ success: true }));
  } catch (error) {
    console.log(error);
    return JSON.parse(JSON.stringify({ error, success: false }));
  }
};

export const leaveCommunity = async (communityId: string, userId: string) => {
  try {
    await connectToDatabase();
    const community: ICommunity | null = await Community.findById(communityId);
    if (!community) {
      return JSON.parse(
        JSON.stringify({ error: "Community not found", success: false })
      );
    }
    const user: IUser | null = await User.findOne({ _id: userId });
    if (!user) {
      return JSON.parse(
        JSON.stringify({ error: "User not found", success: false })
      );
    }
    community.members = community.members.filter(
      (member) => member.toString() !== user._id?.toString()
    );
    await community.save();
    revalidatePath(`/community/${communityId}`);
    return JSON.parse(JSON.stringify({ success: true }));
  } catch (error) {
    console.log(error);
    return JSON.parse(JSON.stringify({ error, success: false }));
  }
};

export const getCommunityPosts = async (communityId: string) => {
  try {
    await connectToDatabase();
    const community: ICommunity | null = await Community.findById(communityId);
    if (!community) {
      return JSON.parse(
        JSON.stringify({ error: "Community not found", success: false })
      );
    }
    const posts: IPostPopulated[] = await Post.find({
      community: community._id,
    })
      .populate(["author", "tags"])
      .sort({ createdAt: -1 });

    return {
      data: JSON.parse(JSON.stringify(posts)),
      success: true,
    };
  } catch (error) {
    console.log(error);
    return JSON.parse(JSON.stringify({ error, success: false }));
  }
};

export const getTrendingCommunityPosts = async (communityId: string) => {
  try {
    await connectToDatabase();
    const community: ICommunity | null = await Community.findById(communityId);
    if (!community) {
      return JSON.parse(
        JSON.stringify({ error: "Community not found", success: false })
      );
    }

    let data = await Post.aggregate([
      {
        $match: {
          community: new mongoose.Types.ObjectId(communityId),
          $or: [
            {
              "upvotes.createdAt": {
                $gte: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
              },
            },
            {
              "downvotes.createdAt": {
                $gte: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
              },
            },
            {
              "comments.createdAt": {
                $gte: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
              },
            },
          ],
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
        $addFields: {
          engagementScore: {
            $subtract: [
              {
                $add: [{ $size: "$upvotes" }, { $size: "$comments" }],
              },
              { $size: "$downvotes" },
            ],
          },
        },
      },
      {
        $sort: {
          engagementScore: -1,
        },
      },
      {
        $limit: 10,
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
    ]);
    return {
      data: JSON.parse(JSON.stringify(data)),
      success: true,
    };
  } catch (error) {
    console.log(error);
    return JSON.parse(JSON.stringify({ error, success: false }));
  }
};

export const getPopularCommunityPosts = async (communityId: string) => {
  try {
    await connectToDatabase();
    const community: ICommunity | null = await Community.findById(communityId);
    if (!community) {
      return JSON.parse(
        JSON.stringify({ error: "Community not found", success: false })
      );
    }

    let data = await Post.aggregate([
      {
        $match: {
          community: new mongoose.Types.ObjectId(communityId),
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
        $addFields: {
          popularityScore: {
            $subtract: [
              {
                $add: [{ $size: "$upvotes" }, { $size: "$comments" }],
              },
              { $size: "$downvotes" },
            ],
          },
        },
      },
      {
        $sort: {
          popularityScore: -1,
        },
      },
      {
        $limit: 10,
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
    ]);
    return {
      data: JSON.parse(JSON.stringify(data)),
      success: true,
    };
  } catch (error) {
    console.log(error);
    return JSON.parse(JSON.stringify({ error, success: false }));
  }
};

export const getCommunityModerators = async (communityId: string) => {
  try {
    await connectToDatabase();
    const community: ICommunity | null = await Community.findById(
      communityId
    ).populate("moderators");
    if (!community) {
      return JSON.parse(
        JSON.stringify({ error: "Community not found", success: false })
      );
    }
    return JSON.parse(JSON.stringify(community.moderators));
  } catch (error) {
    console.log(error);
    return JSON.parse(JSON.stringify({ error, success: false }));
  }
};

export const addModerator = async (communityId: string, username: string) => {
  try {
    await connectToDatabase();
    const community: ICommunity | null = await Community.findById(communityId);
    if (!community) {
      return JSON.parse(
        JSON.stringify({ error: "Community not found", status: 500 })
      );
    }
    const user: IUser | null = await User.findOne({ username });
    if (!user) {
      return JSON.parse(
        JSON.stringify({
          error:
            "Sorry, the username does not exists. Please try another username.",
          status: 500,
        })
      );
    }
    if (community.moderators.includes(user._id!)) {
      return JSON.parse(
        JSON.stringify({ error: "User is already a moderator", status: 500 })
      );
    }
    community.moderatorInvites?.push(user._id!);
    user.moderatorInvites?.push(community._id!);
    await community.save();
    await user.save();
    revalidatePath(`/community/${communityId}/mod-tools/moderators`);
    return JSON.parse(JSON.stringify({ status: 200 }));
  } catch (error) {
    console.log(error);
    return JSON.parse(JSON.stringify({ error, status: 500 }));
  }
};

export const removeModerator = async (communityId: string, userId: string) => {
  try {
    await connectToDatabase();
    const community: ICommunity | null = await Community.findById(communityId);
    if (!community) {
      return JSON.parse(
        JSON.stringify({ error: "Community not found", status: 500 })
      );
    }
    community.moderators = community.moderators.filter(
      (moderator) => moderator.toString() !== userId
    );
    await community.save();
    revalidatePath("/community/" + communityId + "/mod-tools/moderators");
    return JSON.parse(JSON.stringify({ status: 200 }));
  } catch (error) {
    console.log(error);
    return JSON.parse(JSON.stringify({ error, status: 500 }));
  }
};

export const getModerators = async (communityId: string) => {
  try {
    await connectToDatabase();
    const community: ICommunity | null = await Community.findById(
      communityId
    ).populate("moderators");
    if (!community) {
      return JSON.parse(
        JSON.stringify({ error: "Community not found", success: false })
      );
    }
    return JSON.parse(JSON.stringify(community.moderators));
  } catch (error) {
    console.log(error);
    return JSON.parse(JSON.stringify({ error, success: false }));
  }
};

export const getNeedReviewPosts = async (communityId: string) => {
  try {
    await connectToDatabase();
    const community: ICommunity | null = await Community.findById(communityId);
    if (!community) {
      return JSON.parse(
        JSON.stringify({ error: "Community not found", success: false })
      );
    }
    const posts = await Post.find({ _id: { $in: community.needsReview } })
      .populate(["author", "tags"])
      .sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify({ posts, success: true }));
  } catch (error) {
    console.log(error);
    return JSON.parse(JSON.stringify({ error, success: false }));
  }
};

export const approvePost = async (postId: string, communityId: string) => {
  try {
    await connectToDatabase();
    const post = await Post.findById(postId);
    const knock = new Knock(process.env.KNOCK_API_SECRET);
    if (!post) {
      return JSON.parse(
        JSON.stringify({ error: "Post not found", success: false })
      );
    }
    const community = await Community.findById(communityId);
    if (!community) {
      return JSON.parse(
        JSON.stringify({ error: "Community not found", success: false })
      );
    }
    community.needsReview = community.needsReview.filter(
      (review: mongoose.Types.ObjectId) => review.toString() !== postId
    );
    await community.save();
    const populatedNotifiedUsers = await Community.findById(
      communityId
    ).populate("communityNotification");
    const recipients: { id: string; email: string; name: string }[] = [];
    populatedNotifiedUsers.communityNotification.forEach((user: IUser) => {
      recipients.push({
        id: user.clerkId,
        email: user.email,
        name: user.firstName + " " + user.lastName,
      });
    });
    await knock.workflows.trigger("community-post-add", {
      data: {
        communityName: community.name,
        postId: post._id,
      },
      recipients: recipients,
    });
    revalidatePath(`/community/${communityId}/mod-tools/queue`);
    return JSON.parse(JSON.stringify({ success: true }));
  } catch (error) {
    console.log(error);
    return JSON.parse(JSON.stringify({ error, success: false }));
  }
};

export const removePost = async (postId: string, communityId: string) => {
  try {
    await connectToDatabase();
    const post = await Post.findById(postId);
    console.log(post);
    if (!post) {
      return JSON.parse(
        JSON.stringify({ error: "Post not found", success: false })
      );
    }
    const community = await Community.findById(communityId);
    if (!community) {
      return JSON.parse(
        JSON.stringify({ error: "Community not found", success: false })
      );
    }
    community.needsReview = community.needsReview.filter(
      (review: mongoose.Types.ObjectId) => review.toString() !== postId
    );
    await Promise.all(
      post.tags.map(async (tag: mongoose.Types.ObjectId) => {
        await Tag.updateOne({ _id: tag }, { $pull: { posts: post._id } });
      })
    );
    await Post.deleteOne({ _id: postId });
    await community.save();
    revalidatePath(`/community/${communityId}/mod-tools/queue`);
    return JSON.parse(JSON.stringify({ success: true }));
  } catch (error) {
    console.log(error);
    return JSON.parse(JSON.stringify({ error, success: false }));
  }
};

export const getModInvites = async (clerkId: string) => {
  try {
    await connectToDatabase();
    const user = await User.findOne({ clerkId }).populate("moderatorInvites");
    if (!user) {
      return JSON.parse(
        JSON.stringify({ error: "User not found", success: false })
      );
    }
    return JSON.parse(JSON.stringify(user.moderatorInvites));
  } catch (error) {
    console.log(error);
    return JSON.parse(JSON.stringify({ error, success: false }));
  }
};

export const acceptInvite = async (communityId: string, clerkId: string) => {
  try {
    await connectToDatabase();
    const user = await User.findOne({ clerkId });
    if (!user) {
      return JSON.parse(
        JSON.stringify({ error: "User not found", success: false })
      );
    }
    const community = await Community.findById(communityId);
    if (!community) {
      return JSON.parse(
        JSON.stringify({ error: "Community not found", success: false })
      );
    }
    community.moderators.push(user._id!);
    user.moderatorInvites = user.moderatorInvites.filter(
      (invite: mongoose.Types.ObjectId) =>
        invite.toString() !== community._id?.toString()
    );
    community.moderatorInvites = community.moderatorInvites.filter(
      (invite: mongoose.Types.ObjectId) =>
        invite.toString() !== user._id?.toString()
    );
    await community.save();
    await user.save();
    revalidatePath(`/community/${communityId}/mod-tools/moderators`);
    return JSON.parse(JSON.stringify({ success: true }));
  } catch (error) {
    console.log(error);
    return JSON.parse(JSON.stringify({ error, success: false }));
  }
};

export const ignoreInvite = async (communityId: string, clerkId: string) => {
  try {
    await connectToDatabase();
    const user = await User.findOne({ clerkId });
    if (!user) {
      return JSON.parse(
        JSON.stringify({ error: "User not found", success: false })
      );
    }
    const community = await Community.findById(communityId);
    if (!community) {
      return JSON.parse(
        JSON.stringify({ error: "Community not found", success: false })
      );
    }
    user.moderatorInvites = user.moderatorInvites.filter(
      (invite: mongoose.Types.ObjectId) =>
        invite.toString() !== community._id?.toString()
    );
    community.moderatorInvites = community.moderatorInvites.filter(
      (invite: mongoose.Types.ObjectId) =>
        invite.toString() !== user._id?.toString()
    );
    await community.save();
    await user.save();
    revalidatePath(`/community/${communityId}/mod-tools/moderators`);
    return JSON.parse(JSON.stringify({ success: true }));
  } catch (error) {
    console.log(error);
    return JSON.parse(JSON.stringify({ error, success: false }));
  }
};

export const populateModInvites = async (communityId: string) => {
  try {
    await connectToDatabase();
    const community = await Community.findById(communityId).populate(
      "moderatorInvites"
    );
    if (!community) {
      return JSON.parse(
        JSON.stringify({ error: "Community not found", success: false })
      );
    }
    return JSON.parse(JSON.stringify(community.moderatorInvites));
  } catch (error) {
    console.log(error);
    return JSON.parse(JSON.stringify({ error, success: false }));
  }
};

export const withdrawInvite = async (communityId: string, clerkId: string) => {
  try {
    await connectToDatabase();
    const user = await User.findOne({ clerkId });
    if (!user) {
      return JSON.parse(
        JSON.stringify({ error: "User not found", success: false })
      );
    }
    const community = await Community.findById(communityId);
    if (!community) {
      return JSON.parse(
        JSON.stringify({ error: "Community not found", success: false })
      );
    }
    user.moderatorInvites = user.moderatorInvites.filter(
      (invite: mongoose.Types.ObjectId) =>
        invite.toString() !== community._id?.toString()
    );
    community.moderatorInvites = community.moderatorInvites.filter(
      (invite: mongoose.Types.ObjectId) =>
        invite.toString() !== user._id?.toString()
    );
    await community.save();
    await user.save();
    revalidatePath(`/community/${communityId}/mod-tools/moderators`);
    return JSON.parse(JSON.stringify({ success: true }));
  } catch (error) {
    console.log(error);
    return JSON.parse(JSON.stringify({ error, success: false }));
  }
};

export const turnOffCommunityNotification = async (
  communityId: string,
  userId: string
) => {
  try {
    await connectToDatabase();
    const user = await User.findById(userId);
    if (!user) {
      return JSON.parse(
        JSON.stringify({ error: "User not found", success: false })
      );
    }
    const community = await Community.findById(communityId);
    if (!community) {
      return JSON.parse(
        JSON.stringify({ error: "Community not found", success: false })
      );
    }
    community.communityNotification = community.communityNotification.filter(
      (user: mongoose.Types.ObjectId) => user.toString() !== userId
    );
    await community.save();
    return JSON.parse(JSON.stringify({ success: true }));
  } catch (error) {
    console.log(error);
    return JSON.parse(JSON.stringify({ error, success: false }));
  }
};

export const turnOnCommunityNotification = async (
  communityId: string,
  userId: string
) => {
  try {
    await connectToDatabase();
    const user = await User.findById(userId);
    if (!user) {
      return JSON.parse(
        JSON.stringify({ error: "User not found", success: false })
      );
    }
    const community = await Community.findById(communityId);
    if (!community) {
      return JSON.parse(
        JSON.stringify({ error: "Community not found", success: false })
      );
    }
    community.communityNotification.push(user._id!);
    await community.save();
    return JSON.parse(JSON.stringify({ success: true }));
  } catch (error) {
    console.log(error);
    return JSON.parse(JSON.stringify({ error, success: false }));
  }
};