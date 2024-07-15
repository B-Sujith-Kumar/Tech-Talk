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
import { useRouter } from "next/navigation";
import { deleteCollection } from "@/lib/actions/collection.actions";
import { useToast } from "@/components/ui/use-toast";

const DeleteCollection = ({ collectionId }: { collectionId: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const handleDelete = async () => {
    try {
      const { status } = await deleteCollection(collectionId);
      if (status === 200) {
        router.push("/bookmarks");
        toast({
          title: "Collection deleted",
          description: "Collection has been successfully deleted",
        });
      } else {
        toast({
          title: "Error",
          description: "An error occurred while deleting the collection",
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "An error occurred while deleting the collection",
      });
    }
  };

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger>
          <p className="bg-red-600 text-white px-3 py-2 font-semibold text-sm rounded-md">
            Delete collection
          </p>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the
              collection and remove the data from our servers.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <p
              className="bg-red-600 cursor-pointer text-white px-3 py-2 font-semibold text-sm rounded-md"
              onClick={handleDelete}
            >
              Delete
            </p>
            <p
              className="bg-gray-200 cursor-pointer text-gray-800 px-3 py-2 font-semibold text-sm rounded-md ml-2"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DeleteCollection;
