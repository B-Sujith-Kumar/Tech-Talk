import { useToast } from "@/components/ui/use-toast";
import { unfollowTag } from "@/lib/actions/user.actions";
import { ITag } from "@/lib/database/models/tag.model";
import { IUser } from "@/lib/database/models/user.model";
import React from "react";

const TagCard = ({ tag, currentUser }: { tag: ITag; currentUser: IUser }) => {
  const isFollwing = currentUser.followedTags?.includes(tag._id!);
  const { toast } = useToast();
  const handleUnfollow = async () => {
    try {
      const { status } = await unfollowTag(
        tag._id?.toString()!,
        currentUser._id?.toString()!
      );
      if (status === 200) {
        toast({
          title: `Unfollowed ${tag.name}`,
          description: `You are now not following ${tag.name}`,
        });
      } else {
        toast({
          title: `Error`,
          description: `An error occured while unfollowing ${tag.name}`,
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: `Error`,
        description: `An error occured while unfollowing ${tag.name}`,
      });
    }
  };
  return (
    <div>
      <div className="bg-white px-5 border rounded-lg py-4">
        <div>
          <h1 className="text-lg text-gray-700 font-bold">{tag.name}</h1>
          <section className="text-sm flex text-gray-500 items-center gap-3 mt-2">
            <div className="flex items-center gap-1">
              <p className="font-bold text-gray-700">{tag.followers?.length}</p>
              <p className="">Followers</p>
            </div>
            <div className="flex items-center gap-1">
              <p className="font-bold text-gray-700">{tag.posts?.length}</p>
              <p className="">Posts</p>
            </div>
          </section>
          {isFollwing ? (
            <button
              className="mt-4 w-full bg-gray-200 text-gray-500 px-4 py-2 rounded-lg font-semibold"
              onClick={handleUnfollow}
            >
              Unfollow
            </button>
          ) : (
            <button className="mt-4 w-full bg-indigo-500 text-white px-4 py-2 rounded-lg font-semibold">
              Follow
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TagCard;
