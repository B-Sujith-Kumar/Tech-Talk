"use server";

import { createUserType, updateUserType } from "@/types";
import User, { IUser } from "../database/models/user.model";
import { handleError } from "../utils";
import { connectToDatabase } from "../database";
import { revalidatePath } from "next/cache";
import { isAuth } from "../auth";
import { currentUser } from "@clerk/nextjs/server";
import Community from "../database/models/community.model";
import Post, { IPost } from "../database/models/post.model";
import mongoose from "mongoose";
import Tag, { ITag } from "../database/models/tag.model";
import { Knock } from "@knocklabs/node";

export const createUser = async (user: createUserType) => {
  try {
    await connectToDatabase();
    const newUser = User.create(user);
    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    handleError(error);
  }
};

export const updateUser = async (clerkId: string, user: updateUserType) => {
  try {
    await connectToDatabase();

    const updatedUser = await User.findOneAndUpdate({ clerkId }, user, {
      new: true,
    });

    if (!updatedUser) throw new Error("User update failed");
    return JSON.parse(JSON.stringify(updatedUser));
  } catch (error) {
    handleError(error);
  }
};

export const deleteUser = async (clerkId: string) => {
  try {
    await connectToDatabase();

    const userToDelete = await User.findOne({ clerkId });
    if (!userToDelete) {
      throw new Error("User not found");
    }
    const deletedUser = await User.findByIdAndDelete(userToDelete._id);
    revalidatePath("/");

    return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null;
  } catch (error) {
    handleError(error);
  }
};

export const getUser = async (clerkId: string | null) => {
  try {
    await connectToDatabase();
    const user = await User.findOne({ clerkId });
    if (!user) {
      return { status: 404, message: "User not found" };
    }
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    handleError(error);
  }
};

export const getUserObjectId = async (clerkId: string) => {
  try {
    await connectToDatabase();
    const user: IUser | null = await User.findOne({ clerkId });
    if (!user) {
      throw new Error("User not found");
    }
    return user._id?.toString();
  } catch (error) {
    handleError(error);
  }
};

export async function getCommunitiesJoinedByUser(currentUser: IUser) {
  let auth = await isAuth();
  if (!auth) return { status: 500, message: "User not authenticated" };
  try {
    await connectToDatabase();
    const data = await Community.find({
      members: currentUser._id,
    });
    return { status: 200, data: JSON.parse(JSON.stringify(data)) };
  } catch (error: any) {
    return { status: 500, message: error.message };
  }
}

export async function followHandler({
  userId,
  currentUserId,
}: {
  userId: string;
  currentUserId: string;
}) {
  try {
    let auth = await isAuth();
    if (!auth) return { status: 500, message: "User not authenticated" };
    const user = await User.findById(currentUserId);
    await connectToDatabase();
    const userObjectId = await getUserObjectId(user?.id);
    const userToFollow = await User.findById(userId);
    if (!userToFollow) return { status: 404, message: "User not found" };
    if (userToFollow.followers.includes(userObjectId!)) {
      userToFollow.followers.pull(userObjectId!);
    } else {
      userToFollow.followers.push(userObjectId!);
    }
    await userToFollow.save();
    revalidatePath(`/user/${userId}`);
    return { status: 200, message: "Success!" };
  } catch (error: any) {
    return { status: 500, message: error.message };
  }
}

export async function upvotePost({ postId }: { postId: string }) {
  try {
    let auth = await isAuth();
    if (!auth) return { status: 500, message: "User not authenticated" };
    const user: any = await currentUser();
    const knock = new Knock(process.env.KNOCK_API_SECRET);
    await connectToDatabase();
    const userObjectId = await getUserObjectId(user?.id);
    const post = await Post.findById(postId).populate("author");
    if (!post) return { status: 404, message: "Post not found" };
    if (
      post.upvotes.findIndex(
        (upvote: any) => upvote.user.toString() === userObjectId
      ) !== -1
    ) {
      post.upvotes = post.upvotes.filter(
        (upvote: any) => upvote.user.toString() !== userObjectId
      );
    } else {
      post.upvotes.push({
        user: userObjectId!,
      });
      if (
        post.downvotes.findIndex(
          (downvote: any) => downvote.user.toString() === userObjectId
        ) !== -1
      ) {
        post.downvotes = post.downvotes.filter(
          (downvote: any) => downvote.user.toString() !== userObjectId
        );
      }
      await knock.workflows
        .trigger("upvote", {
          data: {
            postId,
            name: user.firstName + " " + user.lastName,
            length: post.upvotes.length === 1 ? 0 : post.upvotes.length - 1,
            title: post.title,
          },
          recipients: [
            {
              id: post.author.clerkId,
              name: post.author?.firstName + " " + post.author?.lastName,
              email: post.author?.email,
            },
          ],
        })
        .catch((error) => console.log(error));
    }
    await post.save();
    revalidatePath(`/post/${postId}`);
    revalidatePath("/");
    return { status: 200, message: "Success!" };
  } catch (error: any) {
    return { status: 500, message: error.message };
  }
}

