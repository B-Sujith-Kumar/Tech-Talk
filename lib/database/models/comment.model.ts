import mongoose, { Document, models, Schema } from 'mongoose';

export interface IComment extends Document {
    author: mongoose.Schema.Types.ObjectId;
    post: mongoose.Schema.Types.ObjectId;
    content: string;
    replies?: mongoose.Schema.Types.ObjectId[];
    upvotes?: mongoose.Schema.Types.ObjectId[];
    downvotes?: mongoose.Schema.Types.ObjectId[];
    createdAt: Date;
}

const commentSchema: Schema<IComment> = new Schema({
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    content: { type: String, required: true },
    replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: []}],
    upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: []}],
    downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: []}],
    createdAt: { type: Date, default: Date.now }
});

const Comment = models.Comment || mongoose.model<IComment>('Comment', commentSchema);
export default Comment;