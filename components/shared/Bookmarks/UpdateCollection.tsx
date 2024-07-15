"use client";

import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ICollection } from "@/lib/database/models/collection.model";
import { updateCollection } from "@/lib/actions/collection.actions";
import { useToast } from "@/components/ui/use-toast";

const UpdateCollection = ({ collection }: { collection: ICollection }) => {
  const [collectionName, setCollectionName] = React.useState(collection.name);
  const [collectionDescription, setCollectionDescription] = React.useState(
    collection.description
  );
  const [open, setOpen] = React.useState(false);
  const {toast} = useToast();

  const handleUpdate = async () => {
    setOpen(false);
    const {status} = await updateCollection(collection._id!, collectionName, collectionDescription);
    if (status === 200) {
        toast({
            title: "Collection updated",
            description: "Collection has been updated successfully",
        });
    } else {
        toast({
            title: "Error",
            description: "There was an error updating the collection",
        });
    }
  };

  useEffect(() => {
    setCollectionName(collection.name);
    setCollectionDescription(collection.description);
  }, [open]);

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
          <p className="bg-indigo-500 text-white px-3 py-2 font-semibold text-sm rounded-md">
            Update collection
          </p>
        </DialogTrigger>
        <DialogContent className="max-md:max-w-md max-sm:max-w-sm rounded-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">Update collection</DialogTitle>
            <DialogDescription className="text-gray-600 text-sm mb-7">
              Update your collection details here to keep it fresh and relevant.
            </DialogDescription>
          </DialogHeader>
          <input
            value={collectionName}
            type="text"
            onChange={(e) => setCollectionName(e.target.value)}
            className="bg-inherit focus:outline-none border border-slate-400 px-2 py-2 rounded-md text-sm"
            placeholder="Collection name"
          />
          <Textarea
            value={collectionDescription}
            onChange={(e) => setCollectionDescription(e.target.value)}
            className="border-slate-400 focus-visible:ring-0 ring-offset-0"
            placeholder="What's this collection about?"
          />
          <div className="flex justify-end mt-0">
            <button
              className="bg-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md font-semibold text-sm"
              onClick={handleUpdate}
              disabled={
                collectionName.trim().length === 0 ||
                collectionDescription.trim().length === 0
              }
            >
              Update collection
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UpdateCollection;
