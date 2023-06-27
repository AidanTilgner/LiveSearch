import { useEffect, useState } from "react";
import styles from "./Notes.module.scss";

interface NotesProps {
  transcripts: string[];
  viewingTranscript?: string;
}

function Notes({ transcripts, viewingTranscript }: NotesProps) {
  const [transcriptsRun, setTranscriptsRun] = useState<string[]>([]);
  const [transcriptsToRun, setTranscriptsToRun] = useState<string[]>([]);
  const [notes, setNotes] = useState<
    { title: string; content: string; transcript: string }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);

  const getNotes = async (transcript: string) => {
    setLoading(true);
    const response = await fetch("/api/text/extract-information", {
      method: "POST",
      body: JSON.stringify({
        transcript,
        mode: "notes",
      }),
    });
    setLoading(false);

    const data = await response.json();

    if (!data.data) {
      return [];
    }

    const notes = data.data.map((d: any) => {
      return {
        title: d.title,
        content: d.content,
        transcript,
      };
    });

    return notes;
  };

  useEffect(() => {
    if (transcripts.length > 0) {
      setTranscriptsToRun(
        transcripts.filter((t) => {
          return !transcriptsRun.includes(t);
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transcripts]);

  useEffect(() => {
    const withoutDuplicates = transcriptsToRun.filter((t) => {
      return transcriptsRun.indexOf(t) === -1;
    });
    withoutDuplicates.forEach(async (t) => {
      const notes = await getNotes(t);
      setNotes((prev) => [...prev, ...notes]);
      setTranscriptsRun((prev) => [...prev, t]);
      setTranscriptsToRun((prev) => {
        return prev.filter((p) => {
          return p !== t;
        });
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transcriptsToRun]);

  return (
    <div className="w-full h-full flex flex-col">
      <h2 className="opacity-75 text-lg w-full grow-0 font-bold pb-2 box-border flex items-center gap-2">
        Notes
        {loading && <span className="circleLoader" />}
      </h2>
      <div className={`${styles.scrollStyles} box-border`}>
        {notes.length > 0 ? (
          notes.map((n, i) => {
            return (
              <div
                key={i}
                className={`${
                  viewingTranscript === n.transcript
                    ? "border-l-1 border-l-white border-l-2 pl-3"
                    : ""
                }`}
              >
                <h3 className="text-base font-medium mb-1">{n.title}</h3>
                <p className="text-sm font-regular mb-3">{n.content}</p>
              </div>
            );
          })
        ) : (
          <p className="text-sm font-regular">
            No notes yet. Try recording something!
          </p>
        )}
      </div>
    </div>
  );
}

export default Notes;
