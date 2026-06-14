import express from "express";
import connection from './src/db/redis.js'; // bas import karo, connect() nahi
import emailqueue from "./src/queue/example.queue.js";
import "./src/queue/example.worker.js";
import streamRouter from "./src/routes/stream.route.js";
import { io } from "./src/utils/socket.js";
import cors from "cors";
import {createServer} from "http"


const app = express();
const httpServer = createServer(app);
io.attach(httpServer);
app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"]
}));
app.use(express.urlencoded({ extended: true }));
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

    socket.on('joinRoom', async ({name}) => {
        console.log(`User Joined Room: ${name}`);
        await socket.join("room1");

        // // send to all notification who is new member add
        // io.to("room1").emit("roomNotice", name)

        // broardcast (send them all excluding yourself)
        socket.to("room1").emit("roomNotice", name);
    })

    socket.on("chat-message", async(msg) => {
        socket.to("room1").emit("chat-message", msg);
    })
})

io.on("disconnect", () => {
    console.log("User Disconnected");
})

app.use("/stream", streamRouter);

const port=4400;
httpServer.listen(port, () => {
    console.log(`Server listening on port ${port}`);
}) 