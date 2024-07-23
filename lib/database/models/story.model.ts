import mongoose, { Document } from "mongoose";


export interface IStory extends Document {
    owner: mongoose.Schema.Types.ObjectId;
    imageUrl: string;
    createdAt: Date;
}

export interface IStoryView extends Document {
    story: mongoose.Schema.Types.ObjectId;
    userID: mongoose.Schema.Types.ObjectId;
    createdAt: Date;
}

const storySchema = new mongoose.Schema<IStory>({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    imageUrl: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: "24h" },
}, { timestamps: true });

const storyViewSchema = new mongoose.Schema<IStoryView>({
    story: { type: mongoose.Schema.Types.ObjectId, ref: "Story", required: true },
    userID: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    createdAt: { type: Date, default: Date.now, expires: "24h" }
}, { timestamps: true });

const Story = mongoose.models.Story || mongoose.model<IStory>("Story", storySchema);
const StoryView = mongoose.models.StoryView || mongoose.model<IStoryView>("StoryView", storyViewSchema);

export { Story, StoryView };