"use client";

import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { UploadButton, UploadDropzone } from "@/lib/uploadthing";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createStorySchema } from "@/schemas/story.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormControl, FormItem, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { createStory } from "@/lib/actions/story.actions";
import { ArrowUpToLineIcon, CloudUploadIcon, Trash2Icon } from "lucide-react";
import { imageRemove } from "@/lib/image";

export default function CreateStoryComp() {
    const { user } = useUser();
    const [isOpen, setIsOpen] = useState(false);
    const [uploadingMessage, setUploadingMessage] = useState("");
    const [imageKey, setImageKey] = useState("");

    const form = useForm<z.infer<typeof createStorySchema>>({
        resolver: zodResolver(createStorySchema),
        defaultValues: {
            imageUrl: "",
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
            setUploadingMessage("");
            setImageKey("");
        }
        else {
            setUploadingMessage("");
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
                                                            <UploadDropzone
                                                                endpoint="imageUploader"
                                                                className="w-full h-60 sm:h-96 rounded-lg border-2 border-dashed border-gray-300 flex justify-center items-center cursor-pointer hover:border-indigo-600 focus:border-indigo-600 focus:border-dashed active:border-indigo-600 active:border-dashed focus-visible:border-indigo-600 focus-visible:border-dashed relative"
                                                                appearance={{
                                                                    uploadIcon: "h-10 w-10 text-indigo-500 hover:text-indigo-600 cursor-pointer",
                                                                    button: "bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-50 rounded-lg px-4 py-2",
                                                                    allowedContent: "text-gray-500 text-sm font-medium mt-2 text-center w-full max-w-full whitespace-nowrap overflow-hidden overflow-ellipsis animate-pulse",
                                                                    label: "text-gray-500 text-sm font-medium mt-2 text-center w-full max-w-full whitespace-nowrap overflow-hidden overflow-ellipsis text-center text-xl",
                                                                }}
                                                                onClientUploadComplete={(res) => {
                                                                    form.setValue("imageUrl", res[0].url);
                                                                    setImageKey(res[0].key);
                                                                }}
                                                                onUploadError={(err: any) => {
                                                                    form.setError("imageUrl", { message: err.message });
                                                                }}
                                                                content={{
                                                                    uploadIcon: <CloudUploadIcon
                                                                        className="h-10 w-10 text-indigo-500 hover:text-indigo-600 cursor-pointer"
                                                                    />,
                                                                    label: "Upload Image",
                                                                    allowedContent: "Images Only",
                                                                }}
                                                                onUploadBegin={(fileName) => {
                                                                    setUploadingMessage(`Uploading ${fileName}...`);
                                                                }}
                                                            />
                                                            {uploadingMessage && <DialogDescription>{uploadingMessage}</DialogDescription>}
                                                        </>)
                                                        :
                                                        <Image
                                                            src={field.value}
                                                            alt="Banner"
                                                            height={4}
                                                            width={20}
                                                            className="h-[70vh] block object-contain w-full rounded-lg"
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
                                        onClick={async (e) => {
                                            e.preventDefault();
                                            imageKey !== "" && await imageRemove(imageKey).then((res) => {
                                                if (res.status === 200) {
                                                    toast({
                                                        variant: "success",
                                                        title: "Success!!",
                                                        description: res.message
                                                    });
                                                    setImageKey("");
                                                }
                                                else {
                                                    toast({
                                                        variant: "destructive",
                                                        title: "Error deleting image",
                                                        description: res.message
                                                    });
                                                    setImageKey("");
                                                }
                                            });
                                            setUploadingMessage("");
                                            form.reset();
                                        }}
                                    >
                                        <Trash2Icon className="h-5 w-5" />
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="primary"
                                        className="w-fit"
                                        onClick={form.handleSubmit(onSubmit)}
                                    >
                                        <ArrowUpToLineIcon className="h-5 w-5" />
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