import { z } from "zod";

export const createPostSchema = z.object({
    author: z.string().optional(),
    title: z
        .string({
            message: "Title is required"
        })
        .min(5, {
            message: "Title must be at least 5 characters"
        }),
    content: z
        .string({
            message: "Content is required"
        })
        .min(10, {
            message: "Content must be at least 10 characters"
        }),
    tags: z.array(z.string({
        message: "Tags must be an array of strings"
    })).optional(),
    community: z.string({
        message: "Community must be a string"
    }).optional(),
});