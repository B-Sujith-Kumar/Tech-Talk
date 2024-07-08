import mongoose, { Document, models, Schema } from "mongoose";

export interface ITag extends Document {
    _id?: mongoose.Schema.Types.ObjectId;
    name: string;
    posts: mongoose.Schema.Types.ObjectId[];
    followers: mongoose.Schema.Types.ObjectId[];
    communities: mongoose.Schema.Types.ObjectId[];
    createdAt: Date;
}

const tagSchema: Schema<ITag> = new Schema({
    name: { type: String, required: true, unique: true },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    communities: [{ type: mongoose.Schema.Types.ObjectId, ref: "Community" }],
    createdAt: { type: Date, default: Date.now }
});

const Tag = models.Tag || mongoose.model<ITag>("Tag", tagSchema);
export default Tag;