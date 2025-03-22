import mongoose, { Schema, Document } from "mongoose";

// User interface
export interface IUser extends Document {
  googleId: string;
  name: string;
  email: string;
  picture: string;
  posts: [Object];
}

// Updated User Schema with Embedded Posts
const UserSchema: Schema = new Schema({
  googleId: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  picture: { type: String, required: true },
  posts: { type: [Object], default: [] },
});

export default mongoose.model<IUser>("User", UserSchema);
