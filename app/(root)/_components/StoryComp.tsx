"use client";

import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Key, useEffect, useState } from "react";
import { UploadButton, UploadDropzone } from "@/lib/uploadthing";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createStorySchema } from "@/schemas/story.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormControl, FormItem, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { createStory, deleteStory } from "@/lib/actions/story.actions";
import { ArrowUpToLineIcon, CloudUploadIcon, EyeIcon, MoveLeftIcon, MoveRightIcon, Trash2Icon } from "lucide-react";
import { imageRemove } from "@/lib/image";
import { AlertDialog, AlertDialogContent, AlertDialogTrigger, AlertDialogTitle, AlertDialogCancel, AlertDialogDescription, AlertDialogHeader, AlertDialogFooter, AlertDialogAction } from "@/components/ui/alert-dialog";
import moment from "moment";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IPopulatedStoryCurrentUser } from "@/types/story";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { useRouter } from "next/navigation";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";

export default function CreateStoryComp({ userStoriesData }: { userStoriesData: IPopulatedStoryCurrentUser[] }) {
    const { user } = useUser();
    const [isOpen, setIsOpen] = useState(false);
    const [uploadingMessage, setUploadingMessage] = useState("");
    const [imageKey, setImageKey] = useState("");
    const [showUserStories, setShowUserStories] = useState(false);
    const [currentStory, setCurrentStory] = useState(0);
    const [progress, setProgress] = useState(0);
    const [stopProgress, setStopProgress] = useState(false);
    const router = useRouter();

    const form = useForm<z.infer<typeof createStorySchema>>({
        resolver: zodResolver(createStorySchema),
        defaultValues: {
            imageUrl: "",
            imageKey: "",
        }
    });

    async function onSubmit(data: z.infer<typeof createStorySchema>) {
        let res = await createStory({ data });
        if (res.status === 200) {
            toast({
                variant: "default",
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

    useEffect(() => {
        if (!stopProgress) {
            let timer: any;
            if (progress < 100) {
                timer = setTimeout(() => setProgress(progress + 6.7), 1000);
            }
            if (progress >= 100) {
                if (currentStory < userStoriesData.length - 1) {
                    setCurrentStory(currentStory + 1);
                }
                if (currentStory === userStoriesData.length - 1) {
                    setCurrentStory(0);
                }
                setProgress(0);
            }
            return () => clearTimeout(timer);
        }
    }, [progress, stopProgress]);

    return <>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <Image
                src={user?.imageUrl as string}
                alt={user?.firstName && user.lastName ? user.firstName[0] + " " + user.lastName[0] : ""}
                width={400}
                height={400}
                className={` min-w-16 h-16 rounded-full border-2 object-cover p-1
                    ${userStoriesData.length > 0 ? "border-indigo-500 cursor-pointer" : ""}
                    `}
                onClick={(e) => {
                    e.preventDefault();
                    if (userStoriesData.length > 0) {
                        setShowUserStories(true);
                    }
                }}
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
                                    name="imageKey"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormControl>
                                                <input
                                                    type="hidden"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
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
                                                                    form.setValue("imageKey", res[0].key);
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
                                                        variant: "default",
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
                                        className="bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
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
        {showUserStories && <Dialog open={showUserStories} onOpenChange={setShowUserStories} >
            <DialogContent className="max-h-[85vh] p-0 m-0 rounded max-sm:max-w-[90%] border-collapse border-none flex flex-col gap-0">
                <DialogHeader className="m-0 p-0 bg-gray-200 z-50">
                    <div className="bg-blue-600 h-1" style={{
                        width: `${progress}%`
                    }}></div>
                </DialogHeader>
                <Image
                    src={userStoriesData[currentStory].imageUrl}
                    alt={`Story ${currentStory}`}
                    width={400}
                    height={400}
                    className="h-[40rem] w-full rounded"
                    onClick={(e) => {
                        e.preventDefault();
                        setStopProgress(!stopProgress);
                    }}
                    onDoubleClick={(e) => {
                        e.preventDefault();
                        setStopProgress(!stopProgress);
                    }}
                    onClickCapture={(e) => {
                        e.preventDefault();
                        setStopProgress(!stopProgress);
                    }}
                    onDragCapture={(e) => {
                        e.preventDefault();
                        setStopProgress(!stopProgress);
                    }}
                />
                <span className="flex flex-row items-center gap-2 p-2 pr-3 bg-white/85 text-black w-fit rounded-br-2xl absolute top-0">
                    <Avatar>
                        <AvatarImage
                            src={userStoriesData[currentStory]?.owner.profilePicture}
                            alt={userStoriesData[currentStory]?.owner.firstName + userStoriesData[currentStory]?.owner.lastName}
                        />
                        <AvatarFallback>
                            {userStoriesData[currentStory]?.owner.firstName[0] + userStoriesData[currentStory]?.owner.lastName[0]}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        You
                        <span className="text-xs text-gray-500">
                            {moment(userStoriesData[currentStory]?.createdAt).fromNow()}
                        </span>
                    </div>
                </span>
                <MoveLeftIcon
                    className={` h-6 w-6 text-white border-2 border-white rounded-full bg-gray-900 bg-opacity-50 p-1 hover:bg-opacity-75 absolute transform md:-translate-x-20 -translate-y-1/2 top-1/2 disabled:opacity-50 translate-x-4
                        ${currentStory > 0 ? "cursor-pointer" : "cursor-not-allowed"}
                                `}
                    onClick={(e) => {
                        e.preventDefault();
                        currentStory > 0 && setCurrentStory(currentStory - 1);
                        currentStory > 0 && setProgress(0);
                    }}
                    aria-disabled={currentStory === 0}
                />
                <MoveRightIcon
                    className={` h-6 w-6 text-white border-2 border-white rounded-full bg-gray-900 bg-opacity-50 p-1 hover:bg-opacity-75 absolute transform md:translate-x-[35rem] -translate-y-1/2 top-1/2 disabled:opacity-50 translate-x-[20rem]
                        ${currentStory < userStoriesData.length - 1 ? "cursor-pointer" : "cursor-not-allowed"}
                                `}
                    onClick={(e) => {
                        e.preventDefault();
                        currentStory < userStoriesData.length - 1 && setCurrentStory(currentStory + 1); currentStory < userStoriesData.length - 1 && setProgress(0);
                    }}
                    aria-disabled={currentStory === userStoriesData.length - 1}
                />
                <AlertDialog>
                    <AlertDialogTrigger asChild className="absolute top-2 right-12 text-red-600 border border-red-600 rounded-full p-1 bg-white bg-opacity-50 hover:bg-opacity-75 hover:text-red-700 cursor-pointer">
                        <Trash2Icon className="h-8 w-8" />
                    </AlertDialogTrigger>
                    <AlertDialogContent className="max-sm:max-w-[95%] rounded-xl">
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Are you sure, you want to delete this story?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your
                                story from the server.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel
                                className="bg-red-500 hover:bg-red-600 text-white hover:text-white"
                            >Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                className="bg-indigo-600 hover:bg-indigo-700 text-white hover:text-white"
                                onClick={async (e) => {
                                    e.preventDefault();
                                    let res = await deleteStory({ storyId: userStoriesData[currentStory]._id as unknown as string });
                                    if (res.status === 200) {
                                        toast({
                                            variant: "default",
                                            title: "Success!!",
                                            description: res.message
                                        });
                                        setShowUserStories(false);
                                    }
                                    else {
                                        toast({
                                            variant: "destructive",
                                            title: "Error deleting story",
                                            description: res.message
                                        });
                                        setShowUserStories(false);
                                    }
                                }}
                            >Yes</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                <DialogFooter className="bg-white w-fit h-fit p-1 rounded-lg m-0 absolute bottom-6 hover:bg-white/70 cursor-pointer left-40 sm:left-60">
                    <Drawer>
                        <DrawerTrigger className="flex flex-row items-center justify-center gap-2 px-2 py-1">
                            <EyeIcon className="h-6 w-6" />
                            {userStoriesData[currentStory].views.length}
                        </DrawerTrigger>
                        <DrawerContent className="sm:w-96 mx-auto">
                            <div className="max-h-60 overflow-y-auto">
                                {userStoriesData[currentStory]?.views?.length <= 0 && <div className="flex flex-row items-center gap-2 p-2">
                                    No views yet
                                </div>}
                                {userStoriesData[currentStory]?.views?.map((view, index) => (
                                    <div key={index} className="flex flex-row items-center gap-2 p-2">
                                        <Avatar>
                                            <AvatarImage
                                                src={view.user.profilePicture}
                                                alt={view.user.firstName + view.user.lastName}
                                                onClick={() => router.push(`/user/${view.user._id}`)}
                                            />
                                            <AvatarFallback>
                                                {view.user.firstName[0] + view.user.lastName[0]}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <Link href={`/user/${view.user._id}`} className="text-sm font-semibold text-gray-800">
                                                {view.user.firstName} {view.user.lastName}
                                            </Link>
                                            <span className="text-xs text-gray-500">
                                                viewed {moment(view.createdAt).fromNow()}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </DrawerContent>
                    </Drawer>
                </DialogFooter>
            </DialogContent>
        </Dialog>}
    </>
}