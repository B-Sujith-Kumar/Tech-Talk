import { z } from "zod";


export const createStorySchema = z.object({
    imageUrl: z
        .string({
            message: "Image is required",
        })
        .min(6, {
            message: "Image is required"
        }),
    imageKey: z
        .string({
            message: "Image key is required",
        })
        .min(6, {
            message: "Image key is required"
        }),
});