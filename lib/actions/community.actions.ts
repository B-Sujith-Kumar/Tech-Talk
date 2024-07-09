"use server";

import User, { IUser } from "../database/models/user.model";
import Community, { ICommunity } from "../database/models/community.model";
import Tag from "../database/models/tag.model";
import { createCommunityType } from "@/types";
import { connectToDatabase } from "../database";

export const createCommunity = async (data: createCommunityType) => {
    try {
        await connectToDatabase();
        const user: IUser | null = await User.findOne({ clerkId: data.createdBy });
        if (!user) {
            return JSON.parse(JSON.stringify({ error: "User not found", success: false }));
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
        return JSON.parse(JSON.stringify({ communityId: community._id, success: true }));
    } catch (error) {
        console.log(error);
        return JSON.parse(JSON.stringify({ error, success: true }));
    }
};
