"use client";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { addComment } from "@/lib/actions/post.action";
import { IUser } from "@/lib/database/models/user.model";
import { IPostPopulated } from "@/types";
import Image from "next/image";
import React from "react";

const AddComment = ({post, currentUser} : {post: IPostPopulated, currentUser: IUser}) => {
  const [content, setContent] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const { toast } = useToast();
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
          }
        } catch (error) {
          toast({
            title: "Sorry! An error occurred",
            description: "An error occurred while posting the comment",
          });
        } finally {
          setLoading(false);
        }
  }
  return (
    <div className="flex gap-4 items-start mt-6">
         <Image
           src={currentUser?.profilePicture!}
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
  );
};

export default AddComment;
