"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { IComment } from "@/lib/database/models/comment.model";
import { IUser } from "@/lib/database/models/user.model";
import { Ellipsis, Pencil } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { editComment } from "@/lib/actions/post.action";
import { useToast } from "@/components/ui/use-toast";

const CommentOptions = ({
  comment,
  user,
}: {
  comment: IComment;
  user: IUser;
}) => {
  const [content, setContent] = useState(comment.content);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const edit = async () => {
    try {
      const { status } = await editComment(comment._id, content);
      if (status === 200) {
        toast({
          title: "Comment edited successfully",
          description:
            "Your comment has been edited successfully. Refresh the page to see the changes.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while editing the comment.",
      });
      console.log(error);
    }
  };
  console.log(user);
  return (
    <div>
      <Popover>
        <PopoverTrigger>
          <Ellipsis className="text-gray-600" />
        </PopoverTrigger>
        <PopoverContent className="w-fit">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger
              onClick={() => setIsOpen(true)}
              className=""
            >
              <div className="flex px-2 py-1 font-medium rounded-md items-center text-sm w-full hover:bg-gray-300 gap-2">
                Edit comment
              </div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit your comment</DialogTitle>
                <DialogDescription className="mb-3">
                  You can edit your comment here.
                </DialogDescription>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="bg-gray-300 focus-visible:outline-none focus-visible:ring-0 ring-offset-0"
                />
                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      setIsOpen(false);
                    }}
                    className="btn btn-secondary font-bold px-3 py-2 rounded-md text-white bg-red-600 text-sm mt-3 mr-3"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      edit();
                      setIsOpen(false);
                    }}
                    className="btn text-sm font-bold px-3 py-2 rounded-md bg-indigo-500 text-white btn-primary mt-3"
                  >
                    Save
                  </button>
                </div>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default CommentOptions;
