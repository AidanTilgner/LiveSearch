"use client";
import AudioRecorder from "./AudioRecorder";

interface RecordProps {
  onTranslationReceived?: (translation: string) => void;
}

function Record({ onTranslationReceived }: RecordProps) {
  const submitAudio = async (audioFile: Blob) => {
    const fileVersion = new File([audioFile], "audio.webm", {
      type: "audio/webm",
    });
    const formdata = new FormData();
    formdata.append("audio", fileVersion);
    const res = await fetch("/api/audio", {
      method: "POST",
      body: formdata,
    });

    const data = await res.json();

    onTranslationReceived && onTranslationReceived(data.data);
  };

  return (
    <div className="w-full">
      <AudioRecorder
        onRecordingStop={(audioFile) => {
          if (audioFile) submitAudio(audioFile);
        }}
        chunkLength={1000}
      />
    </div>
  );
}

export default Record;
