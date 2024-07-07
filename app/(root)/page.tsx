import { auth, currentUser } from "@clerk/nextjs";
import { Stories } from "./stories";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AtSignIcon, HashIcon, ImageUpIcon, PaperclipIcon, VideoIcon } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Dialog, DialogTrigger, DialogContent, DialogDescription, DialogTitle, DialogHeader } from "@/components/ui/dialog";


export default async function Home() {
    const { userId } = auth();
    const user = await currentUser();
    return (
        <>
            {userId && <Stories />}
            {userId && <div className="bg-white rounded-md mt-2 p-2">
                <div className="flex flex-row gap-x-4 items-center">
                    <Avatar>
                        <AvatarImage src={user?.imageUrl} alt={user?.firstName ? user.firstName[0] : ""} />
                        <AvatarFallback>
                            {user?.firstName && user?.lastName}
                        </AvatarFallback>
                    </Avatar>
                    <Dialog>
                        <DialogTrigger className="w-full">
                            <textarea
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:opacity-50 peer placeholder-transparent h-8 scrollbar-hidden bg-gray-100"
                                placeholder="What's on your mind?"
                                name="comment"
                                required
                                minLength={5}
                            />
                        </DialogTrigger>
                        <DialogContent className="bg-white rounded-md overflow-auto scrollbar-hidden">
                            <DialogHeader>
                                <DialogTitle>
                                    <div className="flex flex-row items-center justify-start gap-2 w-full px-2">
                                        <Avatar>
                                            <AvatarImage src={user?.imageUrl as string}
                                                className="rounded-full border-2 border-gray-400 w-16 h-auto"
                                            />
                                            <AvatarFallback>
                                                {user?.firstName && user?.lastName}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col ml-2 space-y-1 mb-2">
                                            <span className="text-base font-medium">
                                                {user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : ""}
                                            </span>
                                            <span className="text-xs">
                                                <Select>
                                                    <SelectTrigger className="bg-white text-gray-600 border-none h-2">
                                                        <SelectValue placeholder="Public" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-white text-gray-600 border-none">
                                                        <SelectGroup>
                                                            <SelectLabel>
                                                                Who can see this?
                                                            </SelectLabel>
                                                            <SelectItem value="public">Public</SelectItem>
                                                            <SelectItem value="private">Private</SelectItem>
                                                        </SelectGroup>
                                                        <SelectGroup>
                                                            <SelectLabel>
                                                                Communities
                                                            </SelectLabel>
                                                            <SelectItem value="JS Developers">
                                                                JS Developers
                                                            </SelectItem>
                                                            <SelectItem value="React Developers">
                                                                React Developers
                                                            </SelectItem>
                                                            <SelectItem value="Next.js Developers">
                                                                Next.js Developers
                                                            </SelectItem>
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            </span>
                                        </div>
                                    </div>
                                </DialogTitle>
                                <DialogDescription>
                                    <textarea
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:opacity-50 peer placeholder-transparent h-60 scrollbar-hidden bg-gray-100"
                                        placeholder="What's on your mind?"
                                        name="comment"
                                        required
                                        minLength={5}
                                    />
                                    <div className="mt-4">
                                        <div className="flex flex-row gap-6 *:flex *:flex-row *:gap-2 *:items-center *:cursor-pointer">
                                            <div>
                                                <ImageUpIcon className="w-4 h-4 text-blue-500" />
                                                <span className="text-xs">Image/Video</span>
                                            </div>
                                            <div>
                                                <PaperclipIcon className="w-4 h-4 text-yellow-500" />
                                                <span className="text-xs">Attachment</span>
                                            </div>
                                            <div>
                                                <VideoIcon className="w-4 h-4 text-red-500" />
                                                <span className="text-xs">Live</span>
                                            </div>
                                            <div>
                                                <HashIcon className="w-4 h-4 text-green-500" />
                                                <span className="text-xs">Tags</span>
                                            </div>
                                            <div>
                                                <AtSignIcon className="w-4 h-4 text-gray-500" />
                                                <span className="text-xs">Mention</span>
                                            </div>
                                        </div>
                                    </div>
                                    <Button type="submit" variant="primary" className="w-full h-8 mt-4" >
                                        Share Post
                                    </Button>
                                </DialogDescription>
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>
                    <Button type="submit" variant="primary" className="w-fit h-8" >
                        Share Post
                    </Button>
                </div>
                <hr className="mt-2" />
                <div className="px-2 overflow-auto scrollbar-hidden">
                    <div className="flex flex-row gap-6 *:flex *:flex-row *:gap-2 *:items-center *:cursor-pointer">
                        <div>
                            <ImageUpIcon className="w-4 h-4 text-blue-500" />
                            <span className="text-xs">Image/Video</span>
                        </div>
                        <div>
                            <PaperclipIcon className="w-4 h-4 text-yellow-500" />
                            <span className="text-xs">Attachment</span>
                        </div>
                        <div>
                            <VideoIcon className="w-4 h-4 text-red-500" />
                            <span className="text-xs">Live</span>
                        </div>
                        <div>
                            <HashIcon className="w-4 h-4 text-green-500" />
                            <span className="text-xs">Tags</span>
                        </div>
                        <div>
                            <AtSignIcon className="w-4 h-4 text-gray-500" />
                            <span className="text-xs">Mention</span>
                        </div>
                        <div className="ml-auto">
                            <Select>
                                <SelectTrigger className="bg-white text-gray-600 border-none">
                                    <SelectValue placeholder="Public" />
                                </SelectTrigger>
                                <SelectContent className="bg-white text-gray-600 border-none">
                                    <SelectGroup>
                                        <SelectLabel>
                                            Who can see this?
                                        </SelectLabel>
                                        <SelectItem value="public">Public</SelectItem>
                                        <SelectItem value="private">Private</SelectItem>
                                    </SelectGroup>
                                    <SelectGroup>
                                        <SelectLabel>
                                            Communities
                                        </SelectLabel>
                                        <SelectItem value="JS Developers">
                                            JS Developers
                                        </SelectItem>
                                        <SelectItem value="React Developers">
                                            React Developers
                                        </SelectItem>
                                        <SelectItem value="Next.js Developers">
                                            Next.js Developers
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            </div>}

        </>
    );
}