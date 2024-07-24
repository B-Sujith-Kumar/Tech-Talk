"use client";

import {
  EllipsisVerticalIcon,
  FlagIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IPostPopulated } from "@/types";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { ICommunity } from "@/lib/database/models/community.model";
import { deletePost } from "@/lib/actions/post.action";
import { toast } from "@/components/ui/use-toast";
import mongoose, { set } from "mongoose";
import { EditPost } from "@/app/(root)/_components/EditPostComp";

export function PostActions({
  post,
  communities,
}: {
  post: IPostPopulated;
  communities: ICommunity[];
}) {
  const { user } = useUser();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [open, setOpen] = useState(false);

  return (
    <>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="ml-auto">
            <EllipsisVerticalIcon className="w-5 h-5 text-gray-500 cursor-pointer" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="py-2 relative right-8 flex flex-col gap-2">
            {post.author.clerkId === user?.id && (
              <>
                <AlertDialogTrigger className="w-full">
                  <DropdownMenuItem
                    className="flex flex-row items-center gap-2"
                    onClick={() => setShowEditModal(true)}
                  >
                    <PencilIcon className="w-5 h-5 text-indigo-500" /> Edit
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogTrigger className="w-full">
                  <DropdownMenuItem
                    className="flex flex-row items-center gap-2"
                    onClick={() => setShowDeleteModal(true)}
                  >
                    <Trash2Icon className="w-5 h-5 text-red-500" /> Delete
                  </DropdownMenuItem>
                </AlertDialogTrigger>
              </>
            )}
            <DropdownMenuItem className="flex flex-row items-center gap-2">
              <FlagIcon className="w-5 h-5 text-yellow-500" /> Report
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <AlertDialogContent className="max-sm:max-w-[95%] max-w-[50%] rounded-xl">
          {showEditModal && (
            <EditPost
              communities={communities}
              post={post}
              onClose={() => {
                setOpen(false);
                setShowEditModal(false);
                setShowDeleteModal(false);
              }}
            />
          )}
          {showDeleteModal && (
            <div className="">
              <AlertDialogTitle>
                Are you sure you want to delete this post?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-red-500">
                This action is irreversible and will permanently delete the post
                from our servers.
              </AlertDialogDescription>
              <div className="flex flex-row items-center justify-end gap-2 mt-4">
                <AlertDialogAction
                  className="bg-red-500 font-semibold text-white hover:bg-red-600 hover:text-white"
                  onClick={async (e) => {
                    e.preventDefault();
                    let res = await deletePost(
                      post._id as mongoose.Schema.Types.ObjectId
                    );
                    if (res.status === 200) {
                      setOpen(false);
                      setShowDeleteModal(false);
                      setShowEditModal(false);
                      toast({
                        title: "Post deleted successfully",
                        description: "The post has been deleted successfully.",
                        variant: "default",
                      });
                    } else {
                      setOpen(false);
                      setShowDeleteModal(false);
                      setShowEditModal(false);
                      toast({
                        title: "Post Deletion Failed!",
                        description: res.message,
                        variant: "destructive",
                      });
                    }
                  }}
                >
                  Delete
                </AlertDialogAction>
                <AlertDialogCancel
                  className="bg-gray-500 mt-0 font-semibold text-white hover:bg-gray-600 hover:text-white"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </AlertDialogCancel>
              </div>
            </div>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
