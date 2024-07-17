"use client";

import { Button } from "@/components/ui/button";
import { followHandler, followUser } from "@/lib/actions/user.actions";
import { usePathname, useRouter } from "next/navigation";

export const NoAuthFollowButton = () => {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <Button
      type="button"
      variant="primary"
      className="w-full"
      onClick={() => router.push(`/sign-in?redirect_url=${pathname}`)}
    >
      Login to Follow
    </Button>
  );
};

export const FollowButton = ({
  isFollowing,
  postOwnerId,
  currentUserId,
}: {
  isFollowing: boolean;
  postOwnerId: string;
  currentUserId: string;
}) => {
  return (
    <Button
      type="button"
      variant="primary"
      className="w-full font-semibold"
      onClick={async (e) => {
        e.preventDefault();
        await followUser(postOwnerId, currentUserId);
      }}
    >
      {isFollowing ? "Unfollow" : "Follow"}
    </Button>
  );
};