export async function downvotePost({ postId }: { postId: string }) {
  try {
    let auth = await isAuth();
    if (!auth) return { status: 500, message: "User not authenticated" };
    const user: any = await currentUser();
    await connectToDatabase();
    const userObjectId = await getUserObjectId(user?.id);
    const post = await Post.findById(postId);
    if (!post) return { status: 404, message: "Post not found" };
    if (
      post.downvotes.findIndex(
        (downvote: any) => downvote.user.toString() === userObjectId
      ) !== -1
    ) {
      post.downvotes = post.downvotes.filter(
        (downvote: any) => downvote.user.toString() !== userObjectId
      );
    } else {
      post.downvotes.push({
        user: userObjectId!,
      });
      if (
        post.upvotes.findIndex(
          (upvote: any) => upvote.user.toString() === userObjectId
        ) !== -1
      ) {
        post.upvotes = post.upvotes.filter(
          (upvote: any) => upvote.user.toString() !== userObjectId
        );
      }
    }
    await post.save();
    revalidatePath(`/post/${postId}`);
    revalidatePath("/");
    return { status: 200, message: "Success!" };
  } catch (error: any) {
    return { status: 500, message: error.message };
  }
}

export const getStats = async (clerkId: string) => {
  try {
    await connectToDatabase();
    const user = await User.findOne({ clerkId: clerkId });
    if (!user) {
      throw new Error("User not found");
    }
    const posts = await Post.find({ author: user._id });
    const followers = user.followers.length;
    const following = user.following.length;
    const upvotes = posts.reduce((acc, post) => acc + post.upvotes.length, 0);
    const downvotes = posts.reduce(
      (acc, post) => acc + post.downvotes.length,
      0
    );
    const totalViews = posts.reduce((acc, post) => acc + post.views, 0);
    const totalComments = posts.reduce(
      (acc, post) => acc + post.comments.length,
      0
    );
    const communitiesMembers = await Community.find({ members: user._id });
    const communityCreated = await Community.find({ creator: user._id });
    const communities = communitiesMembers.length + communityCreated.length;
    const followingTags = user.followedTags.length;
    return JSON.parse(
      JSON.stringify({
        followers,
        following,
        upvotes,
        downvotes,
        totalComments,
        totalViews,
        posts: posts.length,
        followingTags,
        communities,
        tags: user.followedTags.length,
      })
    );
  } catch (error) {
    handleError(error);
  }
};

export const getFollowers = async (clerkId: string) => {
  try {
    await connectToDatabase();
    const user = await User.findOne({ clerkId });
    if (!user) {
      throw new Error("User not found");
    }
    const followers = await User.find({ _id: { $in: user.followers } });
    return JSON.parse(JSON.stringify(followers));
  } catch (error) {
    handleError(error);
  }
};

export const getFollowing = async (clerkId: string) => {
  try {
    await connectToDatabase();
    const user = await User.findOne({ clerkId });
    if (!user) {
      throw new Error("User not found");
    }
    const following = await User.find({ _id: { $in: user.following } });
    return JSON.parse(JSON.stringify(following));
  } catch (error) {
    handleError(error);
  }
};

export const followUser = async (userId: string, currentUserId: string) => {
  try {
    await connectToDatabase();
    const user = await User.findById(userId);
    if (!user) {
      return JSON.parse(JSON.stringify({ status: 500 }));
    }
    const currentUser = await User.findById(currentUserId);
    if (!currentUser) {
      return JSON.parse(JSON.stringify({ status: 500 }));
    }
    if (user.followers.includes(currentUser._id)) {
      user.followers.pull(currentUser._id);
      currentUser.following.pull(user._id);
    } else {
      user.followers.push(currentUser._id);
      currentUser.following.push(user._id);
    }
    await user.save();
    await currentUser.save();
    revalidatePath(`/dashboard/followers`);
    return JSON.parse(JSON.stringify({ status: 200 }));
  } catch (error) {
    return JSON.parse(JSON.stringify({ status: 500 }));
  }
};

export const unFollowUser = async (userId: string, currentUserId: string) => {
  try {
    await connectToDatabase();
    const user = await User.findById(userId);
    if (!user) {
      return JSON.parse(JSON.stringify({ status: 500 }));
    }
    const currentUser = await User.findById(currentUserId);
    if (!currentUser) {
      return JSON.parse(JSON.stringify({ status: 500 }));
    }
    user.followers.pull(currentUser._id);
    currentUser.following.pull(user._id);
    await user.save();
    await currentUser.save();
    revalidatePath(`/dashboard/followers`);
    return JSON.parse(JSON.stringify({ status: 200 }));
  } catch (error) {
    return JSON.parse(JSON.stringify({ status: 500 }));
  }
};

export const getFollowingTags = async (clerkId: string) => {
  try {
    await connectToDatabase();
    const user = await User.findOne({ clerkId }).populate("followedTags");
    if (!user) {
      throw new Error("User not found");
    }
    const tags: ITag[] = user.followedTags;
    return JSON.parse(JSON.stringify({ tags }));
  } catch (error) {
    handleError(error);
  }
};

export const unfollowTag = async (tagId: string, userId: string) => {
  try {
    await connectToDatabase();
    const user = await User.findById(userId);
    if (!user) {
      return JSON.parse(JSON.stringify({ status: 500 }));
    }
    const tagObjId = new mongoose.Types.ObjectId(tagId);
    user.followedTags.pull(tagObjId);
    const tag = await Tag.findById(tagId);
    if (!tag) {
      throw new Error("Tag not found");
    }
    tag.followers.pull(user._id);
    await user.save();
    await tag.save();
    revalidatePath(`/dashboard/following-tags`);
    return JSON.parse(JSON.stringify({ status: 200 }));
  } catch (error) {
    return JSON.parse(JSON.stringify({ status: 500 }));
  }
};
