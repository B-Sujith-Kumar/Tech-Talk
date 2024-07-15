import { IComment } from "@/lib/database/models/comment.model";
import { IUser } from "@/lib/database/models/user.model";
import { Dot, MessageCircle } from "lucide-react";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import CommentOptions from "./CommentOptions";
import { UpDownVoteComment } from "./UpDownVoteComment";
import { Textarea } from "@/components/ui/textarea";
import ReplyComment from "./ReplyComment";
import { IPostPopulated } from "@/types";

const ViewComments = ({
  comments,
  currentUser,
  post
}: {
  comments: IComment[];
  currentUser: IUser;
  post: IPostPopulated;
}) => {
  return (
    <div>
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
                <div className="flex items-center justify-between">
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
                  <div>
                    {comment.author._id.toString() ===
                      currentUser._id?.toString() && (
                      <CommentOptions comment={comment} user={currentUser} post={post}  />
                    )}
                  </div>
                </div>
                <p className="text-base">{comment.content}</p>
              </div>
              <div className="flex items-center gap-2">
                <UpDownVoteComment
                  comment={comment}
                  currentUser={currentUser}
                />
                <ReplyComment comment={comment} currentUser={currentUser} />
              </div>
              <div className="flex gap-3">
                <button></button>
              </div>
            </div>
          </div>
          {comment.replies &&
            comment.replies.map((reply: any) => (
              <div
                key={reply._id?.toString()}
                className="mt-4 ml-12 max-sm:ml-7"
              >
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
                      <div className="flex items-center justify-between">
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
                        <div>
                          {reply.author._id.toString() ===
                            currentUser._id?.toString() && (
                            <CommentOptions
                              comment={reply}
                              user={currentUser}
                              post={post}
                            />
                          )}
                        </div>
                      </div>
                      <p className="text-base">{reply.content}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <UpDownVoteComment
                        comment={reply}
                        currentUser={currentUser}
                        reply={true}
                        postId = {comment.post}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      ))}
    </div>
  );
};

export default ViewComments;
