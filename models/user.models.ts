import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  fitnessData: {
    height: Number,
    weight: Number,
    goal: String,
    planType: String, 
  }
},
{ timestamps: true });

export default mongoose.models.User || mongoose.model("User", userSchema);
