import { auth, currentUser } from "@clerk/nextjs";
import { Stories } from "./stories";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { CreatePost } from "./_components/CreatePost";
import { getCommunitiesJoinedByUser } from "@/lib/actions/user.actions";
import { getAllPosts } from "@/lib/actions/post.action";
import FeedPost from "@/components/shared/Posts/FeedPost";
import { Suspense } from "react";
import Loading from "../post/[postID]/loading";

export default async function Home() {
    const { userId } = auth();
    const user = await currentUser();
    const { data } = await getCommunitiesJoinedByUser();
    const postsData = await getAllPosts();
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
                    {postsData?.data?.slice(0, 1).map((post: any) => (
                        <FeedPost key={post._id} post={post} showBanner={true} />
                    ))}
                    {postsData?.data?.slice(1).map((post: any) => (
                        <FeedPost key={post._id} post={post} showBanner={false} />
                    ))}
                </div>
            </div>
        </>
    );
}