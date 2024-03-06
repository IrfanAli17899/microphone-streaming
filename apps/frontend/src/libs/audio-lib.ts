
export default class AudioStreamer {
    globalStream: MediaStream | null = null;
    recorder: MediaRecorder | null = null;
    onData = (_data: unknown) => { };
    onClose = () => { };
    onError = (_error: unknown) => { };

    //audioStream constraints
    constraints = {
        audio: true,
        video: false
    };

    constructor() { }

    dataAvailableHandler = (e: BlobEvent) => {
        if (e.data.size > 0) {
            this.onData(e.data);
        }
    }

    async start() {
        try {
            this.globalStream = await navigator.mediaDevices.getUserMedia(this.constraints);
            this.recorder = new MediaRecorder(this.globalStream, { mimeType: 'audio/webm' });
            this.recorder.addEventListener('dataavailable', this.dataAvailableHandler);
            this.recorder.start(1000);
        } catch (error) {
            this.onError(error);
        }
    }

    async stop() {
        try {
            // Stop the MediaRecorder
            if (this.recorder) {
                this.recorder.removeEventListener('dataavailable', this.dataAvailableHandler);
                this.recorder.stop();
                this.recorder = null;
            }

            // Stop all tracks on the stream
            if (this.globalStream) {
                this.globalStream.getTracks().forEach(track => track.stop());
                this.globalStream = null;
            }

            // Notify about the closure
            this.onClose();
        } catch (error) {
            this.onError(error);
        }

    };
}