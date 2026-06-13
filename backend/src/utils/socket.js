import {Server} from "socket.io";

export const io = new Server({
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
})

io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);
})

io.on("disconnect", () => {
    console.log("User Disconnected");
})