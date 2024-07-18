"use client";
import { ITag } from "@/lib/database/models/tag.model";
import { IUser } from "@/lib/database/models/user.model";
import React, { useEffect, useState } from "react";
import TagCard from "./TagCard";

const FollowingTagsContainer = ({
  tags,
  currentUser,
}: {
  tags: ITag[];
  currentUser: IUser;
}) => {
  const [search, setSearch] = useState("");
  const [tagsList, setTagsList] = useState<ITag[]>(tags);

  useEffect(() => {
    const filteredTags = search.trim() === "" ? tags : tags.filter((tag) =>
      tag.name.toLowerCase().includes(search.toLowerCase())
    );
    setTagsList(filteredTags);
  }, [search, tags]);

  return (
    <div>
      <div className="flex items-center mt-6 gap-3">
        <input
          type="text"
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          placeholder="Search tags..."
          className="flex-1 py-2 px-3 border-2 border-gray-300 bg-inherit rounded-lg"
        />
        <button className="bg-indigo-500 outline-indigo-500 text-white px-4 py-3 h-full rounded-md text-sm font-semibold">
          Search
        </button>
      </div>
      <div className="mt-8 grid grid-cols-3 gap-3 max-sm:grid-cols-2 max-[410px]:grid-cols-1">
        {tagsList.map((tag: ITag) => (
          <TagCard tag={tag} key={tag._id?.toString()} currentUser={currentUser} />
        ))}
      </div>
    </div>
  );
};

export default FollowingTagsContainer;
