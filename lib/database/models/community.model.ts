import mongoose, { Document, Schema } from 'mongoose';

interface ICommunity extends Document {
    name: string;
    description?: string;
    banner?: string;
    icon?: string;
    tags: mongoose.Schema.Types.ObjectId[];
    members: mongoose.Schema.Types.ObjectId[];
    createdAt: Date;
}

const communitySchema: Schema<ICommunity> = new Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, default: '' },
    banner: { type: String, default: '' },
    icon: { type: String, default: '' },
    tags: [{ type: mongoose.Schema.ObjectId, ref: 'Tag', required: true }],
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createdAt: { type: Date, default: Date.now }
});

const Community = mongoose.model<ICommunity>('Community', communitySchema);
export default Community