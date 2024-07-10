"use server"
import { createUserType, updateUserType } from "@/types";
import User, { IUser } from "../database/models/user.model";
import { handleError } from "../utils";
import { connectToDatabase } from "../database";
import { revalidatePath } from "next/cache";
import { isAuth } from "../auth";
import { currentUser } from "@clerk/nextjs/server";
import Community from "../database/models/community.model";

export const createUser = async (user: createUserType) => {
    try {
        await connectToDatabase();
        const newUser = User.create(user);
        return JSON.parse(JSON.stringify(newUser));
    } catch (error) {
        handleError(error);
    }
}

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
}

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
}

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
}

export async function getCommunitiesJoinedByUser() {
    let auth = await isAuth();
    if (!auth) return { status: 500, message: "User not authenticated" };
    try {
        await connectToDatabase();
        const user = await currentUser();
        const data = await Community.find({ members: user?.publicMetadata?.userId });
        return { status: 200, data: JSON.parse(JSON.stringify(data)) };
    }
    catch (error: any) {
        return { status: 500, message: error.message };
    }
}