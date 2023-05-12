import Queue from "bull";
import { sendMailWithGoogle } from "./sendMailWithGoogle.js";
// 1. Initiating the Queue
const sendMailQueue = new Queue("sendMail");


// 3. Consumer
sendMailQueue
  .on('completed', (job, result) => {
    console.log(`Job ${job.id} completed`);
  })
  .on('failed', (job, err) => {
    console.log(`Job ${job.id} failed with error ${err}`);
  });

sendMailQueue.process(async (job) => {
  console.log("Mail sending process has started")
  return await sendMailWithGoogle(job.data);
});

sendMailQueue.isReady().then(() => {
  console.log('Mail worker is running');
});

export default sendMailQueue;
