"use client";

import AudioStreamer from "@src/libs/audio-lib";
import AudioStreamerSocket from "@src/libs/socket-lib";
import React, { useEffect, useRef, useState } from "react";

export default function Home() {
  const [isPlaying, setIsPlaying] = useState(false);
  const microphone = useRef<AudioStreamer | null>(null);
  const audioSocket = useRef<AudioStreamerSocket | null>(null);

  useEffect(() => {
    if (isPlaying) {
      start();
    } else {
      stop();
    }
  }, [isPlaying])

  function start() {
    microphone.current = new AudioStreamer();
    audioSocket.current = new AudioStreamerSocket();

    microphone.current.onData = (chunk) => {
      audioSocket.current?.send("stream-data", chunk);
    };
    microphone.current.onClose = () => {
      console.log("Microphone closed");
    };

    // microphone.current.onError = (error) => {
    //   console.error("Microphone error:", error);
    //   audioSocket.current?.stop();
    //   microphone.current?.stop();
    // };

    audioSocket.current.onStart = () => {
      console.log("started-streaming");
      setIsPlaying(true);
      microphone.current?.start();
    };

    // audioSocket.current.onData = (data) => {
    //   console.log("Data from server:", data);
    // };
    // audioSocket.current.onError = (error) => {
    //   microphone.current?.stop();
    //   // audioSocket.stop();
    //   console.error("Error from server:", error);
    // };
    audioSocket.current.start();
  }

  async function stop() {
    await microphone.current?.stop();
    audioSocket.current?.stop();
    microphone.current = null;
    audioSocket.current = null;
    setIsPlaying(false);
  }

  const toggleIsPlaying = () => {
    setIsPlaying((_prev) => !_prev);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Home</h1>
      <button onClick={toggleIsPlaying}>
        {isPlaying ? "Stop" : "Start"}
      </button>
    </main>
  );
}
