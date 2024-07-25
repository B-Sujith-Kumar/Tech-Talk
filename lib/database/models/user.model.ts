import mongoose, { Document, models, Schema } from "mongoose";

export interface IUser extends Document {
    _id?: mongoose.Schema.Types.ObjectId;
    clerkId: string;
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
    bio?: string;
    profilePicture?: string;
    githubLink?: string;
    linkedinLink?: string;
    location?: string;
    followers?: mongoose.Schema.Types.ObjectId[];
    following?: mongoose.Schema.Types.ObjectId[];
    followedTags?: mongoose.Schema.Types.ObjectId[];
    firstLogin?: boolean;
    moderatorInvites?: mongoose.Schema.Types.ObjectId[];
    commentNotifications?: boolean;
    websiteUrl?: string;
    skills?: string;
    work?: string;
    education?: string;
    currentlyLearning?: string;
    availableFor?: string;
    createdAt?: Date;
}

const userSchema: Schema<IUser> = new Schema({
    clerkId: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    bio: { type: String, default: "" },
    firstName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    profilePicture: { type: String, default: "" },
    githubLink: { type: String, default: "" },
    linkedinLink: { type: String, default: "" },
    location: { type: String, default: "" },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] }],
    followedTags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag", default: [] }],
    firstLogin: { type: Boolean, default: true },
    moderatorInvites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Community", default: [] }],
    commentNotifications: { type: Boolean, default: true },
    websiteUrl: { type: String, default: "" },
    skills: { type: String, default: "" },
    work: { type: String, default: "" },
    education: { type: String, default: "" },
    currentlyLearning: { type: String, default: "" },
    availableFor: { type: String, default: "" },
}, {
    timestamps: true
});

const User = models.User || mongoose.model<IUser>("User", userSchema);
export default User;