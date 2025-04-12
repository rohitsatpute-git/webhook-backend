import redisIO from 'ioredis';
import { Worker } from 'bullmq';

const connection = new redisIO({ url: 'redis://localhost:6379', maxRetriesPerRequest: null });
// await connection.connect();

const retryWorker = new Worker('retry-queue', async(job) => {
    const { callbackUrl, event } = job.data;

    try {
      const res = await axios.post(callbackUrl, event);
      console.log('✅ Retry successful:', res.status);
    } catch (err) {
      console.log('❌ Retry failed again:', err.message);
  
      if (job.attemptsMade >= 2) {
        console.log('❗ Max retry attempts reached. Giving up.');
      } else {
        throw err; // Will auto-retry based on job config
      }
    }
}, {
    connection,


})

