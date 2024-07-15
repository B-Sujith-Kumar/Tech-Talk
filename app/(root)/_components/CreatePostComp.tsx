"use client";

import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createPostSchema } from "@/schemas/post.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormField,
    FormItem,
    FormMessage,
    FormControl,
} from "@/components/ui/form";
import TextBox from "@/components/shared/TextBox/TextBox";
import { Key, useState } from "react";
import { UploadButton } from "@/lib/uploadthing";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { ICommunity } from "@/lib/database/models/community.model";
import { useToast } from "@/components/ui/use-toast";
import { createPost } from "@/lib/actions/post.action";

export const CreatePost = ({ communities }: { communities: ICommunity[] }) => {
    const [clearForm, setClearForm] = useState(false);
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState<string>("");
    const { toast } = useToast();

    const form = useForm<z.infer<typeof createPostSchema>>({
        resolver: zodResolver(createPostSchema),
        defaultValues: {
            title: "",
            coverImage: "",
            content: "",
            tags: tags,
            community: "",
        },
    });
    async function onSubmit(data: z.infer<typeof createPostSchema>) {
        let res = await createPost({
            title: data.title,
            content: data.content,
            tags: data.tags,
            community: data.community,
            coverImage: data.coverImage,
        });
        if (res.status === 200) {
            toast({
                title: "Success",
                description: res.message,
            });
            form.reset();
            setClearForm(true);
            setTags([]);
            setTagInput("");
        } else {
            toast({
                title: "Error",
                description: res.message,
                variant: "destructive",
            });
            form.reset();
            setClearForm(true);
            setTags([]);
            setTagInput("");
        }
    }

    function addTag() {
        if (tags.includes(tagInput)) {
            toast({
                title: "Error",
                description: "Tag already exists.",
                variant: "destructive",
            });
            setTagInput("");
            return;
        }
        if (tags.length < 4 && tagInput.trim() !== "") {
            form.setValue("tags", [
                ...tags,
                "#" + tagInput.trim().replaceAll(" ", "-").toLowerCase(),
            ]);
            setTags((prev) => [
                ...prev,
                "#" + tagInput.trim().replaceAll(" ", "-").toLowerCase(),
            ]);
            setTagInput("");
            return;
        }
        if (tagInput.trim() === "") {
            toast({
                title: "Error",
                description: "Tag cannot be empty.",
                variant: "destructive",
            });
            return;
        } else {
            toast({
                title: "Error",
                description: "You can only add upto 4 tags.",
                variant: "destructive",
            });
            return;
        }
    }

    return (
        <>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4 px-6 max-sm:px-2 overflow-y-scroll scrollbar-hidden w-full max-w-full"
                >
                    <FormField
                        control={form.control}
                        name="coverImage"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormControl>
                                    <div className="flex flex-col-reverse gap-5 items-start mb-3 mt-2">
                                        <UploadButton
                                            endpoint="imageUploader"
                                            onClientUploadComplete={(res: any) => {
                                                form.setValue("coverImage", res[0].url);
                                            }}
                                            appearance={{
                                                button:
                                                    "bg-indigo-600 hover:bg-indigo-700 text-white rounded-md p-2 w-fit text-center cursor-pointer h-10",
                                            }}
                                            content={{
                                                button({
                                                    ready,
                                                    isUploading,
                                                }: {
                                                    ready: boolean;
                                                    isUploading: boolean;
                                                }) {
                                                    if (ready && !isUploading)
                                                        return (
                                                            <div className="">
                                                                {field.value !== ""
                                                                    ? "Change"
                                                                    : "Add a cover image"}
                                                            </div>
                                                        );
                                                    if (isUploading) return <div>Uploading</div>;
                                                },
                                                allowedContent({
                                                    ready,
                                                    fileTypes,
                                                    isUploading,
                                                }: {
                                                    ready: boolean;
                                                    fileTypes: string[];
                                                    isUploading: boolean;
                                                }) {
                                                    if (!ready) return "";
                                                    if (ready) return "";
                                                    if (isUploading) return "";
                                                },
                                            }}
                                        />
                                        {field.value && (
                                            <Image
                                                src={field.value}
                                                alt="Banner"
                                                height={4}
                                                width={20}
                                                className="h-40 object-cover w-full rounded-lg"
                                            />
                                        )}
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
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
                                        className="block w-full placeholder:text-gray-500 text-3xl disabled:cursor-not-allowed disabled:bg-gray-300 disabled:opacity-50 peer placeholder-transparent border-none focus:outline-none font-semibold"
                                        autoFocus={true}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="tags"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormControl>
                                    <>
                                        <div className="flex flex-wrap gap-2">
                                            {tags.map((tag, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center gap-2 bg-gray-200 rounded-md p-2"
                                                >
                                                    <span className="text-sm">{tag}</span>
                                                    <FontAwesomeIcon
                                                        icon={faCircleXmark}
                                                        className="text-red-500 cursor-pointer"
                                                        onClick={() => {
                                                            setTags((prev) =>
                                                                prev.filter((_, i) => i !== index)
                                                            );
                                                        }}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="Add upto 4 tags..."
                                                className="block w-full placeholder:text-gray-500 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:opacity-50 peer placeholder-transparent border-none focus:outline-none"
                                                {...field}
                                                value={tagInput}
                                                onChange={(e) => {
                                                    setTagInput(e.target.value);
                                                }}
                                            />
                                            <Button
                                                type="button"
                                                variant="primary"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    addTag();
                                                }}
                                            >
                                                Add Tag
                                            </Button>
                                        </div>
                                    </>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="community"
                        render={({ field }) => (
                            <FormItem>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value as any}
                                >
                                    <FormControl>
                                        <SelectTrigger className="flex w-fit gap-2 bg-white border-none focus:ring-0 focus:border-none focus:ring-offset-0 focus:ring-opacity-0 focus:border-transparent focus:border-collapse active:border-collapse px-0">
                                            <SelectValue
                                                placeholder="Post to?"
                                                className="font-semibold"
                                            />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="bg-white">
                                        <SelectItem value="public">Public</SelectItem>
                                        <SelectGroup>
                                            <SelectLabel>Communities</SelectLabel>
                                            {communities?.map((community) => (
                                                <SelectItem
                                                    key={community._id as any as Key}
                                                    value={(community?._id as any).toString()}
                                                >
                                                    {community.name}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl className="max-w-full">
                                    <TextBox
                                        description="Write your post content here..."
                                        onValueChange={field.onChange}
                                        clearText={clearForm}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex justify-between">
                        <Button
                            type="reset"
                            variant="destructive"
                            className="w-fit"
                            onClick={(e) => {
                                e.preventDefault();
                                form.reset();
                                setClearForm(true);
                                setTags([]);
                                setTagInput("");
                            }}
                        >
                            Clear Form
                        </Button>
                        <Button
                            type="button"
                            variant="primary"
                            className="w-fit"
                            onClick={form.handleSubmit(onSubmit)}
                        >
                            Share Post
                        </Button>
                    </div>
                </form>
            </Form>
        </>
    );
};
