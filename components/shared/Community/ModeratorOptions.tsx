"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { addModerator, removeModerator } from "@/lib/actions/community.actions";
import { useToast } from "@/components/ui/use-toast";
import { ICommunity } from "@/lib/database/models/community.model";
import { IUser } from "@/lib/database/models/user.model";
import { ICommentPopulated, ICommunityPopulated } from "@/types";
import { useRouter } from "next/navigation";

const ModeratorOptions = ({
  communityId,
  community,
  currentUser,
}: {
  communityId: string;
  community: ICommunityPopulated;
  currentUser: IUser;
}) => {
  const [username, setUsername] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const handleSubmit = async () => {
    try {
      const { error, status } = await addModerator(communityId, username);
      if (status === 200) {
        toast({
          title: "User invited as a moderator",
          description: `User ${username} has been invited as a moderator`,
        });
      } else {
        toast({
          title: "Error",
          description: error,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while inviting user as a moderator",
      });
    }
  };
  const leaveMod = async () => {
    try {
        const {status, error} = await removeModerator(communityId, currentUser._id?.toString()!);
        if (status === 200){
            toast({
                title: "Left as a mod",
                description: "You have been removed as a moderator of this community"
            })
            router.push(`/community/${communityId}`);
        } else {
            toast({
                title: "Error",
                description: error
            })
        }
    } catch (error) {
        toast({
            title: "Error",
            description: "An error occurred while leaving as a moderator"
        })
    }
  }
  return (
    <div className="flex gap-3">
      {currentUser._id?.toString() !== community.createdBy._id?.toString() && (
        <Dialog>
          <DialogTrigger>
            <p className="text-sm mt-5 text-blue-600 border border-blue-600  px-3 py-2 rounded-full font-semibold">
              Leave as a mod
            </p>
          </DialogTrigger>
          <DialogContent className="max-md:max-w-md max-sm:max-w-sm rounded-md">
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will remove you as a
                moderator of this community.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end">
              <button
                className="bg-red-600 text-white py-2 px-6 rounded-lg text-sm font-semibold mt-0"
                onClick={leaveMod}
              >
                Leave as a mod
              </button>
            </div>
          </DialogContent>
        </Dialog>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
          <p className="text-sm mt-5 bg-blue-600 text-white px-3 py-2 rounded-full font-semibold">
            Invite user as a mod
          </p>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite user as a mod</DialogTitle>
            <DialogDescription>
              Invite a user to be a moderator of this community.
            </DialogDescription>
          </DialogHeader>
          <input
            type="text"
            className="bg-inherit border border-gray-400 py-2 px-2 placeholder:text-sm rounded-xl outline-none"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <div className="flex justify-end">
            <button
              className="bg-blue-600 disabled:bg-blue-400 disabled:cursor-not-allowed  text-white py-2 px-6 rounded-lg text-sm font-semibold mt-0"
              onClick={() => {
                handleSubmit();
                setOpen(false);
              }}
              disabled={username.trim().length === 0}
            >
              Invite user
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ModeratorOptions;
