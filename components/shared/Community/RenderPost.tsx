import React from "react";
import "@/app/post/[postID]/post-style.css";
import "./styles.css"

const RenderPost = ({ content }: { content: string }) => {
    return <div dangerouslySetInnerHTML={{ __html: content }} className="text-base"></div>;
};

export default RenderPost;