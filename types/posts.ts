import mongoose from "mongoose";

export interface IFeedPost{
    _id: mongoose.Schema.Types.ObjectId;
    author: {
        _id: mongoose.Schema.Types.ObjectId;
        firstName: string;
        lastName: string;
        profilePicture: string;
    };
    title: string;
    coverImage: string;
    content: string;
    tags: [{
        _id: mongoose.Schema.Types.ObjectId;
        name: string;
    }];
    comments: String[];
    views: number;
    upvotes: [{
        user: mongoose.Schema.Types.ObjectId;
        _id: mongoose.Schema.Types.ObjectId;
        createdAt: Date;
        updatedAt: Date;
    }];
    downvotes: [{
        user: mongoose.Schema.Types.ObjectId;
        _id: mongoose.Schema.Types.ObjectId;
        createdAt: Date;
        updatedAt: Date;
    }];
    createdAt: Date;
    updatedAt: Date;
    __v: number;
    engagementScore: number;
}