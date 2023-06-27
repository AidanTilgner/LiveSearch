"use client";
import Record from "@/library/components/audio/Record";
import DisplayTranscript from "@/library/components/display/Transcript";
import Notes from "@/library/components/information/Notes";
import { useState } from "react";

export default function Home() {
  const [transcript, setTranscript] = useState<string[]>([]);
  const [viewingTranscript, setViewingTranscript] = useState<string>("");

  return (
    <main className="flex h-screen flex-col md:flex-row items-center md:items-start gap-12 md:gap-24">
      <div className="w-full mb-12">
        <Record
          onTranslationReceived={(t) => {
            setTranscript((prev) => [...prev, t]);
          }}
        />
      </div>
      <div className="h-1/2 md:h-full w-full flex flex-col gap-12">
        <div className="flex flex-col items-center justify-center w-full h-1/2 box-border">
          <DisplayTranscript
            transcript={transcript}
            onSetViewingTranscript={(t) => {
              setViewingTranscript(t);
            }}
          />
        </div>
        <div className="flex flex-col items-center justify-center w-full h-1/2 box-border">
          <Notes
            transcripts={transcript}
            viewingTranscript={viewingTranscript}
          />
        </div>
      </div>
    </main>
  );
}
