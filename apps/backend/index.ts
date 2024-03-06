import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import fs from 'fs';

const port = process.env.PORT || 4000;
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('index.html');
});

const streams: Record<string, fs.WriteStream> = {};


io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('start-stream', () => {
        console.log('start-stream');

        streams[socket.id] = fs.createWriteStream(`./audio-${Math.ceil(Math.random() * 100)}.webm`);
        socket.emit('stream-started');
    })
    socket.on('stream-data', async (chunk) => {
        console.log(chunk);
        const fileStream = streams[socket.id]
        if (fileStream) fileStream.write(Buffer.from(new Uint8Array(chunk)));
    })
    socket.on('stop-stream', () => {
        console.log('stop-stream');

        const fileStream = streams[socket.id]
        if (fileStream) fileStream.end(); delete streams[socket.id];
        socket.emit('stream-ended');
    })
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});