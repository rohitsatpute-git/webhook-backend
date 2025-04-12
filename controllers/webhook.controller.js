import Webhook from "../models/Webhook.js";
import WebhookEvent from "../models/WebhookEvent.js";
import retryQueue from '../jobs/Queues/retryQueue.js'

export const subscribeWebhook = async (req, res) => {
  const { source, callbackUrl } = req.body;
  if (!source || !callbackUrl) return res.status(400).json({ msg: 'Source and callbackUrl required' });

  const webhook = new Webhook({
    userId: req.user.id,
    source,
    callbackUrl
  });

  await webhook.save();
  res.status(201).json({ msg: 'Subscribed successfully', webhook });
};

export const getAllSubscribedWebhook = async (req, res) => {
  try {
    const webhooks = await Webhook.find({ userId: req.user.id });
    res.json(webhooks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }

}

export const triggerEvent = async (req, res) => {
  const { source, data } = req.body;

  if (!source || !data) {
    return res.status(400).json({ msg: 'Missing source or data' });
  }

  try {
    const webhooks = await Webhook.find({ source });

    if (webhooks.length === 0) {
      return res.status(404).json({ msg: 'No subscribers for this source' });
    }

    const deliveredTo = [];

    for (const webhook of webhooks) {
      try {
        // await axios.post(webhook.callbackUrl, data);
        console.log("callback url", webhook.callbackUrl)
        await fetch(webhook.callbackUrl, {
          method: 'post',
          body: JSON.stringify(data)
        })
        deliveredTo.push(webhook.callbackUrl);
      } catch (err) {
        console.error(`Failed to send to ${webhook.callbackUrl}:`, err.message);    
        retryQueue.add('task 1', { callbackUrl: webhook.callbackUrl, event: data }, { attempts: 3 })
        // return res.status(500).json({ msg: 'Server error' });

        // Retry logic can be added here
      }
    }

    // Save event log in DB
    const eventLog = new WebhookEvent({
      source,
      data,
      deliveredTo
    });

    await eventLog.save();
    console.log("sent webhook_event")
    req.io.emit('webhook_event', {
      source,
      data,
      deliveredTo,
      timestamp: new Date()
    });

    res.json({ msg: `Event processed and sent to ${deliveredTo.length} subscriber(s)` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }

}

export const deleteSubscription = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const webhook = await Webhook.findOneAndDelete({ _id: id, userId });
    if (!webhook) return res.status(404).json({ message: 'Webhook not found or unauthorized' });

    res.status(200).json({ message: 'Webhook subscription cancelled successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error cancelling subscription', error: err.message });
  }

}
