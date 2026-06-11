import { Worker } from "bullmq";
import connection from "../db/redis.js";

const emailWorker = new Worker('EmailQueue', async (job) => {
    console.log(`\n⚙️ [Job ${job.id}]: Processing started...`);
    console.log(`📧 Sending email to: ${job.data.to}`);
    console.log(`💬 Message: ${job.data.body}`);

    await new Promise((resolve) => setTimeout(resolve, 4000));

    console.log(`✅ [Job ${job.id}]: Email sent successfully!\n`);
}, {
     connection,
     concurrency: 10,
     limiter: {
        max: 50,
        duration: 1000,
     },
    });


emailWorker.on('completed', (job) => {
    console.log(`🎉 Job completed: ${job.id}`);
});

emailWorker.on('failed', (job, err) => {
    console.error(`❌ Job failed: ${job.id} → ${err.message}`);
});

export default emailWorker;