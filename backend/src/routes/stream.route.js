import express, { Router } from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url"; // 🔥 __dirname ke liye zaroori hai

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.get("/stream-file-text", (req, res) => {
    const filePath = path.resolve(__dirname, "../assests/frank.txt");
    if(!fs.existsSync(filePath)) {
        return res.status(404).send("File not found");
    }

    const readableStream = fs.createReadStream(filePath, {
        highWaterMark: 64 * 1024
    });
    res.setHeader('Content-Type', 'text/plain');
    // res.setHeader('Content-Type', 'application/pdf');
    // res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Transfer-Encoding', 'chunked');

    readableStream.on('data', (chunk) => {
        console.log(`Sending Chunk of Size ${chunk.length}`);
        res.write(chunk);
    })

    readableStream.on('end', () => {
        console.log("File Transfer Completed");
        res.end();
    })

    readableStream.on('error', (err) => {
        console.error(err);
        res.status(500).send(err.message);
    })


})

export default router;


