import { auth, currentUser } from "@clerk/nextjs";
import { Stories } from "./stories";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  BookmarkIcon,
  EllipsisVerticalIcon,
  HeartIcon,
  MessageCircleIcon,
  Share2Icon,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { badgeVariants } from "@/components/ui/badge";
import Link from "next/link";
import { CreatePost } from "./_components/CreatePost";
import { getCommunitiesJoinedByUser } from "@/lib/actions/user.actions";
import { getAllPosts } from "@/lib/actions/post.action";
import moment from "moment";
import FeedPost from "@/components/shared/Posts/FeedPost";

export default async function Home() {
  const { userId } = auth();
  const user = await currentUser();
  const { data } = await getCommunitiesJoinedByUser();
  const { data: posts } = await getAllPosts();
  return (
    <>
      {userId && <Stories />}
      {userId && <CreatePost communities={data} />}
      <div className="flex items-center gap-2 text-xs" id="sortBy">
        <div className="border h-0 w-full"></div>
        <div className="flex flex-row text-xs min-w-fit">
          <Select>
            <SelectTrigger className="bg-gray-100 border-gray-100 text-gray-600 text-xs focus:ring-0 focus:border-none focus:ring-offset-0 focus:ring-opacity-0 focus:border-transparent focus:border-collapse active:border-collapse">
              <SelectValue placeholder="Latest" />
            </SelectTrigger>
            <SelectContent className="bg-white text-gray-600 border-none text-xs">
              <SelectGroup>
                <SelectItem value="latest" defaultChecked>
                  Latest
                </SelectItem>
                <SelectItem value="popular">Popular</SelectItem>
                <SelectItem value="trending">Trending</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div id="posts">
        <div className="flex flex-col gap-3">
          {posts && posts[0] && (
            <FeedPost post={posts[0]} showBanner={true} />
          )}
          {posts?.slice(1).map((post: any) => (
            // <div className="bg-white rounded-xl p-2">
            //   <div className="flex flex-row gap-2 items-center">
            //     <Avatar>
            //       <AvatarImage
            //         src={post.author.profilePicture}
            //         alt={post.author.firstName + " " + post.author.lastName}
            //       />
            //       <AvatarFallback>
            //         {post.author.firstName[0] + post.author.lastName[0]}
            //       </AvatarFallback>
            //     </Avatar>
            //     <div className="flex flex-col">
            //       <span className="text-sm font-medium flex flex-row items-center">
            //         {posts[0].author.firstName + " " + posts[0].author.lastName}
            //         <span className="text-xs text-gray-500">
            //           &nbsp;@{post.author.username} &nbsp;
            //         </span>
            //         <span className="text-xs flex flex-row items-center gap-2">
            //           {post.community && <>in</>}
            //           {post.community && (
            //             <Link
            //               className={
            //                 badgeVariants({ variant: "outline" }) +
            //                 " flex flex-row gap-1 hover:bg-indigo-500 hover:text-white"
            //               }
            //               href={`/community/${post.community._id}`}
            //             >
            //               <Image
            //                 src={post.community.icon}
            //                 width={20}
            //                 height={20}
            //                 alt={post.community.name}
            //                 className="rounded-full"
            //               />
            //               {post.community.name}
            //             </Link>
            //           )}
            //         </span>
            //       </span>
            //       <span className="text-xs text-gray-500">
            //         {moment(post.createdAt).fromNow()}
            //       </span>
            //     </div>
            //     <EllipsisVerticalIcon className="w-5 h-5 text-gray-500 ml-auto cursor-pointer" />
            //   </div>
            //   <div className="mt-2 p-1">
            //     <Link
            //       className="text-sm font-medium"
            //       href={`/post/${post._id}`}
            //     >
            //       <span className="text-xl font-medium">
            //         {post.title.length > 80
            //           ? post.title.slice(0, 80) + "..."
            //           : post.title}
            //       </span>
            //     </Link>
            //     <div className="flex mt-1 gap-x-2">
            //       {post.tags.map((tag: any) => (
            //         <Link
            //           className={badgeVariants({ variant: "primary" })}
            //           href={`/tag/${tag._id}`}
            //           key={tag._id}
            //         >
            //           {tag.name}
            //         </Link>
            //       ))}
            //     </div>
            //   </div>
            //   <hr className="mt-2 border-gray-200" />
            //   <div className="flex flex-row gap-6 mt-2 p-2 *:flex *:flex-row *:gap-2 *:items-center">
            //     <div>
            //       <HeartIcon className="w-4 h-4 text-gray-500" />
            //       <span className="text-xs">10</span>
            //       <span className="text-xs max-sm:hidden">Likes</span>
            //     </div>
            //     <div>
            //       <MessageCircleIcon className="w-4 h-4 text-gray-500" />
            //       <span className="text-xs max-sm:hidden">5 Comments</span>
            //     </div>
            //     <div>
            //       <Share2Icon className="w-4 h-4 text-gray-500" />
            //       <span className="text-xs max-sm:hidden">Share</span>
            //     </div>
            //     <BookmarkIcon className="w-4 h-4 text-gray-500 ml-auto" />
            //   </div>
            // </div>
            <FeedPost key={post._id} post={post} showBanner={false} />
          ))}
          
        </div>
      </div>
    </>
  );
}
