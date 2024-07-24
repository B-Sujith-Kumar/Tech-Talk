import { z } from "zod";


export const createStorySchema = z.object({
    imageUrl: z
        .string({
            message: "Image is required",
        })
        .min(6, {
            message: "Image is required"
        })
});