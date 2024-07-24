"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HandshakeIcon, HouseIcon, Images, LucideCalendarRange, Video } from "lucide-react";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { ICommunity } from "@/lib/database/models/community.model";

const Links = ({ communitites }: {
    communitites: ICommunity[]
}) => {
    const pathname = usePathname();
    const { isSignedIn, user } = useUser();
    return (
        <>
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
                            COMMUNITIES YOU ARE IN
                        </span>
                        <div className="flex flex-col p-2 gap-2 *:flex *:flex-row *:items-center *:gap-2 *:cursor-pointer">
                            {
                                communitites?.map((community, index) => (
                                    <Link
                                        key={index}
                                        href={`/community/${community._id}`}
                                    >
                                        <Image
                                            src={community.icon as string}
                                            width={50}
                                            height={50}
                                            alt={community.name}
                                            className="h-6 w-6 rounded"
                                        />
                                        <span className="text-xs text-gray-600 font-medium">
                                            {community.name}
                                        </span>
                                    </Link>
                                ))
                            }
                        </div>
                        {communitites?.length > 4 && <div className="flex flex-row items-center justify-center gap-2 p-2">
                            <Link href="/communities" className="text-xs text-indigo-500 font-medium">
                                See all
                            </Link>
                        </div>
                        }
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
        </>
    )
}

export default Links