"use client";

import AudioStreamer from "@src/libs/audio-lib";
import AudioStreamerSocket from "@src/libs/socket-lib";
import React, { useState } from "react";

export default function Home() {
  const [isPlaying, setIsPlaying] = useState(false);
  const microphone = new AudioStreamer();
  const audioSocket = new AudioStreamerSocket();

  microphone.onData = (chunk) => {
    audioSocket.send("stream-data", chunk);
  };
  microphone.onClose = () => {
    console.log("Microphone closed");
  };

  microphone.onError = (error) => {
    console.error("Microphone error:", error);
    audioSocket.stop();
    microphone.stop();
  };

  audioSocket.onStart = () => {
    console.log("started-streaming");
    microphone.start();
  };

  audioSocket.onData = (data) => {
    console.log("Data from server:", data);
  };
  audioSocket.onError = (error) => {
    microphone.stop();
    // audioSocket.stop();
    console.error("Error from server:", error);
  };

  function start() {
    audioSocket.start();
    setIsPlaying(true);
  }

  async function stop() {
    await microphone.stop();
    audioSocket.stop();
    setIsPlaying(false);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Home</h1>
      <button onClick={isPlaying ? stop : start}>
        {isPlaying ? "Stop" : "Start"}
      </button>
    </main>
  );
}
