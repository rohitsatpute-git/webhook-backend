import axios from 'axios';

const simulateWebhook = async () => {
  try {
    const response = await axios.post('http://localhost:9000/webhooks/events', {
      source: 'github',
      data: {
        action: 'push',
        repository: 'example-repo',
        sender: 'test-user',
      }
    });

    console.log('✅ Webhook sent:', response.data);
  } catch (error) {
    console.error('❌ Error sending webhook:', error.response?.data || error.message);
  }
};

simulateWebhook();
