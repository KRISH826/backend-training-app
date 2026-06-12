import {Queue} from "bullmq"
import connection from "../db/redis.js";

const emailqueue = new Queue("EmailQueue", {
    connection,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: "exponential",
            delay: 1000,
        },
    }
});

export default emailqueue