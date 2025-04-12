import mongoose from "mongoose";

const webhookSchema = new mongoose.Schema({
  userId: String,
  source: String,
  callbackUrl: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Webhook', webhookSchema);
