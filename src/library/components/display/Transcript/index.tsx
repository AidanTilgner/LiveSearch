"use client";
import { useEffect, useRef } from "react";
import styles from "./index.module.scss";

interface DisplayTranscriptProps {
  transcript: string[];
  onSetViewingTranscript?: (transcript: string) => void;
}

function DisplayTranscript({
  transcript,
  onSetViewingTranscript,
}: DisplayTranscriptProps) {
  const getFilteredSentence = (sentence: string) => {
    let filtered = sentence;
    if (!sentence) {
      return "...";
    }
    return filtered;
  };

  const transcriptRef = useRef<HTMLDivElement>(null);

  // on a new transcript, scroll to the bottom
  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scroll({
        top: transcriptRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [transcript]);

  return (
    <div className="w-full h-full flex flex-col">
      <h2 className="opacity-75 text-lg w-full font-bold pb-2 box-border">
        Transcript
      </h2>
      <div ref={transcriptRef} className={`${styles.scrollStyles} box-border`}>
        {transcript.length > 0 ? (
          transcript.map((t, i, a) => {
            const length = a.length;
            const isLast = i === length - 1;
            return (
              <h3
                key={i}
                className={`text-sm font-regular mb-1 ${
                  isLast
                    ? "border-l-1 border-l-white border-l-2 pl-3"
                    : "opacity-50"
                } cursor-pointer hover:opacity-75`}
                onClick={() => {
                  if (onSetViewingTranscript) {
                    onSetViewingTranscript(t);
                  }
                }}
              >
                {getFilteredSentence(t)}
              </h3>
            );
          })
        ) : (
          <p className="text-sm font-regular">
            No transcript yet. Try recording something!
          </p>
        )}
      </div>
    </div>
  );
}

export default DisplayTranscript;
