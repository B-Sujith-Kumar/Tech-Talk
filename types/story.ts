import mongoose from "mongoose";

export interface IPopulatedStory {
    _id: string;
    imageUrl: string;
    owner: {
        _id: mongoose.Schema.Types.ObjectId;
        username: string;
        firstName: string;
        lastName: string;
        profilePicture: string;
    };
    createdAt: Date;
    isViewed: boolean;
}

export interface IPopulatedStoryCurrentUser {
    _id: mongoose.Schema.Types.ObjectId;
    owner: {
        _id: mongoose.Schema.Types.ObjectId;
        username: string;
        firstName: string;
        lastName: string;
        profilePicture: string;
    };
    imageUrl: string;
    imageKey: string;
    createdAt: Date;
    views: [
        {
            _id: mongoose.Schema.Types.ObjectId;
            createdAt: Date;
            user: {
                _id: mongoose.Schema.Types.ObjectId;
                username: string;
                firstName: string;
                lastName: string;
                profilePicture: string;
            };
        }
    ]
}