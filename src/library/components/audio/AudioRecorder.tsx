import React, { useState, useEffect, useRef } from "react";
import { Microphone, Record } from "@phosphor-icons/react";
import styles from "./AudioRecorder.module.scss";

interface AudioRecorderProps {
  onRecordingStart?: () => void;
  onRecordingStop?: (recording: Blob | File | null) => void;
  chunkLength?: number;
}

const AudioRecorder = ({
  onRecordingStart,
  onRecordingStop,
}: AudioRecorderProps) => {
  const [recording, setRecording] = useState<boolean>(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const chunksRef = useRef<BlobPart[]>([]);

  const startRecording = () => {
    onRecordingStart && onRecordingStart();
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream: MediaStream) => {
        const newMediaRecorder = new MediaRecorder(stream, {
          mimeType: "audio/webm",
        });
        setMediaRecorder(newMediaRecorder);
        setRecording(true);
      });
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setRecording(false);
    }
  };

  useEffect(() => {
    if (mediaRecorder) {
      mediaRecorder.start();

      mediaRecorder.ondataavailable = (e: BlobEvent) => {
        chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        chunksRef.current = [];
        onRecordingStop && onRecordingStop(blob);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mediaRecorder]);

  return (
    <button
      onMouseDown={startRecording}
      onMouseUp={stopRecording}
      className={`flex items-center justify-start w-full bg-white/20 rounded-lg p-4 gap-2 ${
        recording ? styles.listening : ""
      }`}
    >
      <div className="text-lg">
        {recording ? <Record width="bold" /> : <Microphone weight="bold" />}
      </div>
      <h3 className="text-lg font-bold">
        {recording ? "Stop Recording" : "Start Recording"}
      </h3>
    </button>
  );
};

export default AudioRecorder;
