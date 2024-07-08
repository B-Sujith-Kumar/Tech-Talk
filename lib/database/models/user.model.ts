import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
    clerkId: string;
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
    bio?: string;
    profilePicture?: string;
    githubLink?: string;
    linkedinLink?: string;
    followers?: mongoose.Schema.Types.ObjectId[];
    following?: mongoose.Schema.Types.ObjectId[];
    followedTags?: mongoose.Schema.Types.ObjectId[];
    firstLogin?: boolean;
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
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] }],
    followedTags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag", default: [] }],
    firstLogin: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model<IUser>("User", userSchema);
export default User;