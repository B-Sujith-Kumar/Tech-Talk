import TextBox from "@/components/shared/TextBox/TextBox";
import { getPostById } from "@/lib/actions/post.action"
import mongoose from "mongoose";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { badgeVariants } from "@/components/ui/badge";
import Link from "next/link";
import moment from "moment";

export default async function PostPage({ params }: { params: { postID: mongoose.Schema.Types.ObjectId } }) {
    const { data, status } = await getPostById(params.postID);
    if (status !== 200) notFound();
    return (
        <div className="bg-white rounded-md rounded-t-xl w-4/5 mx-auto overflow-y-scroll scrollbar-hidden pb-10 shadow-lg">
            <div
                style={{
                    backgroundImage: `url(${data?.coverImage as string})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center"
                }}
                className="relative bg-contain rounded-t-xl bg-no-repeat h-96 w-full"
            />
            <div className="px-10 mt-4">
                <div className="px-2 flex flex-row gap-2 items-center">
                    <Avatar>
                        <AvatarImage
                            src={data.author.profilePicture}
                            alt={data.author.firstName + " " + data.author.lastName}
                        />
                        <AvatarFallback>
                            {data.author.firstName[0] + data.author.lastName[0]}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium flex flex-row items-center">
                            <Link href={`/user/${data.author._id}`} className="flex items-center">
                                {data.author.firstName + " " + data.author.lastName}
                                <span className="text-xs text-gray-500">
                                    &nbsp;@{data.author.username} &nbsp;
                                </span>
                            </Link>
                            <span className="text-xs flex flex-row items-center gap-2">
                                {data.community && <>in</>}
                                {data.community &&
                                    <Link className={badgeVariants({ variant: "outline" }) + " flex flex-row gap-1 hover:bg-indigo-500 hover:text-white"}
                                        href={`/community/${data.community._id}`}
                                    >
                                        <Image
                                            src={data.community.icon}
                                            width={20}
                                            height={20}
                                            alt={data.community.name}
                                            className="rounded-full"
                                        />
                                        {data.community.name}
                                    </Link>
                                }
                            </span>
                        </span>
                        <span className="text-xs text-gray-500">
                            Posted {moment(data.createdAt).fromNow()}
                        </span>
                    </div>
                </div>

                <h1 className="font-bold px-2 my-4">{data?.title}</h1>

                <TextBox
                    description={data?.content as string}
                    editable={false}
                />
            </div>
        </div >
    )
}

export async function generateMetadata({ params }: { params: { postID: mongoose.Schema.Types.ObjectId } }) {
    const { data } = await getPostById(params.postID);
    return {
        title: data?.title,
    }
}