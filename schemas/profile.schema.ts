import * as z from "zod";

export const profileSchema = z.object({
    username: z.string({ message: "Username is required" }).trim().min(3, { message: "Username must be at least 3 characters" }),
    email: z.string().email({ message: "Invalid email address" }).trim(),
    firstName: z.string({ message: "First name is required" }).min(1, { message: "First name must be at least 1 characters" }),
    lastName: z.string({ message: "Last name is required" }).min(1, { message: "Last name must be at least 1 characters" }),
    profilePicture: z.string({ message: "Profile picture is required" }),
    githubLink: z.string().url().optional().or(z.literal('')),
    linkedinLink: z.string().url().optional().or(z.literal('')),
    location: z.string().trim().optional(),
    bio: z.string().trim().optional(),
    websiteUrl: z.string().url().optional().or(z.literal('')),
    skills: z.string().trim().optional(),
    work: z.string().trim().max(80, { message: "" }).optional(),
    education: z.string().trim().max(80, { message: "" }).optional(),
    currentlyLearning: z.string().trim().optional(),
    availableFor: z.string().trim().optional(),
})