import mongoose, { Schema, Document } from 'mongoose';

export interface IUserProfile extends Document {
  name: string;
  userId: string;
  bio?: string;
  avatarUrl?: string;
  socialLinks?: {
    instagram?: string;
    twitter?: string;
  };
}

const UserProfileSchema = new Schema<IUserProfile>(
  {
    userId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    bio: { type: String, default: '' },
    avatarUrl: { type: String, default: '' },
    socialLinks: {
      instagram: { type: String, default: '' },
      twitter: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

export default mongoose.models.UserProfile ||
  mongoose.model<IUserProfile>('UserProfile', UserProfileSchema);
