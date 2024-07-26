import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ICommunity } from "@/lib/database/models/community.model";
import Links from "./_components/SIdebar/Link";
import { isAuth } from "@/lib/auth";
import { currentUser } from "@clerk/nextjs/server";
import { getFollowers, getFollowing, getTotalPosts } from "@/lib/actions/user.actions";

export default async function Sidebar({ isMobile = false, communitites }: {
    isMobile?: boolean,
    communitites: ICommunity[]
}) {
    const isSignedIn = await isAuth();
    const user = await currentUser();
    let followers = [];
    let following = [];
    let totalPosts: { status: number; posts: any; message?: undefined; } | { status: number; message: any; posts?: undefined; } = { status: 0, posts: [] };
    if (isSignedIn) {
        followers = await getFollowers(user?.id as string);
        following = await getFollowing(user?.id as string);
        totalPosts = await getTotalPosts(user?.id as string);
    }

    return <>
        <div className={` ${isMobile === false ? "w-1/5 xl:w-1/5 max-lg:hidden space-y-3" : ""} `}>
            {isSignedIn && <div id="profile" className="bg-white rounded-md max-md:mt-3 p-3 max-md:p-0">
                <div className="flex flex-col gap-3 items-center bg-gray-100 rounded-md overflow-x-scroll scrollbar-hidden p-1">
                    <div className="flex flex-row items-center justify-start gap-2 w-full px-2">
                        <Avatar>
                            <AvatarImage src={user?.imageUrl} />
                            <AvatarFallback>
                                {user?.firstName && user?.firstName[0]}{user?.lastName && user?.lastName[0] || "U"}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col space-y-[1px] text-wrap">
                            <span className="text-base font-medium">
                                {user?.firstName + " " + user?.lastName}
                            </span>
                            <span className="text-xs">
                                @{user?.username}
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-row items-center justify-between mt-2 w-full px-0">
                        <div className="flex flex-col items-center">
                            <span className="text-base font-medium">
                                {followers.length}
                            </span>
                            <span className="text-xs text-slate-500">
                                Followers
                            </span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-base font-medium">
                                {following.length}
                            </span>
                            <span className="text-xs text-slate-500">
                                Following
                            </span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-base font-medium">
                                {totalPosts?.posts?.length}
                            </span>
                            <span className="text-xs text-slate-500">
                                Posts
                            </span>
                        </div>
                    </div>
                </div>
            </div>}
            <Links communitites={communitites} />
        </div>
    </>
}