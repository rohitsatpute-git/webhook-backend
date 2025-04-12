import { Queue } from "bullmq";
import IORedis from 'ioredis';

const connection = new IORedis('redis://localhost:6379');

const retryQueue = new Queue('retry-queue', {
  connection
});

export default retryQueue;
