// "use client";

// import { IPostPopulated } from "@/types";
// import React, { useEffect, useState } from "react";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { SelectValueProps } from "@radix-ui/react-select";
// import Image from "next/image";
// import { IUser } from "@/lib/database/models/user.model";
// import { Textarea } from "@/components/ui/textarea";
// import { addComment } from "@/lib/actions/post.action";
// import { useToast } from "@/components/ui/use-toast";
// import { Dot } from "lucide-react";
// import moment from "moment";
// import Link from "next/link";

// const Comments = ({
//   post,
//   currentUser,
// }: {
//   post: IPostPopulated;
//   currentUser: IUser;
// }) => {
//   const [sort, setSort] = useState<"Top" | "Latest" | "Oldest">("Top");
//   const [content, setContent] = useState("");
//   const [comments, setComments] = useState(post.comments);
//   const [loading, setLoading] = useState(false);
//   const { toast } = useToast();
//   const handleChange = (value: string) => {
//     setSort(value as "Top" | "Latest" | "Oldest");
//   };

//   useEffect(() => {
//     const fetchComments = async () => {
//         setComments(post.comments);
//     }
//     fetchComments();
//   }, [comments]);

//   const handleSubmitComment = async () => {
//     setLoading(true);
//     try {
//         const { status, comment } = await addComment(
//           post._id!,
//           content,
//           currentUser._id?.toString()!
//         );
//         if (status === 200) {
//             toast({
//                 title: "Comment posted",
//                 description: "Your comment has been posted successfully",
//             })
//             setContent("");
//             setComments([...comments, comment]);
//         }
//     } catch (error) {
//         toast({
//             title: "Sorry! An error occurred",
//             description: "An error occurred while posting the comment",
//         });
//     } finally {
//         setLoading(false);
//     }
// };

//   return (
//     <div className="px-2">
//       <div className="flex items-center mt-6 gap-3">
//         <h1 className="text-2xl font-semibold ">
//           {sort} comments ({post.comments.length})
//         </h1>
//         <Select onValueChange={handleChange}>
//           <SelectTrigger className="w-10 bg-white focus-visible:ring-0 focus-visible:ring-offset-0"></SelectTrigger>
//           <SelectContent className="bg-white px-2">
//             <h3 className="text-lg py-1 font-semibold">Sort comments:</h3>
//             <SelectItem
//               value="Top"
//               className="hover:bg-gray-300 cursor-pointer"
//             >
//               <p className="text-base font-medium">Top</p>
//               <p className="text-sm text-gray-600">
//                 Most upvoted and relavant comments will be first
//               </p>
//             </SelectItem>
//             <SelectItem
//               value="Latest"
//               className="hover:bg-gray-300 cursor-pointer"
//             >
//               <p className="text-base font-medium">Latest</p>
//               <p className="text-sm text-gray-600">
//                 Most recent comments will be first
//               </p>
//             </SelectItem>
//             <SelectItem
//               value="Oldest"
//               className="hover:bg-gray-300 cursor-pointer"
//             >
//               <p className="text-base font-medium">Oldest</p>
//               <p className="text-sm text-gray-600">
//                 The oldest comments will be first
//               </p>
//             </SelectItem>
//           </SelectContent>
//         </Select>
//       </div>
//       <div className="flex gap-4 items-start mt-6">
//         <Image
//           src={currentUser.profilePicture!}
//           width={42}
//           height={42}
//           alt="Profile picture"
//           className="aspect-square w-10 h-10 rounded-full mt-3"
//         />
//         <div className="flex flex-col flex-1 gap-3">
//           <Textarea
//             placeholder="Add a comment"
//             value={content}
//             onChange={(e) => setContent(e.target.value)}
//           />
//           <button
//             className={`text-sm ${
//               content.trim().length === 0
//                 ? "bg-indigo-400 cursor-not-allowed"
//                 : "bg-indigo-600 cursor-pointer"
//             } font-semibold text-white w-fit px-4 py-2 rounded-md`}
//             disabled={content ? false : true}
//             onClick={handleSubmitComment}
//           >
//             {loading ? "Posting..." : "Post comment"}
//           </button>
//         </div>
//       </div>
//       {
//         comments.map((comment: any) => (
//           <div key={comment._id?.toString()} className="mt-6">
//             <div className="flex gap-4 items-start">
//               <Image
//                 src={comment.author.profilePicture}
//                 width={42}
//                 height={42}
//                 alt="Profile picture"
//                 className="aspect-square w-10 h-10 rounded-full mt-3"
//               />
//               <div className="flex flex-col flex-1 gap-3 border px-3 py-4 rounded-lg">
//                 <div className="flex items-center">
//                   <Link href={`/user/${comment.author._id}`} className="font-semibold">
//                     {comment.author.firstName + " " + comment.author.lastName}
//                   </Link>
//                   <Dot className="text-gray-600"/>
//                   <p className="text-gray-500 text-sm">
//                     {moment(comment.createdAt).fromNow()}
//                   </p>
//                 </div>
//                 <p className="text-base">{comment.content}</p>
//               </div>
//             </div>
//           </div>
//         ))
//       }
//     </div>
//   );
// };

