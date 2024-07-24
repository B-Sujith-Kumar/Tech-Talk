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