import express from "express";
import connection from './src/db/redis.js'; // bas import karo, connect() nahi
import emailqueue from "./src/queue/example.queue.js";
import "./src/queue/example.worker.js";
import streamRouter from "./src/routes/stream.route.js";
import { io } from "./src/utils/socket.js";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.get("/hello", (req, res) => {
    res.send("Hello World!");
});

app.post("/send-email", async (req, res) => {
    const { email, message } = req.body;
    if (!email || !message) {
        return res.status(400).json({ error: 'Email and message are required!' });
    }
    const job = await emailqueue.add('sendWelcomeEmail', {
        to: email,
        body: message,
    });

    return res.json({
        success: true,
        message: 'Email task enqueued!',
        jobId: job.id
    })
    // await mailqueue.add("email", { to: email, body: message });
});

io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);
})

io.on("disconnect", () => {
    console.log("User Disconnected");
})

app.use("/stream", streamRouter);

app.listen(3000, () => {
    console.log("Example app listening on port 3000!");
});