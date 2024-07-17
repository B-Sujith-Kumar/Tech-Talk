"use client";
import { MessageCircle } from "lucide-react";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { IComment } from "@/lib/database/models/comment.model";
import { ICommentPopulated } from "@/types";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { IUser } from "@/lib/database/models/user.model";
import { addReply } from "@/lib/actions/post.action";
import { useToast } from "@/components/ui/use-toast";

const ReplyComment = ({
  comment,
  currentUser,
}: {
  comment: ICommentPopulated;
  currentUser: IUser;
}) => {
  const [open, setOpen] = useState(false);
  const [reply, setReply] = useState("");
  const { toast } = useToast();
  const handleReply = async () => {
    try {
      const { status } = await addReply(
        comment?._id?.toString()!,
        reply,
        currentUser?._id?.toString()!
      );
      if (status === 200) {
        setOpen(false);
        setReply("");
        toast({
          title: "Reply added",
          description: "Your reply has been added successfully",
        });
      } else {
        toast({
          title: "Error",
          description: "An error occurred while adding reply",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while adding reply",
      });
    } finally {
      setOpen(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <div className="flex gap-1 items-center cursor-pointer">
          <MessageCircle className="w-4 h-4 text-gray-600" />
          <p className="text-gray-600 text-sm">Reply</p>
        </div>
      </DialogTrigger>
      <DialogContent className="max-sm:max-w-sm max-sm:rounded-lg">
        <DialogHeader>
          <DialogTitle>Add reply</DialogTitle>
          <DialogDescription className="">
            Add a reply to{" "}
            {comment.author.firstName + " " + comment.author.lastName}'s comment
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-start gap-2">
          <Image
            src={currentUser?.profilePicture || ""}
            width={16}
            height={16}
            alt="Profile picture"
            className="w-8 h-8 aspect-square rounded-full border-gray-300 border mt-2"
          />
          <Textarea
            placeholder="Reply to comment"
            className="border-slate-400 focus-visible:ring-0 ring-offset-0"
            value={reply}
            onChange={(e) => setReply(e.target.value)}
          />
        </div>
        <div className="flex gap-4 items-center justify-end ">
          <button
            className="text-gray-600 font-semibold text-sm cursor-pointer"
            onClick={() => setOpen(false)}
          >
            Cancel
          </button>
          <button
            className="text-white disabled:cursor-not-allowed disabled:bg-indigo-400 bg-indigo-500 px-3 py-2 cursor-pointer rounded-md w-fit font-semibold text-sm"
            disabled={reply.length === 0}
            onClick={handleReply}
          >
            Add reply
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReplyComment;
