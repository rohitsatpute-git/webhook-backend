import mongoose from 'mongoose';

const webhookEventSchema = new mongoose.Schema({
  source: String,
  data: mongoose.Schema.Types.Mixed,
  deliveredTo: [String],
  createdAt: { type: Date, default: Date.now }
});

const WebhookEvent = mongoose.model('WebhookEvent', webhookEventSchema);
export default WebhookEvent;
