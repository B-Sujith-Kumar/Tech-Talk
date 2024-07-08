"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HandshakeIcon, HouseIcon, Images, LucideCalendarRange, Video } from "lucide-react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@clerk/nextjs";

export default function Sidebar({ isMobile = false }: { isMobile?: boolean }) {
    const pathname = usePathname();
    const { isSignedIn, user } = useUser();
    return <>
        <div className={` ${isMobile === false ? "w-1/5 xl:w-1/5 max-lg:hidden space-y-3" : ""} `}>
            {isSignedIn && <div id="profile" className="bg-white rounded-md p-3">
                <div className="flex flex-col gap-3 items-center bg-gray-100 rounded-md p-2 overflow-x-scroll scrollbar-hidden">
                    <div className="flex flex-row items-center justify-start gap-2 w-full px-2">
                        <Avatar>
                            <AvatarImage src={user.imageUrl} />
                            <AvatarFallback>
                                {user.fullName}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col space-y-[1px] text-wrap">
                            <span className="text-base font-medium">
                                {user.fullName}
                            </span>
                            <span className="text-xs">
                                @{user.username}
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-row items-center justify-between mt-2 w-full px-2">
                        <div className="flex flex-col items-center">
                            <span className="text-base font-medium">
                                2.3k
                            </span>
                            <span className="text-xs text-slate-500">
                                Followers
                            </span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-base font-medium">
                                235
                            </span>
                            <span className="text-xs text-slate-500">
                                Following
                            </span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-base font-medium">
                                80
                            </span>
                            <span className="text-xs text-slate-500">
                                Posts
                            </span>
                        </div>
                    </div>
                </div>
            </div>}
            <div id="links">
                <div className="bg-white rounded-md p-3 mt-2">
                    <div className="flex flex-col gap-1">
                        <Link href="/" className={` flex flex-row items-center gap-3  text-gray-600 p-2 hover:bg-indigo-600/90 hover:text-white hover:rounded-lg
                ${pathname === "/" && "bg-indigo-600/90 text-white rounded-lg"} `}
                        >
                            <HouseIcon size={18} />
                            Feed
                        </Link>
                        <Link href="/profile" className={` flex flex-row items-center gap-3  text-gray-600  p-2 hover:bg-indigo-600/90 hover:text-white  hover:rounded-lg
                ${pathname === "/profile" && "bg-indigo-600/90 text-white rounded-lg"} `}
                        >
                            <HandshakeIcon size={18} />
                            Friends
                        </Link>
                        <Link href="/events" className={` flex flex-row items-center gap-3  text-gray-600  p-2 hover:bg-indigo-600/90 hover:text-white  hover:rounded-lg
                ${pathname === "/events" && "bg-indigo-600/90 text-white  rounded-lg"} `}
                        >
                            <LucideCalendarRange size={18} />
                            Events
                        </Link>
                        <Link href="/videos" className={` flex flex-row items-center gap-3  text-gray-600  p-2 hover:bg-indigo-600/90 hover:text-gray-200 hover:rounded-lg
                ${pathname === "/videos" && "bg-indigo-600/90 text-gray-200 rounded-lg"} `}
                        >
                            <Video size={18} />
                            Videos
                        </Link>
                        <Link href="/images" className={` flex flex-row items-center gap-3  text-gray-600  p-2 hover:bg-indigo-600/90 hover:text-gray-200 hover:rounded-lg
                ${pathname === "/images" && "bg-indigo-600/90 text-gray-200 rounded-lg"} `}
                        >
                            <Images size={18} />
                            Images
                        </Link>
                    </div>
                    {isSignedIn && <>
                        <div className="border-t border-gray-200 w-full my-2"></div>
                        <span className="text-[0.6rem] text-gray-500 mt-2 p-2">
                            PAGES YOU LIKE
                        </span>
                        <div className="flex flex-col p-2 gap-2 *:flex *:flex-row *:items-center *:gap-2 *:cursor-pointer">
                            <div>
                                <Image src="/images/1.jpeg" width={50} height={50}
                                    alt="Image 1"
                                    className="h-6 w-6 rounded"
                                />
                                <span className="text-xs text-gray-600 font-medium">
                                    JavaScript Developers
                                </span>
                            </div>
                            <div>
                                <Image src="/images/1.jpeg" width={50} height={50}
                                    alt="Image 1"
                                    className="h-6 w-6 rounded"
                                />
                                <span className="text-xs text-gray-600 font-medium">
                                    JavaScript Developers
                                </span>
                            </div>
                            <div>
                                <Image src="/images/1.jpeg" width={50} height={50}
                                    alt="Image 1"
                                    className="h-6 w-6 rounded"
                                />
                                <span className="text-xs text-gray-600 font-medium">
                                    JavaScript Developers
                                </span>
                            </div>
                            <div>
                                <Image src="/images/1.jpeg" width={50} height={50}
                                    alt="Image 1"
                                    className="h-6 w-6 rounded"
                                />
                                <span className="text-xs text-gray-600 font-medium">
                                    JavaScript Developers
                                </span>
                            </div>
                        </div>
                        <span className="text-[0.6rem] text-gray-500 font-medium mt-2 p-2">
                            View All
                        </span>
                    </>}
                </div>
                <div className="text-[0.6rem] text-gray-500 p-2 mt-2 flex flex-col gap-2">
                    <span>
                        Privacy · Advertising · Cookies
                    </span>
                    <span>
                        Tech Talk {"©"} {new Date().getFullYear()}
                    </span>
                </div>
            </div>
        </div>
    </>
}