"use client";

import AudioStreamer from "@src/libs/audio-lib";
import AudioStreamerSocket from "@src/libs/audio-socket-lib";
import socket from "@src/libs/socket-lib";
import React, { useEffect, useRef, useState } from "react";
import AudioRecorder from "audio-recorder-polyfill";

window.MediaRecorder = AudioRecorder;

export default function Home() {
  const [isPlaying, setIsPlaying] = useState(false);
  const microphone = useRef<AudioStreamer | null>(null);
  const audioSocket = useRef<AudioStreamerSocket | null>(null);
  const [autoGain, setAutoGain] = useState(false);
  const [noiseSuppression, setNoiseSuppression] = useState(false);
  const [speakerInput, setSpeakerInput] = useState(false);
  const [timeSlice, setTimeSlice] = useState(5000);
  const [isChunkingEnabled, setIsChunkEnabled] = useState(false);

  useEffect(() => {
    if (isPlaying) {
      start();
    } else {
      stop();
    }
  }, [isPlaying]);

  async function start() {
    microphone.current = new AudioStreamer(
      {
        audio: {
          autoGainControl: autoGain,
          noiseSuppression: noiseSuppression,
          echoCancellation: speakerInput,
          channelCount: 1,
        },
      },
      timeSlice
    );
    audioSocket.current = new AudioStreamerSocket(socket);

    microphone.current.onData = (chunk) => {
      audioSocket.current?.send("stream-data", chunk);
    };
    microphone.current.onClose = () => {
      console.log("Microphone closed");
    };

    microphone.current.onError = (error) => {
      console.error("Microphone error:", error);
      toggleIsPlaying(false);
    };

    audioSocket.current.onStart = () => {
      console.log("started-streaming");
      microphone.current?.start();
    };

    audioSocket.current.onData = (data) => {
      console.log("Data from server:", data);
    };

    audioSocket.current.onError = (error) => {
      console.error("Error from server:", error);
      toggleIsPlaying(false);
    };

    audioSocket.current.start({});
  }

  async function stop() {
    await microphone.current?.stop();
    audioSocket.current?.stop();
    microphone.current = null;
    audioSocket.current = null;
  }

  const toggleIsPlaying = (bool?: boolean) => {
    setIsPlaying((_prev) => bool ?? !_prev);
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-2">
      <div className="">
        <div className="flex flex-col gap-5">
          <h1 className="text-4xl">Realtime Audio Streaming to Backend</h1>
          <div className="flex gap-10">
            <label className="checkbox-label">
              <span>Auto Gain</span>
              <input
                onChange={() => setAutoGain(!autoGain)}
                value={String(autoGain)}
                name="autoGain"
                type="checkbox"
              />
            </label>
            <label className="checkbox-label">
              <span>Noise Suppression</span>
              <input
                onChange={() => setNoiseSuppression(!noiseSuppression)}
                value={String(noiseSuppression)}
                name="noiseSuppression"
                type="checkbox"
              />
            </label>
            <label className="checkbox-label">
              <span>Speaker Input</span>
              <input
                onChange={() => setSpeakerInput(!speakerInput)}
                value={String(speakerInput)}
                name="speakerInput"
                type="checkbox"
              />
            </label>
          </div>
          <div className="flex gap-10">
            <label className="checkbox-label">
              <span>Chunk TimeSlice</span>
              <input
                inputMode="numeric"
                min="5000"
                max="120000"
                maxLength={6}
                minLength={4}
                onChange={(e) => setTimeSlice(Number(e.target.value))}
                value={String(timeSlice)}
                name="speakerInput"
                type="number"
              />
            </label>
          </div>
          <div>
            <button className="btn w-full" onClick={() => toggleIsPlaying()}>
              {isPlaying ? "Stop" : "Start"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
