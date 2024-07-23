"use client";

import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { UploadButton, UploadDropzone } from "@/lib/uploadthing";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createStorySchema } from "@/schemas/story.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormControl, FormItem, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { createStory } from "@/lib/actions/story.actions";

export default function StoryComp() {
    const { user } = useUser();
    const [isOpen, setIsOpen] = useState(false);

    const form = useForm<z.infer<typeof createStorySchema>>({
        resolver: zodResolver(createStorySchema),
        defaultValues: {
            imageUrl: "",
            clerkID: user?.id as string,
        }
    });

    async function onSubmit(data: z.infer<typeof createStorySchema>) {
        let res = await createStory({ data });
        if (res.status === 200) {
            toast({
                variant: "success",
                title: "Success!!",
                description: res.message
            });
            form.reset();
            setIsOpen(false);
        }
        else {
            toast({
                variant: "destructive",
                title: "Error creating story",
                description: res.message
            });
        }
    }

    return <>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <Image
                src={user?.imageUrl as string}
                alt={user?.firstName && user.lastName ? user.firstName[0] + " " + user.lastName[0] : ""}
                width={400}
                height={400}
                className="min-w-16 h-16 rounded-full border-2 object-cover cursor-pointer"
                onClick={() => setIsOpen(true)}
            />
            <p className="absolute bottom-4 left-10 bg-indigo-600 text-white rounded-full cursor-pointer mx-auto text-center w-6 h-6 border-2 border-gray-200 flex justify-center items-center"
                onClick={() => setIsOpen(true)}
            >
                +
            </p>
            <DialogContent className="max-sm:max-w-[95%] rounded-lg">
                <DialogHeader>
                    <DialogTitle>
                        Add to Your Story
                    </DialogTitle>
                    <div>
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-4 overflow-y-scroll scrollbar-hidden w-full max-w-full"
                            >
                                <FormField
                                    control={form.control}
                                    name="imageUrl"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormControl>
                                                <div className="flex flex-col-reverse gap-5 items-start mb-3 mt-2">
                                                    {field.value === "" ? (
                                                        <>
                                                            <UploadButton
                                                                endpoint="imageUploader"
                                                                onClientUploadComplete={(res: any) => {
                                                                    form.setValue("imageUrl", res[0].url);
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
                                                                                        ? "Change Image"
                                                                                        : "Upload Image"}
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
                                                        </>
                                                    )
                                                        :
                                                        <Image
                                                            src={field.value}
                                                            alt="Banner"
                                                            height={4}
                                                            width={20}
                                                            className="h-full sm:h-60 object-contain w-full rounded-lg"
                                                        />
                                                    }
                                                </div>
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
                                        Post Story
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    </>
}