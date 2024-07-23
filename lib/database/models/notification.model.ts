import mongoose, { Document, models, Schema } from 'mongoose';

interface INotification extends Document {
    user: mongoose.Schema.Types.ObjectId;
    type: 'post' | 'comment' | 'upvote' | 'community';
    reference: mongoose.Schema.Types.ObjectId;
    content: string;
    read: boolean;
    link?: string;
    createdAt: Date;
}

const notificationSchema: Schema<INotification> = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['post', 'comment', 'upvote', 'community'], required: true },
    reference: { type: mongoose.Schema.Types.ObjectId, required: true },
    content: { type: String, required: true },
    read: { type: Boolean, default: false },
    link: { type: String },
    createdAt: { type: Date, default: Date.now }
});

const Notification = models.Notification || mongoose.model<INotification>('Notification', notificationSchema);
export default Notification ;