import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  resumeSummary: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('User', userSchema);