import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import fs from 'fs';

const port = process.env.PORT || 4000;
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

var dir = __dirname + '/audios';
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir,);
}

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('start-stream', () => {
        console.log('start-stream');
        socket.emit('stream-started');
    })
    socket.on('stream-data', async (chunk) => {
        console.log(chunk);
        fs.writeFileSync(`./audios/audio-${Math.ceil(Math.random() * 1000)}.wav`, Buffer.from(new Uint8Array(chunk)));
    })
    socket.on('stop-stream', () => {
        console.log('stop-stream');
        socket.emit('stream-ended');
    })
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});