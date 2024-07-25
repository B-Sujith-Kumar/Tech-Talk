"use client";

import Image from "next/image";
import { DialogContent, Dialog, DialogHeader } from "@/components/ui/dialog";
import { MoveLeftIcon, MoveRightIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { IPopulatedStory } from "@/types/story";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import moment from "moment";
import Link from "next/link";
import { viewStory } from "@/lib/actions/story.actions";

export default function ViewStoryComp({ userStoriesData }: {
    userStoriesData: IPopulatedStory[];
}) {
    const [currentStory, setCurrentStory] = useState(0);
    const [presentStory, setPresentStory] = useState({} as IPopulatedStory);
    const [progress, setProgress] = useState(0);
    const [stopProgress, setStopProgress] = useState(false);
    const [open, setOpen] = useState(false);
    const [updateView, setUpdateView] = useState(false);

    useEffect(() => {
        if (!stopProgress) {
            let timer: any;
            if (progress < 100) {
                timer = setTimeout(() => setProgress(progress + 6.7), 1000);
            }
            if (progress >= 100) {
                if (currentStory < userStoriesData.length - 1) {
                    setCurrentStory(currentStory + 1);
                    ; (async () => {
                        updateView && await viewStory({
                            storyId: userStoriesData[currentStory + 1]._id
                        });
                    })();
                }
                if (currentStory === userStoriesData.length - 1) {
                    setCurrentStory(0);
                    ; (async () => {
                        updateView && await viewStory({
                            storyId: userStoriesData[0]._id
                        });
                    })();
                }
                setProgress(0);
            }
            return () => clearTimeout(timer);
        }
    }, [progress, stopProgress]);

    return <>
        <div className="flex flex-row items-center gap-x-4 overflow-x-scroll scrollbar-hidden bg-white rounded-md">
            {userStoriesData?.map((story: IPopulatedStory, i) => (
                <div key={i} className="flex flex-col items-center w-16 relative">
                    <Image
                        src={story.owner.profilePicture}
                        alt={story.owner.firstName[0] + story.owner.lastName[0]}
                        width={400}
                        height={400}
                        className={` min-w-16 h-16 rounded-full border-2 object-cover cursor-pointer p-1
                                ${!story.isViewed ? "border-indigo-500" : ""}
                                `}
                        onClick={async (e) => {
                            e.preventDefault();
                            setPresentStory(story);
                            setCurrentStory(i);
                            setOpen(true);
                            setUpdateView(true);
                            await viewStory({
                                storyId: story._id
                            });
                            setUpdateView(false);
                        }}
                    />
                    <Link className="text-xs mt-1"
                        href={`/user/${story.owner._id}`}
                    >
                        {story.owner.username.trim().length > 5 ? story.owner.username.trim().slice(0, 5) + "..." : story.owner.username.trim()}
                    </Link>
                </div>
            ))}
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-h-[85vh] p-0 m-0 rounded max-sm:max-w-[90%] border-collapse border-none flex flex-col gap-0">
                <DialogHeader className="m-0 p-0 bg-gray-200 z-50">
                    <div className="bg-blue-600 h-1" style={{
                        width: `${progress}%`
                    }}></div>
                </DialogHeader>
                <Image
                    src={userStoriesData[currentStory]?.imageUrl}
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
                <span className="flex flex-row items-center gap-2 p-2 bg-white text-black w-fit rounded-br-xl absolute top-0">
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
                        <span className="text-sm font-medium flex flex-row gap-1 items-center">
                            <Link href={`/user/${userStoriesData[currentStory]?.owner._id}`}>
                                {userStoriesData[currentStory]?.owner.firstName + " " + userStoriesData[currentStory]?.owner.lastName}
                                <span className="text-xs text-gray-600">
                                    @{userStoriesData[currentStory]?.owner.username}
                                </span>
                            </Link>
                        </span>
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
                        currentStory < userStoriesData.length - 1 && setCurrentStory(currentStory + 1);
                        currentStory < userStoriesData.length - 1 && setProgress(0);
                    }}
                    aria-disabled={currentStory === userStoriesData.length - 1}
                />
            </DialogContent>
        </Dialog>
    </>
}