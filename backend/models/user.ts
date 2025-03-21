import mongoose, { Schema, Document } from "mongoose";

// Step interface
interface IStep {
  measurements: string[];
  procedure: string;
  time: number[]; // [min, max]
}

// Recipe interface
interface IRecipe {
  steps: IStep[];
}

// Post (Recipe) interface
interface IPost {
  title: string;
  description: string;
  images: string[];
  imageUrl: string;
  recipe: IRecipe;
  tags: string[];
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

// Recipe Schema (Containing Steps)
const RecipeSchema: Schema = new Schema({
  steps: { type: [StepSchema], required: true },
});

// Updated Post (Recipe) Schema
const PostSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  images: { type: [String], default: [] }, // Array of image URLs
  imageUrl: { type: String, required: true }, // Main image URL
  recipe: { type: RecipeSchema, required: true }, // Recipe containing steps
  tags: { type: [String], default: [] }, // Tags for categorization
  createdAt: { type: Date, default: Date.now },
});

// Updated User Schema with Embedded Posts
const UserSchema: Schema = new Schema({
  googleId: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  picture: { type: String, required: true },
  posts: { type: [PostSchema], default: [] }, // Embedding posts inside the user
});

export default mongoose.model<IUser>("User", UserSchema);