// export default Comments;

"use client";

import { IPostPopulated } from "@/types";
import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { IUser } from "@/lib/database/models/user.model";
import { Textarea } from "@/components/ui/textarea";
import { addComment } from "@/lib/actions/post.action";
import { useToast } from "@/components/ui/use-toast";
import { Dot } from "lucide-react";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Comments = ({
  post,
  currentUser,
}: {
  post: IPostPopulated;
  currentUser: IUser;
}) => {
  const [sort, setSort] = useState<"Top" | "Latest" | "Oldest">("Top");
  const [content, setContent] = useState("");
  const [comments, setComments] = useState(post.comments);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleChange = (value: string) => {
    setSort(value as "Top" | "Latest" | "Oldest");
  };

  useEffect(() => {
    setComments(post.comments);
  }, [post.comments]);


  const handleSubmitComment = async () => {
    setLoading(true);
    try {
      const { status, comment } = await addComment(
        post._id!,
        content,
        currentUser._id?.toString()!
      );
      if (status === 200) {
        toast({
          title: "Comment posted",
          description: "Your comment has been posted successfully",
        });
        setContent("");
        setComments((prevComments) => [...prevComments, comment]);
      }
    } catch (error) {
      toast({
        title: "Sorry! An error occurred",
        description: "An error occurred while posting the comment",
      });
    } finally {
      setLoading(false);
    //   router.refresh();
    }
  };

  return (
    <div className="px-2">
      <div className="flex items-center mt-6 gap-3">
        <h1 className="text-2xl font-semibold ">
          {sort} comments ({comments.length})
        </h1>
        <Select onValueChange={handleChange}>
          <SelectTrigger className="w-10 bg-white focus-visible:ring-0 focus-visible:ring-offset-0"></SelectTrigger>
          <SelectContent className="bg-white px-2">
            <h3 className="text-lg py-1 font-semibold">Sort comments:</h3>
            <SelectItem
              value="Top"
              className="hover:bg-gray-300 cursor-pointer"
            >
              <p className="text-base font-medium">Top</p>
              <p className="text-sm text-gray-600">
                Most upvoted and relevant comments will be first
              </p>
            </SelectItem>
            <SelectItem
              value="Latest"
              className="hover:bg-gray-300 cursor-pointer"
            >
              <p className="text-base font-medium">Latest</p>
              <p className="text-sm text-gray-600">
                Most recent comments will be first
              </p>
            </SelectItem>
            <SelectItem
              value="Oldest"
              className="hover:bg-gray-300 cursor-pointer"
            >
              <p className="text-base font-medium">Oldest</p>
              <p className="text-sm text-gray-600">
                The oldest comments will be first
              </p>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex gap-4 items-start mt-6">
        <Image
          src={currentUser.profilePicture!}
          width={42}
          height={42}
          alt="Profile picture"
          className="aspect-square w-10 h-10 rounded-full mt-3"
        />
        <div className="flex flex-col flex-1 gap-3">
          <Textarea
            placeholder="Add a comment"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button
            className={`text-sm ${
              content.trim().length === 0
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-600 cursor-pointer"
            } font-semibold text-white w-fit px-4 py-2 rounded-md`}
            disabled={content.trim().length === 0}
            onClick={handleSubmitComment}
          >
            {loading ? "Posting..." : "Post comment"}
          </button>
        </div>
      </div>
      {comments.map((comment: any) => (
        <div key={comment._id?.toString()} className="mt-6">
          <div className="flex gap-4 items-start">
            <Image
              src={comment.author.profilePicture}
              width={42}
              height={42}
              alt="Profile picture"
              className="aspect-square w-10 h-10 rounded-full mt-3"
            />
            <div className="flex flex-col flex-1 gap-3 border px-3 py-4 rounded-lg">
              <div className="flex items-center">
                <Link href={`/user/${comment.author._id}`} className="font-semibold">
                  {comment.author.firstName + " " + comment.author.lastName}
                </Link>
                <Dot className="text-gray-600" />
                <p className="text-gray-500 text-sm">
                  {moment(comment.createdAt).fromNow()}
                </p>
              </div>
              <p className="text-base">{comment.content}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Comments;
