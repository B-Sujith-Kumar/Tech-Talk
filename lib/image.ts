"use server";

import { UTApi } from "uploadthing/server";

export const imageRemove = async (imageKey: string) => {
    try {
        const utapi = new UTApi();
        await utapi.deleteFiles(imageKey);
        return { status: 200, message: "Image Deleted successfully" };
    }
    catch (error: any) {
        return { status: 500, message: error.message };
    }
}