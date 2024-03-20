import io, { Socket } from 'socket.io-client';

export default class AudioStreamerSocket {
    socket: Socket
    onStart = () => { };
    onData = (_data: unknown) => { };
    onError = (_error: unknown) => { };

    constructor(socket: Socket) {
        this.socket = socket;
    }

    bindEvents() {
        this.stop(false);
        this.socket.on('stream-data', this.onData);
        this.socket.on('stream-error', this.onError);
        this.socket.on('stream-started', this.onStart);
    };

    start(config?: {  }) {
        this.bindEvents();
        this.socket.emit('start-stream', config);
    }
    send(event: string, data: unknown) {
        this.socket.emit(event, data);
    }

    stop(emit = true) {
        if (emit) this.socket.emit('stop-stream');
        this.socket.off('stream-data', this.onData);
        this.socket.off('stream-error', this.onError);
        this.socket.off('stream-started', this.onStart);
    }
}