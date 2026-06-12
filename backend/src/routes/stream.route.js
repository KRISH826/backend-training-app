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


router.get("/stream-file-video", (req, res) => {
    const filePath = path.resolve(__dirname, "../assests/spotify-design.mp4");
    if(!fs.existsSync(filePath)) {
        return res.status(404).send("File not found");
    }
    const videoSize = fs.statSync(filePath).size;
    const range = req.headers.range;

    if(!range) {
        res.setHeader('Content-Length', videoSize);
        res.setHeader('Content-Type', 'video/mp4');
        return fs.createReadStream(filePath).pipe(res);
    }

    const CHUNK_SIZE = 1024 *  1024;

    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

    const contentLength = end - start + 1;

    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Range": "bytes",
        "Content-Length": `${contentLength}`,
        "Content-Type": "video/mp4"
    }

    res.writeHead(206, headers);

    const videoStream = fs.createReadStream(filePath, {start, end});
    videoStream.pipe(res);

})

export default router;


