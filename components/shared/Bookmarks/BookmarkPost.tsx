"use client";

import { BookmarkIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { ICollection } from "@/lib/database/models/collection.model";
import { useToast } from "@/components/ui/use-toast";
import {
  getCollectionsOfPost,
  savePostToCollections,
} from "@/lib/actions/collection.actions";
import mongoose from "mongoose";

const BookmarkPost = ({
  collectionList,
  postId,
  userId,
}: {
  collectionList: ICollection[];
  postId: string;
  userId: string;
}) => {
  const [collections, setCollections] = useState<ICollection[]>(collectionList);
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCollectionsForPost = async () => {
      try {
        const { collections: existingCollections } = await getCollectionsOfPost(
          postId,
          userId
        );
        const selectedIds = existingCollections.map((collection: ICollection) =>
          collection?._id?.toString()
        );
        setSelectedCollections(selectedIds);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch the collections for the post.",
        });
      }
    };
    fetchCollectionsForPost();
  }, [open]);

  const handleCheckboxChange = (collectionId: string) => {
    setSelectedCollections((prev) =>
      prev.includes(collectionId)
        ? prev.filter((id) => id !== collectionId)
        : [...prev, collectionId]
    );
  };
  const handleSave = async () => {
    try {
      const { status } = await savePostToCollections(
        postId,
        selectedCollections,
        userId
      );
      if (status === 200) {
        toast({
          title: "Post saved",
          description: "The post has been saved to the selected collections.",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to save the post to the collections.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save the post to the collections.",
      });
    } finally {
      setOpen(false);
      setSelectedCollections([]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <div className="flex items-center gap-1">
          <BookmarkIcon className="w-4 h-4 " />
          <span className="text-xs max-sm:hidden font-medium">Save</span>
        </div>
      </DialogTrigger>
      <DialogContent className="max-sm:max-w-sm rounded-lg">
        <DialogHeader>
          <DialogTitle>Select a collection</DialogTitle>
          <DialogDescription>
            You can save this post to a collection you have created.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-wrap gap-3 gap-y-2">
          {collections.map((collection: ICollection, id: number) => (
            <div key={id} className="flex items-center">
              <Checkbox
                id={`collection-${collection._id}`}
                checked={selectedCollections.includes(collection._id!)}
                onCheckedChange={() => handleCheckboxChange(collection._id!)}
                className="mr-2"
              />
              <label htmlFor={`collection-${collection._id}`}>
                {collection.name}
              </label>
            </div>
          ))}
        </div>
        <button
          onClick={handleSave}
          className="bg-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md mt-4"
        >
          Save
        </button>
      </DialogContent>
    </Dialog>
  );
};

export default BookmarkPost;
