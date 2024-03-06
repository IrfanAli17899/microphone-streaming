import io from 'socket.io-client';

const socket = io("http://localhost:4000");

socket.on('connect', () => {
    console.log('Connected to server');
});


export default class AudioStreamerSocket {
    onStart = () => { };
    onData = (_data: unknown) => { };
    onError = (_error: unknown) => { };

    constructor() { }

    bindEvents() {
        this.stop(false);
        socket.on('stream-data', this.onData);
        socket.on('stream-error', this.onError);
        socket.on('stream-started', this.onStart);
        // socket.on('disconnect', this.stop);
    };

    start() {
        this.bindEvents();
        socket.emit('start-stream', {
            encoding: 'LINEAR16',
            sampleRateHertz: 16000,
            languageCode: 'en-US',
            interimResults: true
        });
    }
    send(event: string, data: unknown) {
        socket.emit(event, data);
    }

    stop(emit = true) {
        if(emit) socket.emit('stop-stream');
        socket.off('stream-data', this.onData);
        socket.off('stream-error', this.onError);
        socket.off('stream-started', this.onStart);
    }
}