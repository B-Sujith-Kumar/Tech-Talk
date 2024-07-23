import { z } from "zod";

export const createPostSchema = z.object({
    author: z
        .string()
        .optional(),
    title: z
        .string({
            message: "Title is required"
        })
        .min(5, {
            message: "Title must be at least 5 characters"
        }),
    coverImage: z
        .string({
            message: "Cover image is required"
        })
        .url({
            message: "Cover image must be a valid URL"
        }),
    content: z
        .string({
            message: "Content is required"
        })
        .min(10, {
            message: "Content must be at least 10 characters"
        }),
    tags: z
        .array(z.string({
            message: "Tags must be strings"
        }))
        .min(1, {
            message: "At least one tag is required"
        })
        .max(4, {
            message: "At most 4 tags are allowed"
        }),
    community: z.string({
        message: "Where to post is required"
    }),
});