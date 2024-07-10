import { auth, currentUser } from "@clerk/nextjs";
import { Stories } from "./stories";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    BookmarkIcon,
    EllipsisVerticalIcon,
    HeartIcon,
    MessageCircleIcon,
    Share2Icon,
} from "lucide-react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { badgeVariants } from "@/components/ui/badge";
import Link from "next/link";
import { CreatePost } from "./_components/CreatePost";
import { getCommunitiesJoinedByUser } from "@/lib/actions/user.actions";

export default async function Home() {
    const { userId } = auth();
    const user = await currentUser();
    const { data } = await getCommunitiesJoinedByUser();
    return (
        <>
            {userId && <Stories />}
            {userId && <CreatePost communities={data} />}
            <div className="flex items-center gap-2 text-xs" id="sortBy">
                <div className="border h-0 w-full"></div>
                <div className="flex flex-row text-xs min-w-fit">
                    <Select>
                        <SelectTrigger className="bg-gray-100 border-gray-100 text-gray-600 text-xs focus:ring-0 focus:border-none focus:ring-offset-0 focus:ring-opacity-0 focus:border-transparent focus:border-collapse active:border-collapse">
                            <SelectValue placeholder="Latest" />
                        </SelectTrigger>
                        <SelectContent className="bg-white text-gray-600 border-none text-xs">
                            <SelectGroup>
                                <SelectItem value="latest" defaultChecked>
                                    Latest
                                </SelectItem>
                                <SelectItem value="popular">Popular</SelectItem>
                                <SelectItem value="trending">Trending</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div id="posts">
                <div className="flex flex-col gap-3">
                    <div className="bg-white rounded-xl p-2">
                        <div className="flex flex-row gap-2 items-center">
                            <Avatar>
                                <AvatarImage src="/images/man.png" alt="Ramzan Shareef" />
                                <AvatarFallback>R S</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium">Ramzan Shareef</span>
                                <span className="text-xs text-gray-500">2 hours ago</span>
                            </div>
                            <EllipsisVerticalIcon className="w-5 h-5 text-gray-500 ml-auto cursor-pointer" />
                        </div>
                        <div className="mt-2 p-1">
                            <Link className="text-sm font-medium" href={`/post/`}>
                                <Image
                                    src="/images/next.jpg"
                                    width={500}
                                    height={300}
                                    alt="Next.js"
                                    className="w-full h-60 rounded-md my-2"
                                />
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
                                vel nibh nec nunc ultricies eleifend vitae eget justo. Nulla
                                facilisi. Donec id nunc ac elit ultricies ultricies. Nullam
                                consectetur Lorem ipsum dolor sit amet consectetur adipisicing
                                elit. Nisi exercitationem fugiat a quia non quae, quam dolorem
                                nobis repudiandae et!
                            </Link>
                            <div className="flex mt-1 gap-x-2">
                                <Link
                                    className={badgeVariants({ variant: "primary" })}
                                    href={`/post/`}
                                >
                                    Java
                                </Link>
                                <Link
                                    className={badgeVariants({ variant: "primary" })}
                                    href={`/post/`}
                                >
                                    Java
                                </Link>
                                <Link
                                    className={badgeVariants({ variant: "primary" })}
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
                                <span className="text-xs">10</span>
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
                        <div className="bg-white rounded-xl p-4 mt-3" key={i}>
                            <div className="flex flex-row gap-2 items-center">
                                <Avatar>
                                    <AvatarImage src="/images/man.jpg" alt="Sujith Kumar" />
                                    <AvatarFallback>S K</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium">Sujith Kumar</span>
                                    <span className="text-xs text-gray-500">2 hours ago</span>
                                </div>
                                <EllipsisVerticalIcon className="w-5 h-5 text-gray-500 ml-auto cursor-pointer" />
                            </div>
                            <div className="mt-2 p-1">
                                <Link className="text-sm font-medium" href={`/post/${i}`}>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
                                    vel nibh nec nunc ultricies eleifend vitae eget justo. Nulla
                                    facilisi. Donec id nunc ac elit ultricies ultricies. Nullam
                                    consectetur Lorem ipsum dolor sit amet consectetur adipisicing
                                    elit. Nisi exercitationem fugiat a quia non quae, quam dolorem
                                    nobis repudiandae et!
                                </Link>
                                <div className="flex mt-1 gap-x-2">
                                    <Link
                                        className={badgeVariants({ variant: "primary" })}
                                        href={`/post/${i}`}
                                    >
                                        Java
                                    </Link>
                                    <Link
                                        className={badgeVariants({ variant: "primary" })}
                                        href={`/post/${i}`}
                                    >
                                        Java
                                    </Link>
                                    <Link
                                        className={badgeVariants({ variant: "primary" })}
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
