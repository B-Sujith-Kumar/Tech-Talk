"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../database";
import Collection from "../database/models/collection.model";

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
