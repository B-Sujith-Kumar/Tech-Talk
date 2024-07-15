"use client"

import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";

const SortComments = ({postId}: {postId: string}) => {
  const params = useSearchParams();
  const defaultValue = params.get("orderBy") || "top";
  const router = useRouter();
    const handleChange = (e: any) => {
        router.push(`/post/${postId}/?orderBy=` + e || defaultValue, {scroll: false});
    };
  return <div>
      <Select onValueChange={handleChange}>
          <SelectTrigger className="w-10 bg-white focus-visible:ring-0 focus-visible:ring-offset-0"></SelectTrigger>
          <SelectContent className="bg-white px-2" defaultValue={defaultValue}>
            <h3 className="text-lg py-1 font-semibold">Sort comments:</h3>
            <SelectItem
              value="top"
              className="hover:bg-gray-300 cursor-pointer"
            >
              <p className="text-base font-medium">Top</p>
              <p className="text-sm text-gray-600">
                Most upvoted and relevant comments will be first
              </p>
            </SelectItem>
            <SelectItem
              value="latest"
              className="hover:bg-gray-300 cursor-pointer"
            >
              <p className="text-base font-medium">Latest</p>
              <p className="text-sm text-gray-600">
                Most recent comments will be first
              </p>
            </SelectItem>
            <SelectItem
              value="oldest"
              className="hover:bg-gray-300 cursor-pointer"
            >
              <p className="text-base font-medium">Oldest</p>
              <p className="text-sm text-gray-600">
                The oldest comments will be first
              </p>
            </SelectItem>
          </SelectContent>
        </Select>
  </div>;
};

export default SortComments;