import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  content: String,
  platform: {
    type: String,
    enum: ['linkedin', 'gmail']
  },
  recipientContext: {
    name: String,
    profile: String,
    subject: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Message', messageSchema);