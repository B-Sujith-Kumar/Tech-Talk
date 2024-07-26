import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger, DialogHeader } from "@/components/ui/dialog";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AtSignIcon, HashIcon, ImageUpIcon, PaperclipIcon, VideoIcon } from "lucide-react";
import { auth, currentUser } from "@clerk/nextjs";
import { CreatePost as CreatePostComp } from "../_components/CreatePostComp";
import { ICommunity } from "@/lib/database/models/community.model";
import Link from "next/link";
import { getUser } from "@/lib/actions/user.actions";

export const CreatePost = async ({ communities }: {
    communities: ICommunity[];
}) => {
    const user = await currentUser();
    const {userId} = auth();
    const curUser = await getUser(userId);
    return <>
        <div className="bg-white rounded-xl mt-6 p-2 px-4 pt-4">
            <div className="flex flex-row gap-x-4 items-center px-2 ">
                <Avatar>
                    <AvatarImage
                        src={user?.imageUrl}
                        alt={user?.firstName ? user.firstName[0] : ""}
                    />
                    <AvatarFallback>
                        {user?.firstName && user?.lastName}
                    </AvatarFallback>
                </Avatar>
                <Link className="sm:hidden" href="/post/create">
                    <textarea
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:opacity-50 peer placeholder-transparent h-10 scrollbar-hidden bg-gray-100 max-sm:placeholder:text-xs"
                        placeholder="What's on your mind?"
                        name="comment"
                        required
                        minLength={5}
                    />
                </Link>
                <Dialog>
                    <DialogTrigger className="w-full max-sm:hidden">
                        <textarea
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-1 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:opacity-50 peer placeholder-transparent h-10 scrollbar-hidden bg-gray-100 max-sm:placeholder:text-xs"
                            placeholder="What's on your mind?"
                            name="comment"
                            required
                            minLength={5}
                        />
                    </DialogTrigger>
                    <DialogContent
                        className="bg-white rounded-md overflow-auto scrollbar-hidden max-w-3xl max-md:max-w-2xl max-sm:max-w-[90%] max-md:rounded-lg max-h-[90vh]"
                        aria-describedby="modal-description"
                    >
                        <DialogHeader>
                            <DialogTitle>
                                <div className="flex flex-row items-center justify-start gap-2 w-full px-2">
                                    <Avatar>
                                        <AvatarImage
                                            src={user?.imageUrl as string}
                                            className="rounded-full border-2 border-gray-400 w-16 h-auto"
                                        />
                                        <AvatarFallback>
                                            {user?.firstName && user?.lastName}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="ml-2 text-base font-medium">
                                        {user?.firstName && user?.lastName
                                            ? `${user.firstName} ${user.lastName}`
                                            : ""}
                                    </span>
                                </div>
                            </DialogTitle>
                            <div>
                                <CreatePostComp
                                    communities={communities}
                                    currentUser={curUser}
                                />
                            </div>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
                <Button
                    type="submit"
                    variant="primary"
                    className="w-fit h-10 px-6 py-4"
                >
                    Share Post
                </Button>
            </div>
            <hr className="mt-2 mb-2" />
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
                                    <SelectLabel>Who can see this?</SelectLabel>
                                    <SelectItem value="public">Public</SelectItem>
                                    <SelectItem value="private">Private</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                    <SelectLabel>Communities</SelectLabel>
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
                                            <SelectLabel>Who can see this?</SelectLabel>
                                            <SelectItem value="public">Public</SelectItem>
                                            <SelectItem value="private">Private</SelectItem>
                                        </SelectGroup>
                                        <SelectGroup>
                                            <SelectLabel>Communities</SelectLabel>
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
        </div>
    </>
}