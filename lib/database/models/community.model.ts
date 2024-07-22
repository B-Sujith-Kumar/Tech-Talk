import mongoose, { Document, models, Schema } from 'mongoose';

export interface ICommunity extends Document {
    _id?: mongoose.Schema.Types.ObjectId;
    name: string;
    description?: string;
    banner?: string;
    icon?: string;
    createdBy: mongoose.Schema.Types.ObjectId;
    tags: mongoose.Schema.Types.ObjectId[];
    members: mongoose.Schema.Types.ObjectId[];
    moderators: mongoose.Schema.Types.ObjectId[];
    needsReview?: mongoose.Schema.Types.ObjectId[];
    reported?: mongoose.Schema.Types.ObjectId[];
    removed?: mongoose.Schema.Types.ObjectId[];
    moderatorInvites?: mongoose.Schema.Types.ObjectId[];
    createdAt: Date;
}

const communitySchema: Schema<ICommunity> = new Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, default: '' },
    banner: { type: String, default: '' },
    icon: { type: String, default: '' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tags: [{ type: mongoose.Schema.ObjectId, ref: 'Tag', required: true }],
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    moderators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }],
    needsReview: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post', default: []  }],
    reported: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post', default: []  }],
    removed: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post', default: []  }],
    moderatorInvites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }],
}, {
    timestamps: true
});

const Community = models.Community || mongoose.model<ICommunity>('Community', communitySchema);
export default Community