import mongoose, { Document, models, Schema } from "mongoose";

export interface ITag extends Document {
    _id?: mongoose.Schema.Types.ObjectId;
    name: string;
    posts?: mongoose.Schema.Types.ObjectId[];
    followers?: mongoose.Schema.Types.ObjectId[];
    communities?: mongoose.Schema.Types.ObjectId[];
    createdAt?: Date;
}

const tagSchema: Schema<ITag> = new Schema({
    name: { type: String, required: true, unique: true },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post", default: []}],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: []}],
    communities: [{ type: mongoose.Schema.Types.ObjectId, ref: "Community", default: []}],
}, {
    timestamps: true
});

const Tag = models.Tag || mongoose.model<ITag>("Tag", tagSchema);
export default Tag;