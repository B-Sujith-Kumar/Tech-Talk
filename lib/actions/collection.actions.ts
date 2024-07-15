"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../database";
import Collection from "../database/models/collection.model";
import mongoose from "mongoose";

export const createCollection = async (
  name: string,
  description: string,
  userId: string
) => {
  try {
    await connectToDatabase();
    const collection = await Collection.create({
      name,
      description,
      creator: userId,
    });
    revalidatePath("/bookmarks");
    return JSON.parse(JSON.stringify({ collection, status: 200 }));
  } catch (error) {
    console.log(error);
    return JSON.parse(JSON.stringify({ error, status: 500 }));
  }
};

export const getCollections = async (userId: string) => {
  try {
    await connectToDatabase();
    const collections = await Collection.find({ creator: userId }).populate(
      "posts"
    );
    return JSON.parse(JSON.stringify(collections));
  } catch (error) {
    console.log(error);
    return JSON.parse(JSON.stringify({ error, status: 500 }));
  }
};

export const getCollection = async (id: string) => {
  try {
    await connectToDatabase();
    const collection = await Collection.findById(id).populate({
      path: "posts",
      populate: [
        {
          path: "author",
          model: "User",
        },
        {
          path: "tags",
          model: "Tag",
        },
      ],
    });
    return JSON.parse(JSON.stringify(collection));
  } catch (error) {
    console.log(error);
    return JSON.parse(JSON.stringify({ error, status: 500 }));
  }
};

export const savePostToCollections = async (
  postId: string,
  collectionIds: string[],
  userId: string
) => {
  try {
    await connectToDatabase();
    const userCollections = await Collection.find({ creator: userId });
    for (const collection of userCollections) {
      if (collection.posts.includes(postId)) {
        collection.posts = collection.posts.filter(
          (id: mongoose.Schema.Types.ObjectId) => id.toString() !== postId
        );
        await collection.save();
      }
    }
    for (const collectionId of collectionIds) {
      const collection = await Collection.findById(collectionId);
      if (collection && !collection.posts.includes(postId)) {
        collection.posts.push(postId);
        await collection.save();
      }
    }
    revalidatePath("/bookmarks");
    return JSON.parse(JSON.stringify({ status: 200 }));
  } catch (error) {
    console.log(error);
    return JSON.parse(JSON.stringify({ error, status: 500 }));
  }
};

export const getCollectionsOfPost = async (postId: string, userId: string) => {
  try {
    await connectToDatabase();
    const collections = await Collection.find({
      creator: userId,
      posts: postId,
    });
    return JSON.parse(JSON.stringify({ collections }));
  } catch (error) {
    console.log(error);
    return JSON.parse(JSON.stringify({ error, status: 500 }));
  }
};

export const deleteCollection = async (collectionId: string) => {
    try {
        await connectToDatabase();
        await Collection.findByIdAndDelete(collectionId);
        revalidatePath("/bookmarks");
        return JSON.parse(JSON.stringify({ status: 200 }));
    } catch (error) {
        console.log(error);
        return JSON.parse(JSON.stringify({ error, status: 500 }));
    }
}

export const updateCollection = async (
    collectionId: string,
    name: string,
    description: string
) => {
    try {
        await connectToDatabase();
        await Collection.findByIdAndUpdate(collectionId, { name, description });
        revalidatePath(`/collection/${collectionId}`);
        return JSON.parse(JSON.stringify({ status: 200 }));
    } catch (error) {
        console.log(error);
        return JSON.parse(JSON.stringify({ error, status: 500 }));
    }
}