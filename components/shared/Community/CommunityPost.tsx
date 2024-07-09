import { badgeVariants } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { BookmarkIcon, EllipsisVerticalIcon, HeartIcon, MessageCircleIcon, Share2Icon } from "lucide-react";
import Link from "next/link";
import React from "react";

const CommunityPost = () => {
  return (
    <div>
      {new Array(5).fill(0).map((_, i) => (
        <div className="bg-white rounded-xl p-4 mt-3" key={i}>
          <div className="flex flex-row gap-2 items-center">
            <Avatar>
              <AvatarImage src="/images/man.jpg" alt="Sujith Kumar" className="h-10 w-10 rounded-full" />
              <AvatarFallback>S K</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Sujith Kumar</span>
              <span className="text-xs text-gray-500">2 hours ago</span>
            </div>
            <EllipsisVerticalIcon className="w-5 h-5 text-gray-500 ml-auto cursor-pointer" />
          </div>
          <div className="mt-2 p-1">
            <Link className="text-sm font-medium" href={`/post/${i}`}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vel
              nibh nec nunc ultricies eleifend vitae eget justo. Nulla facilisi.
              Donec id nunc ac elit ultricies ultricies. Nullam consectetur
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi
              exercitationem fugiat a quia non quae, quam dolorem nobis
              repudiandae et!
            </Link>
            <div className="flex mt-1 gap-x-2">
              <Link
                className={badgeVariants({ variant: "primary" })}
                href={`/post/${i}`}
              >
                Java
              </Link>
              <Link
                className={badgeVariants({ variant: "primary" })}
                href={`/post/${i}`}
              >
                Java
              </Link>
              <Link
                className={badgeVariants({ variant: "primary" })}
                href={`/post/${i}`}
              >
                Java
              </Link>
            </div>
          </div>
          <hr className="mt-2 border-gray-200" />
          <div className="flex flex-row gap-6 mt-2 p-2 *:flex *:flex-row *:gap-2 *:items-center">
            <div>
              <HeartIcon className="w-4 h-4 text-gray-500" />
              <span className="text-xs max-sm:hidden">10 Likes</span>
            </div>
            <div>
              <MessageCircleIcon className="w-4 h-4 text-gray-500" />
              <span className="text-xs max-sm:hidden">5 Comments</span>
            </div>
            <div>
              <Share2Icon className="w-4 h-4 text-gray-500" />
              <span className="text-xs max-sm:hidden">Share</span>
            </div>
            <BookmarkIcon className="w-4 h-4 text-gray-500 ml-auto" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommunityPost;
