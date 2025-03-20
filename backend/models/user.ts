import mongoose, { Schema, Document } from "mongoose";

// Step interface
interface IStep {
  measurements: string[];
  procedure: string;
  time: number[]; // [min, max]
}

// Recipe (Post) interface
interface IPost {
  name: string;
  steps: IStep[];
  createdAt: Date;
}

// User interface
export interface IUser extends Document {
  googleId: string;
  name: string;
  email: string;
  picture: string;
  posts: IPost[];
}

// Step Schema
const StepSchema: Schema = new Schema({
  measurements: { type: [String], required: true },
  procedure: { type: String, required: true },
  time: { type: [Number], required: true }, // [min, max] time range
});

// Recipe (Post) Schema
const PostSchema: Schema = new Schema({
  name: { type: String, required: true },
  steps: { type: [StepSchema], required: true },
  createdAt: { type: Date, default: Date.now },
});

// Updated User Schema with `posts`
const UserSchema: Schema = new Schema({
  googleId: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  picture: { type: String, required: true },
  posts: { type: [PostSchema], default: [] }, // Embedding posts inside the user
});

export default mongoose.model<IUser>("User", UserSchema);
