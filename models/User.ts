import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  skills: [String],
  interests: [String],
  experience: String,
  education: String,
  resumeText: String,
  bio: String,
  profileCompleted: { type: Boolean, default: false },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);