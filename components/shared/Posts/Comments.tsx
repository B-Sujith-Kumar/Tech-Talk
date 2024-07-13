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
import { addComment, addReply } from "@/lib/actions/post.action";
import { useToast } from "@/components/ui/use-toast";
import { Dot, MessageCircle } from "lucide-react";
import moment from "moment";
import Link from "next/link";
import { UpDownVoteComment } from "./UpDownVoteComment";
import { useUser } from "@clerk/nextjs";

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
  const [replyContent, setReplyContent] = useState("");
  const [activeReply, setActiveReply] = useState<string | null>(null);
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
    }
  };

  const handleReplySubmit = async (commentId: string) => {
    setLoading(true);
    try {
      const { status, replyComment } = await addReply(
        commentId,
        replyContent,
        currentUser._id?.toString()!
      );
      if (status === 200) {
        toast({
          title: "Reply posted",
          description: "Your reply has been posted successfully",
        });
        setReplyContent("");
        setActiveReply(null);
        setComments((prevComments: any) =>
          prevComments.map((comment: any) =>
            comment._id === commentId
              ? { ...comment, replies: [...comment.replies, replyComment] }
              : comment
          )
        );
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Sorry! An error occurred",
        description: "An error occurred while posting the reply",
      });
    } finally {
      setLoading(false);
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
            <div className="flex flex-col gap-3 flex-1">
              <div className="flex flex-col flex-1 gap-3 border px-3 py-4 rounded-lg">
                <div className="flex items-center">
                  <Link
                    href={`/user/${comment.author._id}`}
                    className="font-semibold"
                  >
                    {comment.author.firstName + " " + comment.author.lastName}
                  </Link>
                  <Dot className="text-gray-600" />
                  <p className="text-gray-500 text-sm">
                    {moment(comment.createdAt).fromNow()}
                  </p>
                </div>
                <p className="text-base">{comment.content}</p>
              </div>
              <div className="flex items-center gap-2">
                <UpDownVoteComment
                  comment={comment}
                  currentUser={currentUser}
                />
                <div
                  className="flex gap-1 items-center cursor-pointer"
                  onClick={() => setActiveReply(comment._id)}
                >
                  <MessageCircle className="w-4 h-4 text-gray-600" />
                  <p className="text-gray-600 text-sm">Reply</p>
                </div>
              </div>
              {activeReply === comment._id && (
                <div className="flex gap-4 items-start mt-4">
                  <Image
                    src={currentUser.profilePicture!}
                    width={32}
                    height={32}
                    alt="Profile picture"
                    className="aspect-square w-8 h-8 rounded-full"
                  />
                  <div className="flex flex-col flex-1 gap-3">
                    <Textarea
                      placeholder="Add a reply"
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                    />
                    <div className="flex gap-3">
                      <button
                        className={`text-sm ${
                          replyContent.trim().length === 0
                            ? "bg-indigo-400 cursor-not-allowed"
                            : "bg-indigo-600 cursor-pointer"
                        } font-semibold text-white w-fit px-4 py-2 rounded-md`}
                        disabled={replyContent.trim().length === 0}
                        onClick={() => handleReplySubmit(comment._id)}
                      >
                        {loading ? "Posting..." : "Post reply"}
                      </button>
                      <button>
                        <p
                          className="text-gray-600 text-sm cursor-pointer"
                          onClick={() => setActiveReply(null)}
                        >
                          Cancel
                        </p>
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {comment.replies &&
                comment.replies.map((reply: any) => (
                  <div key={reply._id?.toString()} className="mt-4 ml-10 max-sm:ml-0">
                    <div className="flex gap-4 items-start">
                      <Image
                        src={reply.author.profilePicture}
                        width={32}
                        height={32}
                        alt="Profile picture"
                        className="aspect-square w-8 h-8 rounded-full mt-3"
                      />
                      <div className="flex flex-col gap-3 flex-1">
                        <div className="flex flex-col flex-1 gap-3 border px-3 py-4 rounded-lg">
                          <div className="flex items-center">
                            <Link
                              href={`/user/${reply.author._id}`}
                              className="font-semibold"
                            >
                              {reply.author.firstName +
                                " " +
                                reply.author.lastName}
                            </Link>
                            <Dot className="text-gray-600" />
                            <p className="text-gray-500 text-sm">
                              {moment(reply.createdAt).fromNow()}
                            </p>
                          </div>
                          <p className="text-base">{reply.content}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <UpDownVoteComment
                            comment={reply}
                            currentUser={currentUser}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Comments;
