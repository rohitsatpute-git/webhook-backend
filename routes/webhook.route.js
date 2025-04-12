import express from 'express'
const router = express.Router();
import auth from '../middleware/auth.js';
import { subscribeWebhook, getAllSubscribedWebhook, triggerEvent, deleteSubscription } from '../controllers/webhook.controller.js';

router.post('/subscribe', auth, subscribeWebhook);
router.get('/', auth, getAllSubscribedWebhook);
router.post('/events', triggerEvent);
router.delete('/:id', auth, deleteSubscription)

export default router
