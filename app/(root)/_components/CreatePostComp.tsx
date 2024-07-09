"use client";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AtSignIcon, HashIcon, ImageUpIcon, PaperclipIcon, VideoIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createPostSchema } from "@/schemas/post.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormMessage, FormControl, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import TextBox from "@/components/shared/TextBox/TextBox";
import { useState } from "react";

export const CreatePost = () => {
    const [clearForm, setClearForm] = useState(false);
    const form = useForm<z.infer<typeof createPostSchema>>({
        resolver: zodResolver(createPostSchema),
        defaultValues: {
            title: "",
            content: "",
            tags: [],
            community: "",
        }
    });
    async function onSubmit(data: z.infer<typeof createPostSchema>) {
        console.log(data);
    }

    return <>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 overflow-y-scroll scrollbar-hidden">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormControl>
                                <input
                                    {...field}
                                    type="text"
                                    placeholder="New post title here..."
                                    className="block w-full placeholder:text-gray-500 text-2xl disabled:cursor-not-allowed disabled:bg-gray-300 disabled:opacity-50 peer placeholder-transparent border-none focus:outline-none"
                                    autoFocus={true}
                                />

                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <TextBox
                                    description="Write your post content here..." onValueChange={field.onChange}
                                    clearText={clearForm}
                                    {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex gap-4">
                    <Button
                        type="reset"
                        variant="destructive"
                        className="w-full"
                        onClick={(e) => {
                            e.preventDefault();
                            form.reset();
                            setClearForm(true);
                        }}
                    >
                        Clear Post
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        className="w-full"
                    >
                        Share Post
                    </Button>
                </div>
            </form>
        </Form>

    </>
}