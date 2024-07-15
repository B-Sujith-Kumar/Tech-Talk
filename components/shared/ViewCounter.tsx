"use client";

import { EyeIcon } from "lucide-react";
import mongoose from "mongoose";
import { useEffect } from "react";
import { updateView } from "@/lib/actions/post.action";
import { IPost } from "@/lib/database/models/post.model";

export default function ViewCounter({
    post
}: {
    post: IPost;
}) {
    useEffect(() => {
        const timer = setTimeout(() => {
            updateViewCount();
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    const updateViewCount = async () => {
        try {
            await updateView(post._id as mongoose.Schema.Types.ObjectId);
        }
        catch (error) {
            console.error('Error updating view count:', error);
        }
    };

    return (
        <>
            <EyeIcon className="w-4 h-4" /> <span className="text-xs font-medium">{post.views}</span>
        </>
    );
};