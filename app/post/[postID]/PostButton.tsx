"use client";

import { Button } from "@/components/ui/button";
import { followHandler } from "@/lib/actions/user.actions";
import { usePathname, useRouter } from "next/navigation";

export const NoAuthFollowButton = () => {
    const router = useRouter();
    const pathname = usePathname();
    return (
        <Button type="button" variant="primary" className="w-full"
            onClick={() => router.push(`/sign-in?redirect_url=${pathname}`)}
        >
            Login to Follow
        </Button>
    );
}

export const FollowButton = ({ isFollowing, postOwnerId }:
    {
        isFollowing: boolean;
        postOwnerId: string;
    }) => {
    return (
        <Button type="button" variant="primary" className="w-full"
            onClick={async (e) => {
                e.preventDefault();
                await followHandler({
                    userId: postOwnerId
                });
            }}
        >
            {isFollowing ? "Unfollow" : "Follow"}
        </Button>
    );
}