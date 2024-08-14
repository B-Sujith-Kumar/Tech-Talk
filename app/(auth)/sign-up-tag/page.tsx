"use client";
import { followTags, getPopularTags } from "@/lib/actions/tag.actions";
import { ITag } from "@/types";
import { auth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";

const Page = () => {
  const [tags, setTags] = React.useState([]);
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);
  const { userId } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const handlePopularTags = async () => {
      const res = await getPopularTags();
      if (res.status === 200) {
        setTags(res.tags);
      }
    };
    handlePopularTags();
  }, []);

  const handleSelectTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = async () => {
    const res = await followTags(userId!, selectedTags);
    if (res.status === 200) {
      router.push("/");
    }
  };

  return (
    <div className="w-full pb-10">
      <div className={`bg-white lg:max-w-4xl max-w-2xl max-sm:max-w-md max-[715px]:mt-24 mx-auto px-10 py-8 shadow-xl rounded-lg ${selectedTags ? 'mt-16' : ''}`}>
        <p className="font-bold text-3xl">What are you interested in?</p>
        <p className="mt-2 text-gray-600">Follow tags to customize your feed</p>
        <p className="mt-2 text-sm text-gray-500">
          {selectedTags.length} tags selected
        </p>
        <div className="grid grid-cols-3 max-[715px]:grid-cols-2 max-[465px]:grid-cols-1 gap-4 mt-4">
          {tags.map((tag: ITag, index) => (
            <div
              key={index}
              className={`flex items-center justify-between border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                selectedTags.includes(tag.name)
                  ? "bg-indigo-50 border-indigo-500"
                  : "bg-white border-gray-200"
              }`}
              onClick={() => handleSelectTag(tag.name)}
            >
              <div>
                <p className="font-semibold text-black">{`${tag.name}`}</p>
                <p className="text-gray-500 text-sm">
                  {tag.posts.length} posts
                </p>
              </div>
              <div className="flex items-center justify-center">
                {selectedTags.includes(tag.name) ? (
                  <div className="flex items-center justify-center w-6 h-6 bg-indigo-500 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-white"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586l-2.293-2.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-6 h-6 border-2 border-gray-400 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                    </svg>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        {selectedTags.length > 0 && (
          <div className="flex justify-end mt-4">
            <button
              className="bg-indigo-500 text-white font-semibold px-6 py-2 rounded-md"
              onClick={handleSubmit}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
