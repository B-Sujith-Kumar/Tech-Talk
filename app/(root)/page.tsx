import { auth, currentUser } from "@clerk/nextjs";
import { Stories } from "./stories";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AtSignIcon, BookmarkIcon, EllipsisVerticalIcon, HashIcon, HeartIcon, ImageUpIcon, MessageCircleIcon, PaperclipIcon, Share2Icon, VideoIcon } from "lucide-react";
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
import { badgeVariants } from "@/components/ui/badge";
import Link from "next/link";

export default async function Home() {
    const { userId } = auth();
    const user = await currentUser();
    return (
        <>
            {userId && <Stories />}
            {userId && <div className="bg-white rounded-md mt-2 p-2">
                <div className="flex flex-row gap-x-4 items-center px-2">
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
                                placeholder="What&apos;s on your mind?"
                                name="comment"
                                required
                                minLength={5}
                            />
                        </DialogTrigger>
                        <DialogContent className="bg-white rounded-md overflow-auto scrollbar-hidden max-w-3xl max-md:max-w-2xl max-sm:max-w-[90%] max-md:rounded-lg"
                            aria-describedby="modal-description"
                        >
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
                                                    <SelectTrigger className="bg-white text-gray-600 border-none h-2 focus:ring-0 focus:border-none focus:ring-offset-0 focus:ring-opacity-0 focus:border-transparent focus:border-collapse active:border-collapse">
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
                                <div>
                                    <textarea
                                        className="blockrounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:opacity-50 peer placeholder-transparent h-60 scrollbar-hidden bg-gray-100 w-full"
                                        placeholder="What&apos;s on your mind?"
                                        name="comment"
                                        required
                                        minLength={5}
                                    />
                                    <div className="mt-4 max-sm:hidden">
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
                                    <Select>
                                        <SelectTrigger className="sm:hidden mt-2 bg-gray-100 text-gray-600 border-none text-xs focus:ring-0 focus:border-none focus:ring-offset-0 focus:ring-opacity-0 focus:border-transparent focus:border-collapse active:border-collapse">
                                            More Options
                                        </SelectTrigger>
                                        <SelectContent className="bg-white text-gray-600 border-none text-xs py-2">
                                            <div className="flex flex-col gap-6 *:flex *:flex-row *:gap-2 *:items-center *:cursor-pointer *:px-4">
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
                                                        <SelectTrigger className="bg-white text-gray-600 border-none focus:ring-0 focus:border-none focus:ring-offset-0 focus:ring-opacity-0 focus:border-transparent focus:border-collapse active:border-collapse">
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
                                        </SelectContent>
                                    </Select>
                                    <Button type="submit" variant="primary" className="w-full h-8 mt-4" >
                                        Share Post
                                    </Button>
                                </div>
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>
                    <Button type="submit" variant="primary" className="w-fit h-8" >
                        Share Post
                    </Button>
                </div>
                <hr className="mt-2" />
                <div className="px-2 overflow-auto scrollbar-hidden">
                    <div className="flex flex-row gap-6 *:flex *:flex-row *:gap-2 *:items-center *:cursor-pointer max-sm:hidden">
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
                                <SelectTrigger className="bg-white text-gray-600 border-none focus:ring-0 focus:border-none focus:ring-offset-0 focus:ring-opacity-0 focus:border-transparent focus:border-collapse active:border-collapse">
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
                    <Select>
                        <SelectTrigger className="sm:hidden bg-gray-100 text-gray-600 border-none text-xs focus:ring-0 focus:border-none focus:ring-offset-0 focus:ring-opacity-0 focus:border-transparent focus:border-collapse active:border-collapse">
                            More Options
                        </SelectTrigger>
                        <SelectContent className="bg-white text-gray-600 border-none text-xs py-2">
                            <div className="flex flex-col gap-6 *:flex *:flex-row *:gap-2 *:items-center *:cursor-pointer *:px-4">
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
                                        <SelectTrigger className="bg-white text-gray-600 border-none focus:ring-0 focus:border-none focus:ring-offset-0 focus:ring-opacity-0 focus:border-transparent focus:border-collapse active:border-collapse">
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
                        </SelectContent>
                    </Select>
                </div>
            </div>}
            <div className="flex items-center gap-2 text-xs" id="sortBy">
                <div className="border h-0 w-full"></div>
                <div className="flex flex-row text-xs min-w-fit">
                    <Select>
                        <SelectTrigger className="bg-gray-100 border-gray-100 text-gray-600 text-xs focus:ring-0 focus:border-none focus:ring-offset-0 focus:ring-opacity-0 focus:border-transparent focus:border-collapse active:border-collapse">
                            <SelectValue placeholder="Latest" />
                        </SelectTrigger>
                        <SelectContent className="bg-white text-gray-600 border-none text-xs">
                            <SelectGroup>
                                <SelectItem value="latest" defaultChecked>Latest</SelectItem>
                                <SelectItem value="popular">Popular</SelectItem>
                                <SelectItem value="trending">Trending</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div id="posts">
                <div className="flex flex-col gap-3">
                    <div className="bg-white rounded-md p-2">
                        <div className="flex flex-row gap-2 items-center">
                            <Avatar>
                                <AvatarImage
                                    src="/images/man.png"
                                    alt="Ramzan Shareef"
                                />
                                <AvatarFallback>
                                    R S
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium">
                                    Ramzan Shareef
                                </span>
                                <span className="text-xs text-gray-500">
                                    2 hours ago
                                </span>
                            </div>
                            <EllipsisVerticalIcon className="w-5 h-5 text-gray-500 ml-auto cursor-pointer" />
                        </div>
                        <div className="mt-2 p-1">
                            <Link className="text-sm font-medium"
                                href={`/post/`}
                            >
                                <Image src="/images/next.jpg" width={500} height={300} alt="Next.js" className="w-full h-60 rounded-md my-2" />
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vel nibh nec nunc ultricies
                                eleifend
                                vitae eget justo. Nulla facilisi. Donec id nunc ac elit ultricies ultricies. Nullam
                                consectetur Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi exercitationem fugiat a quia non quae, quam dolorem nobis repudiandae et!
                            </Link>
                            <div className="flex mt-1 gap-x-2">
                                <Link className={badgeVariants({ variant: "primary" })}
                                    href={`/post/`}
                                >
                                    Java
                                </Link>
                                <Link className={badgeVariants({ variant: "primary" })}
                                    href={`/post/`}
                                >
                                    Java
                                </Link>
                                <Link className={badgeVariants({ variant: "primary" })}
                                    href={`/post/`}
                                >
                                    Java
                                </Link>
                            </div>
                        </div>
                        <hr className="mt-2 border-gray-200" />
                        <div className="flex flex-row gap-6 mt-2 p-2 *:flex *:flex-row *:gap-2 *:items-center">
                            <div>
                                <HeartIcon className="w-4 h-4 text-gray-500" />
                                <span className="text-xs">
                                    10
                                </span>
                                <span className="text-xs max-sm:hidden">Likes</span>
                            </div>
                            <div>
                                <MessageCircleIcon className="w-4 h-4 text-gray-500" />
                                <span className="text-xs max-sm:hidden">5 Comments</span>
                            </div>
                            <div>
                                <Share2Icon className="w-4 h-4 text-gray-500" />
                                <span className="text-xs max-sm:hidden">Share</span>
                            </div>
                            <BookmarkIcon className="w-4 h-4 text-gray-500 ml-auto" />
                        </div>
                    </div>
                    {new Array(5).fill(0).map((_, i) => (
                        <div className="bg-white rounded-md p-2" key={i}>
                            <div className="flex flex-row gap-2 items-center">
                                <Avatar>
                                    <AvatarImage
                                        src="/images/man.jpg"
                                        alt="Sujith Kumar"
                                    />
                                    <AvatarFallback>
                                        S K
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium">
                                        Sujith Kumar
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        2 hours ago
                                    </span>
                                </div>
                                <EllipsisVerticalIcon className="w-5 h-5 text-gray-500 ml-auto cursor-pointer" />
                            </div>
                            <div className="mt-2 p-1">
                                <Link
                                    className="text-sm font-medium"
                                    href={`/post/${i}`}
                                >
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vel nibh nec nunc ultricies
                                    eleifend
                                    vitae eget justo. Nulla facilisi. Donec id nunc ac elit ultricies ultricies. Nullam
                                    consectetur Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi exercitationem fugiat a quia non quae, quam dolorem nobis repudiandae et!
                                </Link>
                                <div className="flex mt-1 gap-x-2">
                                    <Link className={badgeVariants({ variant: "primary" })}
                                        href={`/post/${i}`}
                                    >
                                        Java
                                    </Link>
                                    <Link className={badgeVariants({ variant: "primary" })}
                                        href={`/post/${i}`}
                                    >
                                        Java
                                    </Link>
                                    <Link className={badgeVariants({ variant: "primary" })}
                                        href={`/post/${i}`}
                                    >
                                        Java
                                    </Link>
                                </div>
                            </div>
                            <hr className="mt-2 border-gray-200" />
                            <div className="flex flex-row gap-6 mt-2 p-2 *:flex *:flex-row *:gap-2 *:items-center">
                                <div>
                                    <HeartIcon className="w-4 h-4 text-gray-500" />
                                    <span className="text-xs max-sm:hidden">10 Likes</span>
                                </div>
                                <div>
                                    <MessageCircleIcon className="w-4 h-4 text-gray-500" />
                                    <span className="text-xs max-sm:hidden">5 Comments</span>
                                </div>
                                <div>
                                    <Share2Icon className="w-4 h-4 text-gray-500" />
                                    <span className="text-xs max-sm:hidden">Share</span>
                                </div>
                                <BookmarkIcon className="w-4 h-4 text-gray-500 ml-auto" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}