import mongoose, { Document, models, Schema } from 'mongoose';

export interface ICollection extends Document {
    _id?: string;
    name: string;
    description: string;
    creator: mongoose.Schema.Types.ObjectId;
    posts?: mongoose.Schema.Types.ObjectId[];
    createdAt: Date;
}

const collectionSchema: Schema<ICollection> = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post', default: []}],
    createdAt: { type: Date, default: Date.now }
});

const Collections = models?.Collections || mongoose.model<ICollection>('Collections', collectionSchema);
export default Collections;