import express from "express";
import { dbConnection } from "./src/db/redis.js";

const app = express();
app.use(express.json());

dbConnection();

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.get("/hello", (req, res) => {
    res.send("Hello World!");
});

app.listen(3000, () => {
    console.log("Example app listening on port 3000!");
});