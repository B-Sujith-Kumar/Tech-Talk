"use client";

import { BookmarkIcon } from "lucide-react";
import React, { useState } from "react";
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

const BookmarkPost = ({
  collectionList,
}: {
  collectionList: ICollection[];
}) => {
  console.log(collectionList);
  const [collections, setCollections] = useState<ICollection[]>(collectionList);
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const {toast} = useToast();
  const handleCheckboxChange = (collectionId: string) => {
    setSelectedCollections((prev) =>
      prev.includes(collectionId)
        ? prev.filter((id) => id !== collectionId)
        : [...prev, collectionId]
    );
  };
  const handleSave = async () => {
    try {
        // await savePostToCollections(postId, selectedCollections);
        toast({
            title: "Post saved",
            description: "The post has been saved to the selected collections.",
        });
    } catch (error) {
        toast({
            title: "Error",
            description: "Failed to save the post to the collections.",
        });
    }
};

  return (
    <Dialog>
      <DialogTrigger>
        <div className="flex items-center gap-1">
          <BookmarkIcon className="w-4 h-4 " />
          <span className="text-xs max-sm:hidden font-medium">Save</span>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select a collection</DialogTitle>
          <DialogDescription>
            You can save this post to a collection you have created.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-wrap gap-3">
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
      </DialogContent>
    </Dialog>
  );
};

export default BookmarkPost;
