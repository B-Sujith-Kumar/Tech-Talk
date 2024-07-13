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
import { deleteComment, editComment } from "@/lib/actions/post.action";
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
  const [deleteOpen, setDeleteOpen] = useState(false);
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
  const handleDelete = async () => {
    try {
      const { status } = await deleteComment(comment._id);
      if (status === 200) {
        toast({
          title: "Comment deleted",
          description: "The comment has been deleted successfully.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while deleting the comment.",
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
        <PopoverContent className="w-fit flex flex-col">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger onClick={() => setIsOpen(true)} className="">
              <div className="flex px-2 py-1 font-medium rounded-md items-center text-sm w-full hover:bg-gray-300 gap-2">
                Edit comment
              </div>
            </DialogTrigger>
            <DialogContent className="max-md:max-w-lg max-sm:max-w-sm rounded-lg">
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

          <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <DialogTrigger onClick={() => setDeleteOpen(true)} className="mt-2">
              <div className="flex px-2 py-1 font-medium rounded-md items-center text-sm w-full hover:bg-gray-300 gap-2">
                Delete comment
              </div>
            </DialogTrigger>
            <DialogContent className="max-md:max-w-lg max-sm:max-w-sm rounded-lg">
              <DialogHeader>
                <DialogTitle>Delete your comment</DialogTitle>
                <DialogDescription className="mb-3">
                  Are you sure you want to delete your comment? This action
                  cannot be undone.
                </DialogDescription>
                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      setDeleteOpen(false);
                    }}
                    className="btn btn-secondary font-bold px-3 py-2 rounded-md text-white bg-indigo-500 text-sm mt-3 mr-3"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      handleDelete();
                      setDeleteOpen(false);
                    }}
                    className="btn text-sm font-bold px-3 py-2 rounded-md bg-red-600 text-white btn-primary mt-3"
                  >
                    Delete
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
