import {Queue} from "bullmq"
import connection from "./src/db/redis.js"

const emailqueue = new Queue("EmailQueue", {connection})

export default emailqueue