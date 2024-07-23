import { z } from "zod";


export const createStorySchema = z.object({
    clerkID: z
        .string({
            message: "Owner is required",
        })
        .min(6, {
            message: "Un Authorized"
        }),
    imageUrl: z
        .string({
            message: "Image URL is required",
        })
        .min(6, {
            message: "Image URL is required"
        })
});