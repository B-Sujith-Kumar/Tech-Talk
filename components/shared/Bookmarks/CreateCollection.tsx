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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createCollection } from "@/lib/actions/collection.actions";
import { useToast } from "@/components/ui/use-toast";

const CreateCollection = ({ currentUser }: { currentUser: string }) => {
  const [collectionName, setCollectionName] = useState("");
  const [collectionDescription, setCollectionDescription] = useState("");
  const [error, setError] = useState({ name: "", description: "" });
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    try {
      const { collection, error, status } = await createCollection(
        collectionName,
        collectionDescription,
        currentUser
      );
      setIsOpen(false);
      if (status === 200) {
        toast({
          title: "Collection created",
          description: "Collection has been created successfully",
        });
        setCollectionName("");
        setCollectionDescription("");
      } else {
        console.log(error)
        toast({
          title: "Error",
          description: "There was an error creating the collection",
        });
      }
    } catch (error) {
        console.log(error);
        toast({
            title: "Error",
            description: "There was an error creating the collection",
        });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className="">
        <p className="bg-indigo-500 px-4 py-2 text-white font-semibold rounded-md ">
          Create a collection
        </p>
      </DialogTrigger>
      <DialogContent className="max-md:max-w-md max-sm:max-w-sm rounded-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">Create collection</DialogTitle>
          <DialogDescription className="text-gray-600 text-sm mb-7">
            Collections help you organize your bookmarks. You can create a
            collection by providing a name and description.
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
            className="bg-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md"
            onClick={handleSubmit}
            disabled={
              collectionName.trim().length === 0 ||
              collectionDescription.trim().length === 0
            }
          >
            Create collection
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCollection;
